import os
from typing import Generator, Optional

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

load_dotenv()

# Expect SQLAlchemy URL, e.g.:
# mysql+pymysql://USER:PASS@HOST:PORT/DB?ssl=true
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

Base = declarative_base()

_engine: Optional[Engine] = None
_SessionLocal: Optional[sessionmaker] = None  # type: ignore[var-annotated]

def _normalized_mysql_url(url: str) -> str:
    """
    Ensure the SQLAlchemy URL has the mysql+pymysql dialect so SQLAlchemy can import the driver.
    Allows 'mysql://' and upgrades it to 'mysql+pymysql://'.
    Does NOT inject unsupported ssl_mode. Use '?ssl=true' in DATABASE_URL.
    """
    if not url:
        raise RuntimeError("DATABASE_URL is required and cannot be empty")
    norm = url
    if norm.startswith("mysql://"):
        norm = "mysql+pymysql://" + norm[len("mysql://") :]
    return norm

def init_engine_and_session() -> tuple[Engine, sessionmaker]:
    global _engine, _SessionLocal
    if _engine is not None and _SessionLocal is not None:
        return _engine, _SessionLocal

    url = _normalized_mysql_url(DATABASE_URL)

    _engine = create_engine(
        url,
        pool_pre_ping=True,
        pool_recycle=1800,
        pool_size=5,
        max_overflow=5,
        future=True,
    )

    _SessionLocal = sessionmaker(bind=_engine, autocommit=False, autoflush=False, class_=Session, future=True)

    try:
        with _engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as exc:
        raise RuntimeError(f"Failed to connect to MySQL using DATABASE_URL. Reason: {exc}") from exc

    return _engine, _SessionLocal

def get_db() -> Generator[Session, None, None]:
    _, SessionLocal = init_engine_and_session()
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
