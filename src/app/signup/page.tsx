import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeNext } from "@/lib/auth/routes";
import { isAccountType } from "@/lib/auth/validation";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Create your account · MAKVO", robots: { index: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const type = typeof sp.type === "string" && isAccountType(sp.type) ? sp.type : "";
  return (
    <AuthLayout>
      <SignupForm next={safeNext(typeof sp.next === "string" ? sp.next : undefined)} initialType={type} configured={isSupabaseConfigured()} />
    </AuthLayout>
  );
}
