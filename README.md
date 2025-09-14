MyAuthApp — FastAPI + Next.js + Auth0 (N-device concurrent logins)

Overview
- FastAPI backend enforces at most N concurrent devices per user (default 3).
- Next.js frontend with Auth0 login, device-id persistence, and graceful eviction.
- Blocking modal on N+1 login lets the user evict specific sessions or all.

Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- An Auth0 tenant

Directory structure
```
MyAuthApp/
  backend/
  frontend/
  AUTH0_SETUP.md
  README.md
```

1) Clone and install
```
git clone <your-repo-url>
cd MyAuthApp

# Frontend deps
cd frontend
npm install

# Backend venv + deps (Windows PowerShell)
cd ../backend
python -m venv .venv
./.venv/Scripts/Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

2) Configure Auth0
See `AUTH0_SETUP.md` for screenshots/values. Summary:
- Create Regular Web Application (RS256)
- Allowed Callback: http://localhost:3000/api/auth/callback
- Allowed Logout: http://localhost:3000
- Allowed Web Origins: http://localhost:3000
- Create an API (RS256). Copy its Identifier as AUTH0_AUDIENCE.

3) Environment files
Copy examples and fill values.
```
# Frontend
cd ../frontend
copy env.example .env.local   # Windows
```
Fill `.env.local`:
```
AUTH0_SECRET=GENERATE_A_LONG_RANDOM_STRING
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://YOUR_TENANT_REGION.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_AUDIENCE=YOUR_API_IDENTIFIER
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

Backend env:
```
cd ../backend
copy env.example .env
```
Fill `backend/.env`:
```
AUTH0_DOMAIN=YOUR_TENANT_REGION.auth0.com
AUTH0_AUDIENCE=YOUR_API_IDENTIFIER
SESSION_MAX_CONCURRENT=3
DATABASE_URL=sqlite:///./app.db
```

4) Run servers
Backend (port 8000):
```
cd backend
./.venv/Scripts/Activate.ps1
python -m uvicorn app.main:app --reload --port 8000
```

Frontend (port 3000):
```
cd ../frontend
npm run dev
```

Open http://localhost:3000

5) Verify setup
- Frontend env check: open http://localhost:3000/api/env-check → expect `{ ok: true }` and `issuerReachable: true`.
- Backend health: GET http://localhost:8000/health → `{ "status": "ok" }`.
- Login: click Login → Profile. You should see device id and active count.

6) N-device behavior
- Log in on more than N devices: Profile shows a blocking modal listing active sessions.
- Choose Evict on a target or Evict all. Current device auto-retries login.
- Evicted devices detect revocation on heartbeat and are gracefully logged out.

7) Common pitfalls
- AUTH0_ISSUER_BASE_URL must include `https://` prefix.
- AUTH0_AUDIENCE must match the Auth0 API Identifier exactly.
- If port 3000 is busy, stop other Next.js processes. The `dev` script pins to 3000.
- If backend cannot fetch JWKS, re-check `AUTH0_DOMAIN` in backend `.env`.

8) Scripts
- Frontend: `npm run dev | build | start`
- Backend: `python -m uvicorn app.main:app --reload --port 8000`

9) Notes
- SQLite db file `backend/app.db` is local dev only.
- Device id persists in `localStorage`; revoked ids force re-login.


