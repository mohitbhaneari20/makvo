/** Form validation shared by the client (inline feedback) and the server (authoritative). */

export const ACCOUNT_TYPES = [
  { id: "client", title: "Client", description: "Hire designers, developers and studios for your projects." },
  { id: "designer", title: "Designer", description: "Showcase your design work and find clients." },
  { id: "developer", title: "Developer", description: "Show what you've built and find your next project." },
  { id: "studio", title: "Studio", description: "Present your team's work and win new clients." },
] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number]["id"];
export const isAccountType = (v: unknown): v is AccountType => ACCOUNT_TYPES.some((t) => t.id === v);

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72; // bcrypt limit used by Supabase Auth

export function validateEmail(email: string): string | null {
  const v = email.trim();
  if (!v) return "Enter your email address.";
  if (v.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address, like name@studio.com.";
  return null;
}

export function validatePassword(password: string, mode: "signin" | "new" = "new"): string | null {
  if (!password) return "Enter your password.";
  if (mode === "signin") return password.length > PASSWORD_MAX ? "That password is too long." : null;
  if (password.length < PASSWORD_MIN) return `Use at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return `Use ${PASSWORD_MAX} characters or fewer.`;
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Include at least one letter and one number.";
  return null;
}

export function validateFullName(name: string): string | null {
  const v = name.trim();
  if (!v) return "Enter your full name.";
  if (v.length < 2) return "Enter your full name.";
  if (v.length > 80) return "Use 80 characters or fewer.";
  return null;
}

export function passwordStrength(password: string): 0 | 1 | 2 | 3 {
  let s = 0;
  if (password.length >= PASSWORD_MIN) s++;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) s++;
  if (password.length >= 12 && /[^A-Za-z0-9]/.test(password)) s++;
  return s as 0 | 1 | 2 | 3;
}

/** Turn Supabase Auth errors into messages people can act on. Never echoes tokens or internal details. */
export function authErrorMessage(err: { code?: string; status?: number; message?: string } | null | undefined): string {
  switch (err?.code) {
    case "invalid_credentials": return "That email and password don't match. Check them and try again.";
    case "email_not_confirmed": return "Confirm your email first. We sent you a link when you signed up.";
    case "user_already_exists":
    case "email_exists": return "An account with this email already exists. Sign in instead.";
    case "weak_password": return "Choose a stronger password with at least 8 characters, a letter and a number.";
    case "same_password": return "Choose a password you haven't used for this account before.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit": return "Too many attempts. Wait a minute, then try again.";
    case "signup_disabled": return "New sign-ups are paused right now.";
    case "email_address_invalid": return "That email address can't be used. Try another one.";
    case "otp_expired":
    case "flow_state_expired":
    case "flow_state_not_found":
    case "bad_code_verifier": return "This link has expired or was already used. Request a new one.";
    case "session_not_found":
    case "refresh_token_not_found": return "Your session has ended. Sign in again.";
  }
  if (err?.status === 429) return "Too many attempts. Wait a minute, then try again.";
  return "Something went wrong on our side. Please try again.";
}

/** Messages for `?error=` codes set by the auth callback routes. */
export const LINK_ERRORS: Record<string, string> = {
  oauth_cancelled: "Google sign-in was cancelled. You can try again or use your email.",
  oauth_failed: "We couldn't sign you in with Google. Please try again.",
  link_expired: "That link has expired or was already used. Please request a new one.",
  link_invalid: "That sign-in link isn't valid. Please try again.",
  not_configured: "Sign-in isn't set up yet for this environment.",
  session_expired: "Your session has ended. Sign in again to continue.",
};
