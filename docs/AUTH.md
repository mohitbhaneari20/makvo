# MAKVO authentication setup

MAKVO uses **Supabase Auth** with the official `@supabase/ssr` integration for Next.js (App Router).
Sessions live in cookies managed by `@supabase/ssr` and are verified with Supabase Auth on the server for every request.
These cookies are readable by the browser client by design (Supabase needs them client-side), so keep the app free of
XSS: never render untrusted HTML, and add a Content-Security-Policy before launch.

Until the steps below are done, the app runs in a safe "not configured" mode: public pages work, every
private page redirects to `/login`, and the login screen says that accounts aren't set up yet.

## 1. Create the Supabase project
1. Create a project at https://supabase.com/dashboard.
2. **Project Settings → API**: copy the **Project URL** and the **anon / publishable key**.
3. Create `.env.local` from `.env.example` and paste them in. Set `NEXT_PUBLIC_SITE_URL`
   (`http://localhost:3000` locally, your real domain in production).
4. Never use the **service_role** key in this app.

## 2. Run the database migration
Open **SQL Editor**, paste `supabase/migrations/20261009120000_auth_profiles.sql` and run it
(or, with the Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`).

It creates:
- `account_types`: client, designer, developer, studio (add rows to add types).
- `profiles`: one row per user, keyed by `auth.users.id`; email stays in `auth.users`.
- A trigger that creates the profile on sign-up and validates the account type.
- Row Level Security: users can read, create and update **only their own** profile; anonymous users can't read profiles.
  Column privileges stop users editing `id`, `created_at` or `updated_at`. No delete access.

## 3. Auth settings (Authentication → URL Configuration)
- **Site URL**: your production URL, e.g. `https://makvo.com`.
- **Redirect URLs**, add every origin you use:
  - `http://localhost:3000/**`
  - `https://makvo.com/**`
  - Vercel previews, e.g. `https://*-yourteam.vercel.app/**`

## 4. Email (Authentication → Providers → Email, and Emails)
- Keep **Confirm email** on.
- Keep **Secure password change** on. Minimum password length: 8 (the app enforces 8 + a letter and a number).
- Recommended: in **Emails → Templates**, point links at `/auth/confirm` so they work even if opened in another browser:
  - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding`
  - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery`
  The default templates also work (through `/auth/callback`) when the link is opened in the same browser.
- For production, set up **custom SMTP** (the built-in sender is rate limited and meant for testing).

## 5. Google sign-in
**Google Cloud Console** (https://console.cloud.google.com):
1. **APIs & Services → OAuth consent screen**: app name MAKVO, support email, your domain(s); scopes `email`, `profile`, `openid`.
2. **Credentials → Create credentials → OAuth client ID → Web application**.
   - Authorized JavaScript origins: `http://localhost:3000`, `https://makvo.com`
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and **Client secret**.

**Supabase → Authentication → Providers → Google**: enable it and paste the Client ID and secret.
The secret stays in Supabase; it is never in this codebase.

## 6. Abuse protection
- Supabase Auth applies rate limits to sign-up, sign-in, password reset and email sends
  (**Authentication → Rate Limits**). Review them before launch.
- Recommended for production: enable **CAPTCHA** (Cloudflare Turnstile or hCaptcha) in **Authentication → Attack Protection**
  and add the widget to the sign-up and sign-in forms.
- Enable **leaked password protection** if your plan includes it.

## 7. Deploy (Vercel)
Add the same three variables in **Vercel → Project → Settings → Environment Variables** (Production and Preview),
with `NEXT_PUBLIC_SITE_URL` set to the production domain, then redeploy.

## How it fits together
| Piece | File |
| --- | --- |
| Route protection, session refresh, onboarding gate | `src/middleware.ts`, `src/lib/supabase/middleware.ts` |
| Public vs private routes, safe redirects | `src/lib/auth/routes.ts` |
| Sign in / up / out, Google, reset, onboarding | `src/lib/auth/actions.ts` (Server Actions) |
| OAuth + email link handling | `src/app/auth/callback/route.ts`, `src/app/auth/confirm/route.ts` |
| Current user on the server | `src/lib/auth/session.ts` |
| Screens | `src/app/{login,signup,forgot-password,reset-password,onboarding}` |

**Public without an account:** `/`, `/work/*` (case studies), `/people/<name>` and `/teams/<name>` (portfolios), `/awards`,
`/terms`, `/privacy`, and the auth screens. **Everything else needs an account.**
