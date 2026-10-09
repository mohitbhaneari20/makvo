import "server-only";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabase/env";

/** Which sign-in providers are switched on in the Supabase project. Public data, cached for 5 minutes. */
export async function getAuthProviders(): Promise<{ google: boolean; email: boolean }> {
  if (!isSupabaseConfigured()) return { google: false, email: false };
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/settings`, { headers: { apikey: SUPABASE_ANON_KEY }, next: { revalidate: 300 } });
    if (!res.ok) return { google: false, email: true };
    const s = await res.json();
    return { google: Boolean(s?.external?.google), email: s?.external?.email !== false };
  } catch {
    return { google: false, email: true };
  }
}
