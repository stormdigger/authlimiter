import os
from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")

def get_issuer() -> str:
    if not AUTH0_DOMAIN:
        return ""
    domain = AUTH0_DOMAIN.strip().removesuffix("/")
    if not domain.startswith("http://") and not domain.startswith("https://"):
        domain = f"https://{domain}"
    return domain + "/"

def get_jwks_url() -> str:
    issuer = get_issuer().rstrip("/")
    if not issuer:
        return ""
    return f"{issuer}/.well-known/jwks.json".replace("//.well", "/.well")
