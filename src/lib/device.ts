const KEY = 'divinity-device-id';

export function getDeviceId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID?.() || `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function deviceHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', 'X-Device-ID': getDeviceId() };
}
