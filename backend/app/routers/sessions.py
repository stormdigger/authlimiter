from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Body, Header
from sqlalchemy.orm import Session
from ..db import get_db
from ..models import UserSession
from ..auth import verify_jwt_and_get_claims
from ..schemas import LoginResponse, HeartbeatResponse, ActiveCountResponse, SessionInfo
import os

router = APIRouter(prefix="/sessions", tags=["sessions"])
SESSION_MAX = int(os.getenv("SESSION_MAX_CONCURRENT", "3"))

def _list_active_sessions(db: Session, user_sub: str) -> List[UserSession]:
    return (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.revoked_at.is_(None))
        .order_by(UserSession.created_at.asc())
        .all()
    )

@router.post("/login", response_model=LoginResponse)
def login_device(
    *,
    db: Session = Depends(get_db),
    claims: dict = Depends(verify_jwt_and_get_claims),
    device_id: str | None = None,
    device_id_body: str | None = Body(None),
    device_id_header: str | None = Header(None, alias="X-Device-Id"),
):
    device_id = device_id or device_id_body or device_id_header
    if not device_id:
        raise HTTPException(status_code=400, detail="device_id required")

    user_sub = claims.get("sub")
    now = datetime.utcnow()

    existing = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.device_id == device_id)
        .first()
    )
    if existing:
        if existing.revoked_at is not None:
            active = _list_active_sessions(db, user_sub)
            return LoginResponse(
                status="revoked",
                active_sessions=[
                    SessionInfo(
                        device_id=s.device_id,
                        created_at=s.created_at,
                        last_seen_at=s.last_seen_at,
                        revoked_at=s.revoked_at,
                    )
                    for s in active
                ],
            )
        existing.last_seen_at = now
        db.commit()
        active = _list_active_sessions(db, user_sub)
        return LoginResponse(
            status="ok",
            active_sessions=[
                SessionInfo(
                    device_id=s.device_id, created_at=s.created_at, last_seen_at=s.last_seen_at, revoked_at=s.revoked_at
                )
                for s in active
            ],
        )

    active = _list_active_sessions(db, user_sub)
    if len(active) >= SESSION_MAX:
        return LoginResponse(
            status="limit_exceeded",
            active_sessions=[
                SessionInfo(
                    device_id=s.device_id, created_at=s.created_at, last_seen_at=s.last_seen_at, revoked_at=s.revoked_at
                )
                for s in active
            ],
        )

    sess = UserSession(user_sub=user_sub, device_id=device_id, created_at=now, last_seen_at=now)
    db.add(sess)
    db.commit()
    active = _list_active_sessions(db, user_sub)
    return LoginResponse(
        status="ok",
        active_sessions=[
            SessionInfo(
                device_id=s.device_id, created_at=s.created_at, last_seen_at=s.last_seen_at, revoked_at=s.revoked_at
            )
            for s in active
        ],
    )

@router.post("/evict")
def evict_device(
    *,
    db: Session = Depends(get_db),
    claims: dict = Depends(verify_jwt_and_get_claims),
    device_id: str | None = None,
    device_id_body: str | None = Body(None),
    device_id_header: str | None = Header(None, alias="X-Device-Id"),
):
    user_sub = claims.get("sub")
    device_id = device_id or device_id_body or device_id_header
    if not device_id:
        raise HTTPException(status_code=400, detail="device_id required")
    sess = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.device_id == device_id, UserSession.revoked_at.is_(None))
        .first()
    )
    if not sess:
        raise HTTPException(status_code=404, detail="session not found")
    sess.revoked_at = datetime.utcnow()
    db.commit()
    return {"status": "evicted"}

@router.post("/heartbeat", response_model=HeartbeatResponse)
def heartbeat(
    *,
    db: Session = Depends(get_db),
    claims: dict = Depends(verify_jwt_and_get_claims),
    device_id: str | None = None,
    device_id_body: str | None = Body(None),
    device_id_header: str | None = Header(None, alias="X-Device-Id"),
):
    user_sub = claims.get("sub")
    device_id = device_id or device_id_body or device_id_header
    if not device_id:
        return HeartbeatResponse(revoked=True, message="device_id missing")
    sess = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.device_id == device_id)
        .first()
    )
    if not sess:
        return HeartbeatResponse(revoked=True, message="session missing")
    if sess.revoked_at is not None:
        return HeartbeatResponse(revoked=True, message="session revoked")
    sess.last_seen_at = datetime.utcnow()
    db.commit()
    return HeartbeatResponse(revoked=False)

@router.get("/active", response_model=ActiveCountResponse)
def active_count(*, db: Session = Depends(get_db), claims: dict = Depends(verify_jwt_and_get_claims)):
    user_sub = claims.get("sub")
    count = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.revoked_at.is_(None))
        .count()
    )
    return ActiveCountResponse(active_count=count)

@router.post("/logout")
def logout_device(
    *,
    db: Session = Depends(get_db),
    claims: dict = Depends(verify_jwt_and_get_claims),
    device_id: str | None = None,
    device_id_body: str | None = Body(None),
    device_id_header: str | None = Header(None, alias="X-Device-Id"),
):
    user_sub = claims.get("sub")
    device_id = device_id or device_id_body or device_id_header
    if not device_id:
        return {"status": "ok"}
    sess = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.device_id == device_id, UserSession.revoked_at.is_(None))
        .first()
    )
    if not sess:
        return {"status": "ok"}
    sess.revoked_at = datetime.utcnow()
    db.commit()
    return {"status": "ok"}

@router.post("/revoke_all")
def revoke_all_sessions(*, db: Session = Depends(get_db), claims: dict = Depends(verify_jwt_and_get_claims)):
    user_sub = claims.get("sub")
    now = datetime.utcnow()
    updated = (
        db.query(UserSession)
        .filter(UserSession.user_sub == user_sub, UserSession.revoked_at.is_(None))
        .update({UserSession.revoked_at: now}, synchronize_session=False)
    )
    db.commit()
    return {"revoked": int(updated)}
