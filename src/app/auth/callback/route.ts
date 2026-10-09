import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LOGIN_PATH, safeNext } from "@/lib/auth/routes";
import { applyPendingAccountType } from "@/lib/auth/pending-type";

/**
 * PKCE code exchange for Google OAuth, email confirmation and password recovery links.
 * Supabase only redirects here for URLs on the project's Redirect URL allowlist.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const isRecovery = next.startsWith("/reset-password");
  const fail = (code: string) => {
    const url = new URL(isRecovery ? "/forgot-password" : LOGIN_PATH, request.url);
    url.searchParams.set("error", code);
    if (!isRecovery && next) url.searchParams.set("next", next);
    return NextResponse.redirect(url);
  };

  if (!isSupabaseConfigured()) return fail("not_configured");

  // Provider errors, e.g. the user pressed Cancel on Google's consent screen.
  const providerError = searchParams.get("error");
  if (providerError) return fail(providerError === "access_denied" ? "oauth_cancelled" : "oauth_failed");

  const code = searchParams.get("code");
  if (!code) return fail("link_invalid");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) return fail("link_expired");

  await applyPendingAccountType(supabase, data.user.id);
  return NextResponse.redirect(new URL(next, request.url));
}
