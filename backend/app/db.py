import os
from typing import Generator, Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# Load environment variables from .env if present
load_dotenv()  # loads backend/.env when running from backend directory [attached_file:1]

# Expected format (Aiven MySQL over SSL):
# DATABASE_URL="mysql+pymysql://USER:PASSWORD@HOST:PORT/DB_NAME?ssl_mode=REQUIRED"
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()  # must be non-empty for MySQL [attached_file:1]

Base = declarative_base()  # shared metadata for models [attached_file:1]

_engine: Optional[Engine] = None
_SessionLocal: Optional[sessionmaker] = None  # type: ignore[var-annotated] [attached_file:1]


def _normalized_mysql_url(url: str) -> str:
    """
    Ensure the SQLAlchemy URL has the mysql+pymysql dialect so SQLAlchemy can import the driver.
    Allows 'mysql://' and upgrades it to 'mysql+pymysql://'.
    Also ensures ssl_mode is present for Aiven (REQUIRED by default if missing).
    """
    if not url:
        raise RuntimeError("DATABASE_URL is required for MySQL (Aiven) and cannot be empty")  # fail fast [attached_file:1]

    norm = url
    # Upgrade mysql:// to mysql+pymysql:// for SQLAlchemy if driver not specified
    if norm.startswith("mysql://"):
        norm = "mysql+pymysql://" + norm[len("mysql://") :]  # add driver explicitly [attached_file:1]

    # Inject ssl_mode=REQUIRED if not present (Aiven typically requires SSL)
    # Avoid duplicating query if there is already one
    if "ssl_mode=" not in norm:
        if "?" in norm:
            norm = norm + "&ssl_mode=REQUIRED"
        else:
            norm = norm + "?ssl_mode=REQUIRED"  # safe default for Aiven managed MySQL [attached_file:1]

    return norm  # ready to pass to create_engine [attached_file:1]


def init_engine_and_session() -> tuple[Engine, sessionmaker]:
    """
    Lazily create a global Engine and SessionLocal bound to Aiven MySQL.
    Configures sensible pool settings for PaaS and enables pre-ping to avoid stale connections.
    """
    global _engine, _SessionLocal
    if _engine is not None and _SessionLocal is not None:
        return _engine, _SessionLocal  # reuse existing singletons [attached_file:1]

    url = _normalized_mysql_url(DATABASE_URL)  # validate and normalize URL [attached_file:1]

    # Engine options tuned for managed MySQL (Aiven):
    # - pool_pre_ping: validates connections before use
    # - pool_recycle: reconnect periodically (in seconds) to handle idle timeouts
    # - pool_size/max_overflow: conservative defaults; adjust per workload
    _engine = create_engine(
        url,
        pool_pre_ping=True,
        pool_recycle=1800,  # 30 minutes [attached_file:1]
        pool_size=5,
        max_overflow=5,
        future=True,
    )

    _SessionLocal = sessionmaker(bind=_engine, autocommit=False, autoflush=False, class_=Session, future=True)

    # Optional: sanity check connectivity early
    try:
        with _engine.connect() as conn:
            conn.execute(text("SELECT 1"))  # simple ping [attached_file:1]
    except Exception as exc:
        # Surface a clear error if connectivity fails at boot
        raise RuntimeError(f"Failed to connect to MySQL using DATABASE_URL. Reason: {exc}") from exc  # helpful message [attached_file:1]

    return _engine, _SessionLocal  # return constructed objects [attached_file:1]


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency to provide a DB session with proper cleanup.
    Usage: def endpoint(db: Session = Depends(get_db)): ...
    """
    _, SessionLocal = init_engine_and_session()  # ensure initialized [attached_file:1]
    db = SessionLocal()  # open session [attached_file:1]
    try:
        yield db  # hand to endpoint code [attached_file:1]
    finally:
        db.close()  # always close [attached_file:1]
