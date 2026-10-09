import type { Metadata } from "next";
import { LegalPage } from "@/components/auth/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy · MAKVO" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" intro="What MAKVO collects when you create an account, and how it's used."
      points={[
        { h: "What we collect", p: "Your name, email address, account type and the profile details you choose to add. If you sign in with Google, we receive your name, email and profile picture from Google." },
        { h: "Passwords", p: "Passwords are handled by our authentication provider and stored only as secure hashes. We never see or store them in plain text." },
        { h: "How it's used", p: "To run your account, show your public profile and work, and match you with people and projects. We don't sell your personal data." },
        { h: "Your choices", p: "You can update your profile at any time and ask us to delete your account and the data linked to it." },
      ]} />
  );
}
