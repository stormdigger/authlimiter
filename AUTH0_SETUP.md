Auth0 Setup

Create Application (Regular Web App)
- Type: Regular Web Application
- Token Signing Algorithm: RS256

Allowed URLs (development)
- Allowed Callback URLs: http://localhost:3000/api/auth/callback
- Allowed Logout URLs: http://localhost:3000
- Allowed Web Origins: http://localhost:3000

Create API (for backend JWT validation)
- Create an API in Auth0
- Identifier: choose a URI-like string (example: https://myauthapp.local/api)
- Signing Algorithm: RS256

Environment variables mapping
- Frontend `.env.local` (from `frontend/env.example`):
  - AUTH0_SECRET: any long random string (e.g., `openssl rand -base64 32`)
  - AUTH0_BASE_URL: http://localhost:3000
  - AUTH0_ISSUER_BASE_URL: https://YOUR_TENANT_REGION.auth0.com (must include https://)
  - AUTH0_CLIENT_ID: Applications → Your App → Client ID
  - AUTH0_CLIENT_SECRET: Applications → Your App → Client Secret
  - AUTH0_AUDIENCE: APIs → Your API → Identifier
  - NEXT_PUBLIC_BACKEND_URL: http://localhost:8000

- Backend `.env` (from `backend/env.example`):
  - AUTH0_DOMAIN: YOUR_TENANT_REGION.auth0.com (no protocol)
  - AUTH0_AUDIENCE: APIs → Your API → Identifier
  - SESSION_MAX_CONCURRENT: e.g., 3
  - DATABASE_URL: sqlite:///./app.db (default)

Notes
- AUTH0_ISSUER_BASE_URL must include `https://` and exactly match your tenant domain.
- The backend uses AUTH0_DOMAIN to derive the issuer and JWKS; don’t include protocol here.
- Ensure the Application and API are both RS256.


