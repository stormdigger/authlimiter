import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")

engine = None
SessionLocal = None
Base = declarative_base()


def init_engine_and_session():
    global engine, SessionLocal
    if engine is None:
        connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
        engine = create_engine(DATABASE_URL, connect_args=connect_args)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return engine, SessionLocal


def get_db() -> Generator:
    _, Session = init_engine_and_session()
    db = Session()
    try:
        yield db
    finally:
        db.close()


