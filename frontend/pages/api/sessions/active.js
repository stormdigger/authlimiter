import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import { parseJsonOrText } from '../../../lib/safeJson';

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { accessToken } = await getAccessToken(req, res, { authorizationParams: { audience: process.env.AUTH0_AUDIENCE } });
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const r = await fetch(`${baseUrl}/sessions/active`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const data = await parseJsonOrText(r);
    return res.status(r.ok ? r.status : 500).json(data);
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
});
