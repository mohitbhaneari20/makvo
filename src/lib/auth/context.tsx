"use client";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { SessionUser } from "./session";

interface AuthValue { user: SessionUser | null; configured: boolean }
const AuthContext = createContext<AuthValue>({ user: null, configured: false });
export const useAuth = () => useContext(AuthContext);

/**
 * Provides the server-verified user to client components. This is for display only:
 * access is enforced by the middleware and by Row Level Security, never by this context.
 */
export function AuthProvider({ user, configured, children }: AuthValue & { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!configured) return;
    // Re-render server components when the session changes in another tab (sign-in, sign-out, expiry).
    const { data } = createClient().auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      const changed = (event === "SIGNED_OUT" && user) || (event === "SIGNED_IN" && session?.user.id !== user?.id);
      if (changed) router.refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [configured, user, router]);
  return <AuthContext.Provider value={{ user, configured }}>{children}</AuthContext.Provider>;
}
