"use client";
import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Supabase client for Client Components. Uses the same cookie-based session as the server. */
export function createClient() {
  browserClient ??= createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return browserClient;
}
