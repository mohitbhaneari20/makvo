/** Route rules shared by the middleware, server actions and the app shell. */

export const DEFAULT_APP_PATH = "/dashboard";
export const LOGIN_PATH = "/login";
export const ONBOARDING_PATH = "/onboarding";

/** Sign-in pages. Signed-in users are sent on to the app instead. */
export const GUEST_ONLY = ["/login", "/signup", "/forgot-password"];
/** Pages that never need a session (callbacks, legal). */
const ALWAYS_PUBLIC = ["/auth", "/terms", "/privacy"];
/** Pages that need a session but skip the onboarding check. */
const SESSION_ONLY = ["/reset-password"];

const startsWith = (path: string, base: string) => path === base || path.startsWith(base + "/");

/**
 * Public marketing pages and public portfolios: home, case studies, individual profiles and team pages, awards.
 * Directory pages (/people, /teams) and everything else in the app require an account.
 */
export function isPublicPath(path: string) {
  if (path === "/" || startsWith(path, "/awards") || startsWith(path, "/work")) return true;
  if (/^\/people\/[^/]+\/?$/.test(path) || /^\/teams\/[^/]+\/?$/.test(path)) return true;
  return ALWAYS_PUBLIC.some((p) => startsWith(path, p)) || GUEST_ONLY.some((p) => startsWith(path, p));
}

export const isGuestOnly = (path: string) => GUEST_ONLY.some((p) => startsWith(path, p));
export const isSessionOnly = (path: string) => SESSION_ONLY.some((p) => startsWith(path, p));
export const isOnboarding = (path: string) => startsWith(path, ONBOARDING_PATH);
/** Auth screens render without the app chrome. */
export const isAuthScreen = (path: string) => isGuestOnly(path) || isSessionOnly(path) || isOnboarding(path);

/**
 * Only allow same-site relative paths as post-login destinations, so `?next=` can't send people to another site
 * (no protocol-relative `//evil.com`, no backslash tricks, no auth screens that would loop).
 */
export function safeNext(next: unknown, fallback = DEFAULT_APP_PATH): string {
  if (typeof next !== "string") return fallback;
  const value = next.trim();
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || /[\u0000-\u001f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://makvo.local");
    if (url.origin !== "https://makvo.local") return fallback;
    if (isGuestOnly(url.pathname) || startsWith(url.pathname, "/auth")) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
