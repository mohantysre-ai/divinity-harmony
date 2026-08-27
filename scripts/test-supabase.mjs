/**
 * Live Supabase Auth smoke test via Auth REST (no local node_modules required).
 *
 * Usage:
 *   node --env-file=.env scripts/test-supabase.mjs
 * Or set VITE_SUPABASE_URL + VITE_SUPABASE_PUBLISHABLE_KEY in the environment.
 */
const url = (process.env.VITE_SUPABASE_URL || '').trim().replace(/\/$/, '');
const key = (
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  ''
).trim();

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

function pass(msg) {
  console.log(`PASS: ${msg}`);
}

async function auth(path, body, accessToken) {
  const headers = {
    apikey: key,
    'Content-Type': 'application/json',
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const res = await fetch(`${url}/auth/v1${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

if (!url || !key || /YOUR_PROJECT/i.test(url)) {
  fail(
    'Fill VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env (Dashboard → Project Settings → API).',
  );
}

const stamp = Date.now();
const email = `dh.smoke.${stamp}@mailinator.com`;
const password = `DhSmoke_${stamp}_Aa1!`;
const displayName = `Smoke ${stamp}`;

console.log(`\n=== Supabase auth test against ${url} ===`);
console.log(`Test user: ${email}`);

const health = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } }).catch((err) => ({
  ok: false,
  status: 0,
  statusText: err.message,
}));
if (!health.ok) fail(`Auth health unreachable (${health.status || health.statusText})`);
pass('Auth health reachable');

const signup = await auth('/signup', {
  email,
  password,
  data: { display_name: displayName },
});
if (!signup.ok) fail(`signUp HTTP ${signup.status}: ${signup.json.msg || signup.json.error_description || JSON.stringify(signup.json)}`);
pass(`signUp ok (user=${signup.json.user?.id || signup.json.id || 'created'})`);

let accessToken = signup.json.access_token;
if (!accessToken) {
  const login = await auth('/token?grant_type=password', { email, password });
  if (!login.ok) {
    const msg = login.json.msg || login.json.error_description || JSON.stringify(login.json);
    if (/confirm|verify|email/i.test(msg)) {
      pass(`signIn blocked until email confirmation (expected): ${msg}`);
      console.log('\nSUPABASE TEST PASSED (enable “Confirm email” off under Auth → Providers for instant login after signup)');
      process.exit(0);
    }
    fail(`signIn HTTP ${login.status}: ${msg}`);
  }
  accessToken = login.json.access_token;
  pass('signInWithPassword ok');
} else {
  pass('signUp returned session (email confirmation disabled)');
}

if (!accessToken) fail('No access token after signup/signin');

const userRes = await fetch(`${url}/auth/v1/user`, {
  headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
});
const user = await userRes.json();
if (!userRes.ok) fail(`get user: ${user.msg || JSON.stringify(user)}`);
if (user.user_metadata?.display_name !== displayName) {
  fail(`display_name mismatch (got ${user.user_metadata?.display_name})`);
}
pass('user_metadata.display_name preserved');

const update = await fetch(`${url}/auth/v1/user`, {
  method: 'PUT',
  headers: {
    apikey: key,
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ data: { gotra: 'smoke-test', language: 'english' } }),
});
const updated = await update.json();
if (!update.ok) fail(`updateUser: ${updated.msg || JSON.stringify(updated)}`);
pass('updateUser metadata ok');

const logout = await fetch(`${url}/auth/v1/logout`, {
  method: 'POST',
  headers: { apikey: key, Authorization: `Bearer ${accessToken}` },
});
if (!logout.ok && logout.status !== 204) fail(`signOut HTTP ${logout.status}`);
pass('signOut ok');

console.log('\nSUPABASE TEST PASSED');
