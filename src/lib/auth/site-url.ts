import "server-only";
import { headers } from "next/headers";

/**
 * Base URL used in email and OAuth redirect links. Prefer the configured site URL so links can't be pointed at
 * another host through request headers. Supabase also only accepts redirect URLs on its allowlist.
 */
export async function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
