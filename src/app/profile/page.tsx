import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileView } from "./ProfileView";

export const metadata: Metadata = { title: "Your profile · MAKVO", robots: { index: false } };
// Always rendered per request: the page shows the signed-in user's own data.
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // The middleware already requires a session here; this is a second check on the server.
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/profile")}`);
  return <ProfileView user={user} />;
}
