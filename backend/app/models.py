from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from .db import Base

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    # MySQL requires VARCHAR length; 191 is safe for utf8mb4 indexed columns
    user_sub = Column(String(191), index=True, nullable=False)
    device_id = Column(String(191), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_seen_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    revoked_at = Column(DateTime, nullable=True)
