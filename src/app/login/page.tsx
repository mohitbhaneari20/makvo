import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { safeNext } from "@/lib/auth/routes";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in · MAKVO", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  return (
    <AuthLayout>
      <LoginForm next={safeNext(one("next"))} error={one("error")} signedOut={one("signedout") === "1"} configured={isSupabaseConfigured()} />
    </AuthLayout>
  );
}
