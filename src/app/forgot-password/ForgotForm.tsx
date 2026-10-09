"use client";
import Link from "next/link";
import { useActionState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { requestPasswordReset, type FormState } from "@/lib/auth/actions";
import { LINK_ERRORS, validateEmail } from "@/lib/auth/validation";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/FormControls";

const initial: FormState = { status: "idle" };

export function ForgotForm({ error, configured }: { error?: string; configured: boolean }) {
  const [state, action] = useActionState(requestPasswordReset, initial);

  if (state.status === "success") {
    return (
      <div>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-spring text-midnight"><MailCheck className="h-5 w-5" aria-hidden="true" /></span>
        <h1 className="mt-6 text-[2.1rem] font-medium leading-none tracking-[-0.035em]">Check your email.</h1>
        <p className="mt-3 text-body text-mute" role="status">If there&rsquo;s a MAKVO account for <span className="font-medium text-ink">{state.email}</span>, we&rsquo;ve sent a link to reset the password. It expires in an hour.</p>
        <p className="mt-3 text-small text-mute">Nothing arrived? Check your spam folder, or try again in a minute.</p>
        <Link href="/login" className="mt-8 inline-flex items-center gap-1.5 text-small font-medium text-ink underline-link"><ArrowLeft className="h-3.5 w-3.5" />Back to sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em] sm:text-[2.4rem]">Forgot your password?</h1>
      <p className="mt-3 text-body text-mute">Enter the email you use for MAKVO and we&rsquo;ll send you a link to choose a new one.</p>
      <div className="mt-6 space-y-3" aria-live="polite">
        {!configured && <FormAlert tone="info" title="Password reset isn't set up yet">Accounts need a Supabase project. See <code className="font-mono text-[12px]">.env.example</code>.</FormAlert>}
        {configured && error && LINK_ERRORS[error] && <FormAlert tone="error">{LINK_ERRORS[error]}</FormAlert>}
        {state.message && <FormAlert tone="error">{state.message}</FormAlert>}
      </div>
      <form action={action} noValidate className="mt-6 space-y-5">
        <AuthField label="Email address" name="email" type="email" autoComplete="email" placeholder="name@studio.com" required autoFocus
          defaultValue={state.values?.email} error={state.fieldErrors?.email} validate={validateEmail} />
        <SubmitButton pendingLabel="Sending link…" disabled={!configured}>Send reset link</SubmitButton>
      </form>
      <p className="mt-7 text-center text-small text-mute">Remembered it? <Link href="/login" className="font-medium text-ink underline-link">Sign in</Link></p>
    </div>
  );
}
