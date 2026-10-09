import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormAlert } from "@/components/auth/FormControls";
import { getSessionUser } from "@/lib/auth/session";
import { ResetForm } from "./ResetForm";

export const metadata: Metadata = { title: "Choose a new password · MAKVO", robots: { index: false } };

/** Reached from the recovery email: the callback has already exchanged the link for a short-lived session. */
export default async function ResetPasswordPage() {
  const user = await getSessionUser();
  return (
    <AuthLayout back={{ href: "/login", label: "Back to sign in" }}>
      {user ? (
        <ResetForm email={user.email} />
      ) : (
        <div>
          <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em]">This link has expired.</h1>
          <p className="mt-3 text-body text-mute">Password reset links work once and expire after an hour. Request a new one and use it on this device.</p>
          <div className="mt-6"><FormAlert tone="info">For your security, we can&rsquo;t reset a password without a valid link.</FormAlert></div>
          <Link href="/forgot-password" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-btn px-6 text-body font-medium text-btn-fg transition hover:opacity-90">Request a new link</Link>
        </div>
      )}
    </AuthLayout>
  );
}
