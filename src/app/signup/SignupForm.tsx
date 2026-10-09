"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { MailCheck } from "lucide-react";
import { resendConfirmation, signUp, type FormState } from "@/lib/auth/actions";
import { passwordStrength, validateEmail, validateFullName, validatePassword } from "@/lib/auth/validation";
import { AuthField, Divider, FormAlert, PasswordField, SubmitButton } from "@/components/auth/FormControls";
import { AccountTypeCards } from "@/components/auth/AccountTypeCards";
import { GoogleButton } from "@/components/auth/GoogleButton";

const initial: FormState = { status: "idle" };

function CheckEmail({ email, onBack }: { email: string; onBack: () => void }) {
  const [resend, resendAction] = useActionState(resendConfirmation, initial);
  return (
    <div>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-spring text-midnight"><MailCheck className="h-5 w-5" aria-hidden="true" /></span>
      <h1 className="mt-6 text-[2.1rem] font-medium leading-none tracking-[-0.035em]">Check your inbox.</h1>
      <p className="mt-3 text-body text-mute">We sent a confirmation link to <span className="font-medium text-ink">{email}</span>. Open it on this device to finish setting up your account.</p>
      <div className="mt-6 space-y-3" aria-live="polite">
        {resend.message && <FormAlert tone={resend.status === "error" ? "error" : "success"}>{resend.message}</FormAlert>}
        <form action={resendAction}><input type="hidden" name="email" value={email} /><SubmitButton variant="ghost" pendingLabel="Sending…">Resend the email</SubmitButton></form>
      </div>
      <p className="mt-7 text-center text-small text-mute">Wrong address? <button type="button" onClick={onBack} className="font-medium text-ink underline-link">Use a different email</button></p>
    </div>
  );
}

export function SignupForm({ next, initialType, configured }: { next: string; initialType: string; configured: boolean }) {
  const [formKey, setFormKey] = useState(0);
  return <SignupInner key={formKey} next={next} initialType={initialType} configured={configured} onReset={() => setFormKey((k) => k + 1)} />;
}

function SignupInner({ next, initialType, configured, onReset }: { next: string; initialType: string; configured: boolean; onReset: () => void }) {
  const [state, action] = useActionState(signUp, initial);
  const [accountType, setAccountType] = useState(state.values?.accountType ?? initialType);

  if (state.status === "check-email" && state.email) return <CheckEmail email={state.email} onBack={onReset} />;

  return (
    <div>
      <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em] sm:text-[2.4rem]">Create your account.</h1>
      <p className="mt-3 text-body text-mute">Show your work, find people worth working with, and get hired.</p>

      <div className="mt-6 space-y-3" aria-live="polite">
        {!configured && <FormAlert tone="info" title="Sign-up isn't set up yet">Accounts need a Supabase project. See <code className="font-mono text-[12px]">.env.example</code>.</FormAlert>}
        {state.message && <FormAlert tone="error">{state.message} {state.fieldErrors?.email && <Link href="/login" className="font-medium underline-link">Sign in</Link>}</FormAlert>}
      </div>

      <form action={action} noValidate className="mt-6 space-y-5">
        <input type="hidden" name="next" value={next} />
        <AccountTypeCards value={accountType} onChange={setAccountType} error={state.fieldErrors?.accountType} />
        <AuthField label="Full name" name="fullName" autoComplete="name" placeholder="Ana Ruiz" required maxLength={80}
          defaultValue={state.values?.fullName} error={state.fieldErrors?.fullName} validate={validateFullName} />
        <AuthField label="Email address" name="email" type="email" autoComplete="email" placeholder="name@studio.com" required
          defaultValue={state.values?.email} error={state.fieldErrors?.email} validate={validateEmail} />
        <PasswordField autoComplete="new-password" error={state.fieldErrors?.password} validate={(v) => validatePassword(v, "new")}
          showStrength={passwordStrength} hint="At least 8 characters, with a letter and a number." />
        <p className="text-[12.5px] leading-relaxed text-mute">By creating an account you agree to MAKVO&rsquo;s <Link href="/terms" className="text-ink underline-link">Terms of Service</Link> and <Link href="/privacy" className="text-ink underline-link">Privacy Policy</Link>.</p>
        <SubmitButton pendingLabel="Creating your account…" disabled={!configured}>Create account</SubmitButton>
      </form>

      <div className="my-6"><Divider>or</Divider></div>
      <GoogleButton next={next} accountType={accountType} label="Sign up with Google" disabled={!configured} />

      <p className="mt-7 text-center text-small text-mute">Already have an account? <Link href={next !== "/dashboard" ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="font-medium text-ink underline-link">Sign in</Link></p>
    </div>
  );
}
