import "server-only";
import { headers } from "next/headers";

/**
 * Base URL used in email and OAuth redirect links.
 * 1. NEXT_PUBLIC_SITE_URL when set (recommended).
 * 2. On Vercel production, the project's production domain (not the per-deployment URL, which Vercel protects).
 * 3. Otherwise the host the request came in on. Supabase only accepts redirect URLs on its allowlist, so a
 *    spoofed Host header can't send links elsewhere.
 */
export async function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
