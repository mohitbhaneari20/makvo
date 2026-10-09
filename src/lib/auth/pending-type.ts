import "server-only";
import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isAccountType } from "./validation";

export const SIGNUP_TYPE_COOKIE = "makvo_signup_type";

/** Applies the account type picked on the sign-up page before Google sign-up, only if the profile has none yet. */
export async function applyPendingAccountType(supabase: SupabaseClient, userId: string) {
  const jar = await cookies();
  const pending = jar.get(SIGNUP_TYPE_COOKIE)?.value;
  if (!pending) return;
  jar.delete(SIGNUP_TYPE_COOKIE);
  if (!isAccountType(pending)) return;
  await supabase.from("profiles").update({ account_type: pending }).eq("id", userId).is("account_type", null);
}
