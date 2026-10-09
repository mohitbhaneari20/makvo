import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LOGIN_PATH, ONBOARDING_PATH, safeNext } from "@/lib/auth/routes";

const TYPES: EmailOtpType[] = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

/**
 * Token-hash verification for email links (recommended for server-side auth: works even when the link is opened
 * in a different browser). Used when the Supabase email templates point to /auth/confirm.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const isRecovery = type === "recovery";
  const fail = (code: string) => NextResponse.redirect(new URL(`${isRecovery ? "/forgot-password" : LOGIN_PATH}?error=${code}`, request.url));

  if (!isSupabaseConfigured()) return fail("not_configured");
  if (!tokenHash || !type || !TYPES.includes(type)) return fail("link_invalid");

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) return fail("link_expired");

  const dest = isRecovery ? "/reset-password" : safeNext(searchParams.get("next"), ONBOARDING_PATH);
  return NextResponse.redirect(new URL(dest, request.url));
}
