from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
import httpx
from functools import lru_cache
from .config import AUTH0_AUDIENCE, get_issuer

security = HTTPBearer(auto_error=True)

@lru_cache(maxsize=1)
def _get_openid_config() -> Dict[str, Any]:
    issuer = get_issuer().rstrip("/")
    if not issuer:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Auth0 issuer not configured")
    url = f"{issuer}/.well-known/openid-configuration"
    with httpx.Client(timeout=5.0) as client:
        r = client.get(url)
        r.raise_for_status()
        return r.json()

@lru_cache(maxsize=1)
def _get_jwks() -> Dict[str, Any]:
    jwks_url = _get_openid_config().get("jwks_uri")
    with httpx.Client(timeout=5.0) as client:
        r = client.get(jwks_url)
        r.raise_for_status()
        return r.json()

def _get_signing_key(token: str) -> Dict[str, Any]:
    unverified = jwt.get_unverified_header(token)
    kid = unverified.get("kid")
    jwks = _get_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token (kid)")

def verify_jwt_and_get_claims(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    token = credentials.credentials
    key = _get_signing_key(token)
    issuer = get_issuer()
    try:
        claims = jwt.decode(token, key, audience=AUTH0_AUDIENCE, issuer=issuer, options={"verify_at_hash": False})
        return claims
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {e}")
