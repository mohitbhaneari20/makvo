import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { AccountType } from "./validation";

export interface SessionUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  accountType: AccountType | null;
  onboardingCompleted: boolean;
  headline: string | null;
  organization: string | null;
  memberSince: string | null;
}

/** The signed-in user and their profile, verified with Supabase Auth. Cached for the duration of one request. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, account_type, onboarding_completed, headline, organization, created_at")
    .eq("id", user.id)
    .maybeSingle();
  const meta = user.user_metadata ?? {};
  return {
    id: user.id,
    email: user.email ?? null, // email comes from Auth, not duplicated in profiles
    fullName: profile?.full_name ?? meta.full_name ?? meta.name ?? null,
    avatarUrl: profile?.avatar_url ?? meta.avatar_url ?? meta.picture ?? null,
    accountType: (profile?.account_type as AccountType) ?? null,
    onboardingCompleted: Boolean(profile?.onboarding_completed),
    headline: profile?.headline ?? null,
    organization: profile?.organization ?? null,
    memberSince: profile?.created_at ?? user.created_at ?? null,
  };
});
