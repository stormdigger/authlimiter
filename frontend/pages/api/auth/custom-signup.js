// Server-side wrapper to register DB users with full name + phone
export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end('Method Not Allowed'); }
  try {
    const { email, password, fullName, phone } = req.body || {};
    if (!email || !password || !fullName || !phone) return res.status(400).json({ message: 'email, password, fullName, phone required' });

    const url = `https://${process.env.AUTH0_ISSUER_BASE_URL.replace(/^https?:\/\//, '')}/dbconnections/signup`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        email,
        password,
        connection: process.env.AUTH0_DB_CONNECTION, // set this in .env (e.g., "Username-Password-Authentication")
        name: fullName, // sets normalized name field
        user_metadata: { phone, fullName }, // keep phone + full name also in metadata
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status || 400).json(data);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: String(e) });
  }
}
