import os, ssl
from typing import Generator, Optional
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

Base = declarative_base()
_engine: Optional[Engine] = None
_SessionLocal: Optional[sessionmaker] = None  # type: ignore[var-annotated]

def _normalized_mysql_url(url: str) -> str:
    if not url:
        raise RuntimeError("DATABASE_URL is required and cannot be empty")
    norm = url
    if norm.startswith("mysql://"):
        norm = "mysql+pymysql://" + norm[len("mysql://"):]
    # strip any ssl params to avoid conflicts
    for bad in ("?ssl=true", "&ssl=true", "?ssl_mode=REQUIRED", "&ssl_mode=REQUIRED"):
        norm = norm.replace(bad, "")
    if norm.endswith("?"):
        norm = norm[:-1]
    return norm

def init_engine_and_session() -> tuple[Engine, sessionmaker]:
    global _engine, _SessionLocal
    if _engine is not None and _SessionLocal is not None:
        return _engine, _SessionLocal

    url = _normalized_mysql_url(DATABASE_URL)

    # Build SSL context that trusts Aiven CA
    ssl_ctx = ssl.create_default_context()
    # Point to the CA you downloaded from Aiven
    ca_path = os.getenv("MYSQL_SSL_CA_PATH", "backend/certs/aiven-ca.pem")
    if os.path.exists(ca_path):
        ssl_ctx.load_verify_locations(cafile=ca_path)
    # Enforce verification
    ssl_ctx.check_hostname = True
    ssl_ctx.verify_mode = ssl.CERT_REQUIRED

    _engine = create_engine(
        url,
        connect_args={"ssl": ssl_ctx},  # PyMySQL expects SSLContext or dict
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
