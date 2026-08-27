/** Canonical public site used in auth emails (confirm / reset). */
export const PUBLIC_SITE_URL = (
  import.meta.env.VITE_SITE_URL?.trim() || 'https://mantra.sigq.in'
).replace(/\/$/, '');

/** Where Supabase should send users after they click the Gmail confirmation link. */
export function authEmailRedirectTo(path = '/login') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  // Localhost keeps local redirects for local email testing; production always uses the public site.
  if (typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname)) {
    return `${window.location.origin}${normalized}`;
  }
  return `${PUBLIC_SITE_URL}${normalized}`;
}
