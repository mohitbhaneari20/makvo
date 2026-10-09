/**
 * Supabase configuration. Only the project URL and the public (anon / publishable) key are used here.
 * Both are safe to expose to the browser; access to data is enforced by Row Level Security.
 * Never put the service-role key in a NEXT_PUBLIC_ variable or in this codebase.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

// https everywhere, plus plain http for a local Supabase stack (the CLI runs on http://127.0.0.1:54321).
export const isSupabaseConfigured = () =>
  (/^https:\/\/.+/.test(SUPABASE_URL) || /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(SUPABASE_URL)) && SUPABASE_ANON_KEY.length > 20;
