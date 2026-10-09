import type { Metadata } from "next";
import { LegalPage } from "@/components/auth/LegalPage";

export const metadata: Metadata = { title: "Terms of Service · MAKVO" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" intro="The rules for using MAKVO to show your work, connect with people and hire or get hired."
      points={[
        { h: "Your account", p: "Keep your sign-in details secure and the information on your profile accurate. You're responsible for activity on your account." },
        { h: "Your work", p: "You keep ownership of everything you upload. You give MAKVO permission to display it on the platform so people can discover it." },
        { h: "Working together", p: "Agreements, payments and deliverables are between clients and the people they hire. Verified projects must reflect work that really happened." },
        { h: "Fair use", p: "No impersonation, spam, scraping, or attempts to access other people's accounts or data." },
      ]} />
  );
}
