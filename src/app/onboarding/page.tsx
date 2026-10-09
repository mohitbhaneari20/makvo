import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { getSessionUser } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/routes";
import { OnboardingFlow } from "./OnboardingFlow";

export const metadata: Metadata = { title: "Welcome to MAKVO", robots: { index: false } };

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : undefined);
  // The middleware already requires a session here; this is a second check on the server.
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/onboarding")}`);
  return (
    <AuthLayout back={{ href: "/", label: "Back to MAKVO" }}>
      <OnboardingFlow initialType={user.accountType ?? ""} fullName={user.fullName ?? ""} email={user.email} next={next} />
    </AuthLayout>
  );
}
