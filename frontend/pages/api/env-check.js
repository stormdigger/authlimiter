export default async function handler(req, res) {
  const required = [
    'AUTH0_SECRET',
    'AUTH0_BASE_URL',
    'AUTH0_ISSUER_BASE_URL',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_AUDIENCE',
    'NEXT_PUBLIC_BACKEND_URL',
  ];
  const missing = required.filter((k) => !process.env[k]);
  const result = { ok: missing.length === 0, missing };
  try {
    const issuer = process.env.AUTH0_ISSUER_BASE_URL;
    if (issuer) {
      const wellKnown = issuer.replace(/\/$/, '') + '/.well-known/openid-configuration';
      const r = await fetch(wellKnown, { method: 'GET' });
      result.issuerReachable = r.ok;
      result.issuerStatus = r.status;
    }
  } catch (e) {
    result.issuerReachable = false;
    result.issuerError = String(e);
  }
  res.status(result.ok ? 200 : 500).json(result);
}
