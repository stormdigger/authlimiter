import { withApiAuthRequired, getAccessToken } from '@auth0/nextjs-auth0';
import { parseJsonOrText } from '../../../lib/safeJson';

export default withApiAuthRequired(async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end('Method Not Allowed'); }
  try {
    const deviceId = req.body?.device_id || req.query?.device_id || req.headers['x-device-id'];
    if (!deviceId) return res.status(400).json({ message: 'device_id required' });
    const { accessToken } = await getAccessToken(req, res, { authorizationParams: { audience: process.env.AUTH0_AUDIENCE } });
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const r = await fetch(`${baseUrl}/sessions/evict?device_id=${encodeURIComponent(deviceId)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await parseJsonOrText(r);
    return res.status(r.ok ? r.status : 500).json(data);
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
});
