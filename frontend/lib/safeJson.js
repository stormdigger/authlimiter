export async function parseJsonOrText(res) {
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return await res.json();
  const text = await res.text();
  try { return JSON.parse(text); } catch { return { message: text }; }
}
