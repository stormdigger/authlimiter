import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import { parseJsonOrText } from '../../../lib/safeJson';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end('Method Not Allowed'); }
  try {
    const { accessToken } = await getAccessToken(req, res, { authorizationParams: { audience: process.env.AUTH0_AUDIENCE } });
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const r = await fetch(`${baseUrl}/sessions/revoke_all`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
    const data = await parseJsonOrText(r);
    return res.status(r.ok ? r.status : 500).json(data);
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
});
