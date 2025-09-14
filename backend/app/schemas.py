from datetime import datetime
from pydantic import BaseModel


class SessionInfo(BaseModel):
    device_id: str
    created_at: datetime
    last_seen_at: datetime
    revoked_at: datetime | None = None


class LoginResponse(BaseModel):
    status: str  # ok | limit_exceeded
    active_sessions: list[SessionInfo]


class HeartbeatResponse(BaseModel):
    revoked: bool
    message: str | None = None


class ActiveCountResponse(BaseModel):
    active_count: int


