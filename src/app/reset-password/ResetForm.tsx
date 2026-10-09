"use client";
import { useActionState, useState } from "react";
import { updatePassword, type FormState } from "@/lib/auth/actions";
import { passwordStrength, validatePassword } from "@/lib/auth/validation";
import { FormAlert, PasswordField, SubmitButton } from "@/components/auth/FormControls";

const initial: FormState = { status: "idle" };

export function ResetForm({ email }: { email: string | null }) {
  const [state, action] = useActionState(updatePassword, initial);
  const [pw, setPw] = useState("");
  return (
    <div>
      <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em] sm:text-[2.4rem]">Choose a new password.</h1>
      <p className="mt-3 text-body text-mute">{email ? <>For <span className="font-medium text-ink">{email}</span>. </> : null}You&rsquo;ll stay signed in on this device.</p>
      <div className="mt-6" aria-live="polite">{state.message && <FormAlert tone="error">{state.message}</FormAlert>}</div>
      <form action={action} noValidate className="mt-6 space-y-5">
        {email && <input type="text" name="username" autoComplete="username" defaultValue={email} hidden readOnly />}
        <PasswordField label="New password" autoComplete="new-password" error={state.fieldErrors?.password} validate={(v) => validatePassword(v, "new")}
          showStrength={passwordStrength} onValue={setPw} hint="At least 8 characters, with a letter and a number." autoFocus />
        <PasswordField label="Confirm new password" name="confirm" autoComplete="new-password" error={state.fieldErrors?.confirm}
          validate={(v) => (v && v !== pw ? "The passwords don't match." : !v ? "Confirm your new password." : null)} />
        <SubmitButton pendingLabel="Saving…">Update password</SubmitButton>
      </form>
    </div>
  );
}
