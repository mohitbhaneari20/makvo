import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Reset your password · MAKVO", robots: { index: false } };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  return (
    <AuthLayout back={{ href: "/login", label: "Back to sign in" }}>
      <ForgotForm error={typeof sp.error === "string" ? sp.error : undefined} configured={isSupabaseConfigured()} />
    </AuthLayout>
  );
}
