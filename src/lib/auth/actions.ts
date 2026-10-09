"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DEFAULT_APP_PATH, LOGIN_PATH, ONBOARDING_PATH, safeNext } from "./routes";
import { getSiteUrl } from "./site-url";
import { authErrorMessage, isAccountType, validateEmail, validateFullName, validatePassword } from "./validation";

export type FieldErrors = Partial<Record<"email" | "password" | "confirm" | "fullName" | "accountType", string>>;
export interface FormState {
  status: "idle" | "error" | "success" | "check-email";
  message?: string;
  fieldErrors?: FieldErrors;
  email?: string;
  /** Echo back non-secret values so the form keeps what the user typed. Never echo passwords. */
  values?: Record<string, string>;
}

const str = (fd: FormData, key: string) => (typeof fd.get(key) === "string" ? (fd.get(key) as string) : "");
const notConfigured: FormState = { status: "error", message: "Sign-in isn't set up yet. Add the Supabase environment variables to enable accounts." };
import { SIGNUP_TYPE_COOKIE } from "./pending-type";

/* ---------------- Sign in ---------------- */
export async function signInWithPassword(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").trim().toLowerCase();
  const password = str(fd, "password");
  const next = safeNext(str(fd, "next"));
  const fieldErrors: FieldErrors = {};
  const e = validateEmail(email); if (e) fieldErrors.email = e;
  const p = validatePassword(password, "signin"); if (p) fieldErrors.password = p;
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values: { email } };
  if (!isSupabaseConfigured()) return { ...notConfigured, values: { email } };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { status: "error", message: authErrorMessage(error), values: { email }, email: error.code === "email_not_confirmed" ? email : undefined };
  }
  revalidatePath("/", "layout");
  redirect(next);
}

/* ---------------- Sign up ---------------- */
export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  const fullName = str(fd, "fullName").trim().replace(/\s+/g, " ");
  const email = str(fd, "email").trim().toLowerCase();
  const password = str(fd, "password");
  const accountType = str(fd, "accountType");
  const values = { fullName, email, accountType };
  const fieldErrors: FieldErrors = {};
  const n = validateFullName(fullName); if (n) fieldErrors.fullName = n;
  const e = validateEmail(email); if (e) fieldErrors.email = e;
  const p = validatePassword(password, "new"); if (p) fieldErrors.password = p;
  if (!isAccountType(accountType)) fieldErrors.accountType = "Choose what brings you to MAKVO.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values };
  if (!isSupabaseConfigured()) return { ...notConfigured, values };

  const supabase = await createClient();
  const site = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Stored in user metadata; the database trigger validates account_type against the account_types table.
    options: { emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(ONBOARDING_PATH)}`, data: { full_name: fullName, account_type: accountType } },
  });
  if (error) return { status: "error", message: authErrorMessage(error), values, fieldErrors: error.code === "weak_password" ? { password: authErrorMessage(error) } : undefined };
  // With email confirmation on, Supabase hides whether the address exists by returning a user with no identities.
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    return { status: "error", message: "An account with this email already exists. Sign in instead, or reset your password.", values, fieldErrors: { email: "This email is already registered." } };
  }
  if (data.session) {
    revalidatePath("/", "layout");
    redirect(ONBOARDING_PATH);
  }
  return { status: "check-email", email, values };
}

/* ---------------- Resend confirmation ---------------- */
export async function resendConfirmation(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").trim().toLowerCase();
  if (validateEmail(email)) return { status: "error", message: "Enter a valid email address." };
  if (!isSupabaseConfigured()) return notConfigured;
  const supabase = await createClient();
  const site = await getSiteUrl();
  const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${site}/auth/callback?next=${encodeURIComponent(ONBOARDING_PATH)}` } });
  if (error && (error.status === 429 || error.code?.startsWith("over_"))) return { status: "error", message: authErrorMessage(error), email };
  // Same message whether or not the account exists.
  return { status: "success", message: `If ${email} is waiting for confirmation, a new link is on its way.`, email };
}

/* ---------------- Google OAuth ---------------- */
export async function signInWithGoogle(fd: FormData) {
  const next = safeNext(str(fd, "next"));
  if (!isSupabaseConfigured()) redirect(`${LOGIN_PATH}?error=not_configured`);
  const accountType = str(fd, "accountType");
  if (isAccountType(accountType)) {
    // Remember the choice from the sign-up page; the callback applies it only if the profile has no type yet.
    (await cookies()).set(SIGNUP_TYPE_COOKIE, accountType, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 600, path: "/" });
  }
  const supabase = await createClient();
  const site = await getSiteUrl();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${site}/auth/callback?next=${encodeURIComponent(next)}`, queryParams: { prompt: "select_account" } },
  });
  if (error || !data.url) redirect(`${LOGIN_PATH}?error=oauth_failed`);
  redirect(data.url);
}

/* ---------------- Forgot / reset password ---------------- */
export async function requestPasswordReset(_: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, "email").trim().toLowerCase();
  const e = validateEmail(email);
  if (e) return { status: "error", fieldErrors: { email: e }, values: { email } };
  if (!isSupabaseConfigured()) return { ...notConfigured, values: { email } };
  const supabase = await createClient();
  const site = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${site}/auth/callback?next=/reset-password` });
  if (error && (error.status === 429 || error.code?.startsWith("over_"))) return { status: "error", message: authErrorMessage(error), values: { email } };
  // Never reveal whether an account exists for this address.
  return { status: "success", email };
}

export async function updatePassword(_: FormState, fd: FormData): Promise<FormState> {
  const password = str(fd, "password");
  const confirm = str(fd, "confirm");
  const fieldErrors: FieldErrors = {};
  const p = validatePassword(password, "new"); if (p) fieldErrors.password = p;
  if (!fieldErrors.password && password !== confirm) fieldErrors.confirm = "The passwords don't match.";
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors };
  if (!isSupabaseConfigured()) return notConfigured;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: "error", message: "Your reset link has expired. Request a new one to continue." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: authErrorMessage(error), fieldErrors: error.code === "weak_password" || error.code === "same_password" ? { password: authErrorMessage(error) } : undefined };
  revalidatePath("/", "layout");
  redirect(`${DEFAULT_APP_PATH}?password=updated`);
}

/* ---------------- Sign out ---------------- */
export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  }
  revalidatePath("/", "layout");
  redirect(`${LOGIN_PATH}?signedout=1`);
}

/* ---------------- Onboarding ---------------- */
export async function completeOnboarding(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured()) return notConfigured;
  const accountType = str(fd, "accountType");
  const fullName = str(fd, "fullName").trim().replace(/\s+/g, " ");
  const headline = str(fd, "headline").trim().slice(0, 140) || null;
  const organization = str(fd, "organization").trim().slice(0, 120) || null;
  const skip = str(fd, "skip") === "1";
  const fieldErrors: FieldErrors = {};
  if (!isAccountType(accountType)) fieldErrors.accountType = "Choose what brings you to MAKVO.";
  if (!skip) { const n = validateFullName(fullName); if (n) fieldErrors.fullName = n; }
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values: { fullName, headline: headline ?? "", organization: organization ?? "", accountType } };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`${LOGIN_PATH}?error=session_expired&next=${ONBOARDING_PATH}`);

  // Update the user's own row (RLS enforces this). If it's missing, for example because the sign-up trigger
  // failed, create it. No upsert: users are deliberately not allowed to update the id column.
  const changes: Record<string, unknown> = { account_type: accountType, onboarding_completed: true };
  if (!skip) Object.assign(changes, { full_name: fullName, headline, organization });
  let { data: updated, error } = await supabase.from("profiles").update(changes).eq("id", user.id).select("id");
  if (!error && (!updated || updated.length === 0)) {
    ({ error } = await supabase.from("profiles").insert({ id: user.id, ...changes }));
  }
  if (error) {
    console.error("[auth] onboarding save failed", error.code);
    return { status: "error", message: "We couldn't save your profile. Please try again." };
  }
  revalidatePath("/", "layout");
  redirect(safeNext(str(fd, "next"), DEFAULT_APP_PATH));
}
