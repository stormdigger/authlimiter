import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'device_id';

export function getOrCreateDeviceId() {
  if (typeof window === 'undefined') return null;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && typeof existing === 'string' && existing.length > 0) return existing;
    const id = uuidv4();
    window.localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return null;
  }
}

export function clearDeviceId() {
  if (typeof window === 'undefined') return;
  try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
}
