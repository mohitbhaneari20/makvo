import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";
import { DEFAULT_APP_PATH, LOGIN_PATH, ONBOARDING_PATH, isGuestOnly, isOnboarding, isPublicPath, isSessionOnly, safeNext } from "@/lib/auth/routes";

/**
 * Refreshes the Supabase session on every request and enforces route access on the server.
 * The user is verified with the Auth server (getUser), never trusted from the cookie alone.
 */
export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  const redirectTo = (pathname: string, params: Record<string, string> = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = NextResponse.redirect(url);
    // Keep any refreshed auth cookies on the redirect.
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    res.headers.set("Cache-Control", "private, no-store");
    return res;
  };
  const intended = () => path + request.nextUrl.search;

  if (!isSupabaseConfigured()) {
    // Without Supabase there is no way to have a session, so nothing private is reachable.
    if (!isPublicPath(path)) return redirectTo(LOGIN_PATH, { next: intended(), error: "not_configured" });
    return response;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Do not run code between createServerClient and getUser: it can cause hard-to-debug logouts.
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // /reset-password checks the session itself and explains expired links instead of bouncing to login.
    if (isPublicPath(path) || isSessionOnly(path)) return response;
    return redirectTo(LOGIN_PATH, { next: intended() });
  }

  // Signed in: skip the sign-in pages.
  if (isGuestOnly(path)) return redirectTo(safeNext(request.nextUrl.searchParams.get("next")));

  // Onboarding gate for the app (public pages and password reset are never gated).
  if (isSessionOnly(path) || (isPublicPath(path) && !isOnboarding(path))) return response;

  const { data: profile, error } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).maybeSingle();
  if (error) {
    // Onboarding is a convenience, not a security boundary: if the profile can't be read, let the user through.
    console.error("[auth] profile lookup failed", error.code);
    return response;
  }
  const needsOnboarding = !profile?.onboarding_completed;
  if (needsOnboarding && !isOnboarding(path)) return redirectTo(ONBOARDING_PATH, { next: intended() });
  if (!needsOnboarding && isOnboarding(path)) return redirectTo(safeNext(request.nextUrl.searchParams.get("next"), DEFAULT_APP_PATH));

  return response;
}
