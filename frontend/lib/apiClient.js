export async function apiFetch(path, { token, deviceId, method = 'GET', body } = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL not configured');
  }
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (deviceId) headers['X-Device-Id'] = deviceId;
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const err = typeof data === 'string' ? { message: data } : data;
    throw Object.assign(new Error(err?.message || 'Request failed'), { status: res.status, data });
  }
  return data;
}


