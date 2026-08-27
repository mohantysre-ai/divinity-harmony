# Supabase Auth URL setup (email confirmation → mantra.sigq.in)

Confirmation emails only redirect correctly when **both** the app and the
Supabase dashboard agree on the destination.

## 1. Dashboard (required)

Open [Auth → URL Configuration](https://supabase.com/dashboard/project/lurzhluscxlbromxhsqk/auth/url-configuration):

| Setting | Value |
|---|---|
| **Site URL** | `https://mantra.sigq.in` |
| **Redirect URLs** | `https://mantra.sigq.in/**` |
| | `http://localhost:7800/**` |

Save.

## 2. App (already coded)

Signup uses `emailRedirectTo: https://mantra.sigq.in/login` so the Gmail
“Confirm your email” link returns users to the live site after verification.

## 3. Optional email template

If the link still ignores `redirectTo`, edit **Auth → Email Templates → Confirm signup**
and ensure the CTA uses `{{ .ConfirmationURL }}` (default) or includes
`{{ .RedirectTo }}` as documented at
https://supabase.com/docs/guides/auth/auth-email-templates
