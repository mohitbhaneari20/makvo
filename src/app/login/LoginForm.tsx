"use client";
import Link from "next/link";
import { useActionState } from "react";
import { resendConfirmation, signInWithPassword, type FormState } from "@/lib/auth/actions";
import { LINK_ERRORS, validateEmail, validatePassword } from "@/lib/auth/validation";
import { AuthField, Divider, FormAlert, PasswordField, SubmitButton } from "@/components/auth/FormControls";
import { GoogleButton } from "@/components/auth/GoogleButton";

const initial: FormState = { status: "idle" };

export function LoginForm({ next, error, signedOut, configured, google }: { next: string; error?: string; signedOut?: boolean; configured: boolean; google: boolean }) {
  const [state, action] = useActionState(signInWithPassword, initial);
  const [resend, resendAction] = useActionState(resendConfirmation, initial);
  const linkError = error && LINK_ERRORS[error];

  return (
    <div>
      <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em] sm:text-[2.4rem]">Welcome back.</h1>
      <p className="mt-3 text-body text-mute">Sign in to continue to MAKVO.</p>

      <div className="mt-7 space-y-3" aria-live="polite">
        {!configured && <FormAlert tone="info" title="Sign-in isn't set up yet">Accounts need a Supabase project. Add the environment variables from <code className="font-mono text-[12px]">.env.example</code> and restart the app.</FormAlert>}
        {configured && linkError && error !== "not_configured" && <FormAlert tone="error">{linkError}</FormAlert>}
        {signedOut && !state.message && <FormAlert tone="success">You&rsquo;ve signed out.</FormAlert>}
        {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
        {state.email && (
          <form action={resendAction} className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-sunk px-3.5 py-2.5 text-small">
            <input type="hidden" name="email" value={state.email} />
            <span className="text-mute">{resend.message ?? "Didn't get the email?"}</span>
            <button type="submit" className="font-medium text-ink underline-link">Resend confirmation</button>
          </form>
        )}
      </div>

      {google ? (<>
        <div className="mt-6"><GoogleButton next={next} disabled={!configured} /></div>
        <div className="my-6"><Divider>or continue with email</Divider></div>
      </>) : <div className="mt-6" />}

      <form action={action} noValidate className="space-y-4">
        <input type="hidden" name="next" value={next} />
        <AuthField label="Email address" name="email" type="email" autoComplete="email" placeholder="name@studio.com" required
          defaultValue={state.values?.email} error={state.fieldErrors?.email} validate={validateEmail} />
        <PasswordField autoComplete="current-password" error={state.fieldErrors?.password} validate={(v) => validatePassword(v, "signin")}
          trailing={<Link href="/forgot-password" className="text-small text-mute underline-link hover:text-ink">Forgot password?</Link>} />
        <div className="pt-2"><SubmitButton pendingLabel="Signing in…" disabled={!configured}>Sign in</SubmitButton></div>
      </form>

      <p className="mt-7 text-center text-small text-mute">New to MAKVO? <Link href={next !== "/dashboard" ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="font-medium text-ink underline-link">Create an account</Link></p>
    </div>
  );
}
