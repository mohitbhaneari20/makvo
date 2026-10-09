"use client";
import { useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Info, Loader2 } from "lucide-react";

/* ---------- Text field with label, hint and inline error ---------- */
export function AuthField({ label, name, type = "text", error, hint, validate, defaultValue, autoComplete, placeholder, required, autoFocus, maxLength, trailing }: {
  label: string; name: string; type?: string; error?: string; hint?: React.ReactNode; validate?: (v: string) => string | null;
  defaultValue?: string; autoComplete?: string; placeholder?: string; required?: boolean; autoFocus?: boolean; maxLength?: number; trailing?: React.ReactNode;
}) {
  const id = useId();
  const [local, setLocal] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const shown = (touched ? local : null) ?? error;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-small font-medium text-ink">{label}</label>
        {trailing}
      </div>
      <input
        id={id} name={name} type={type} defaultValue={defaultValue} autoComplete={autoComplete} placeholder={placeholder} required={required}
        autoFocus={autoFocus} maxLength={maxLength} aria-invalid={shown ? true : undefined} aria-describedby={shown ? `${id}-err` : hint ? `${id}-hint` : undefined}
        onBlur={(e) => { if (!validate) return; setTouched(true); setLocal(validate(e.currentTarget.value)); }}
        onChange={(e) => { if (validate && touched) setLocal(validate(e.currentTarget.value)); }}
        className={`auth-input ${shown ? "border-[#C2410C] focus:border-[#C2410C] focus:ring-[#C2410C]/15" : ""}`}
      />
      {shown ? <FieldError id={`${id}-err`}>{shown}</FieldError> : hint ? <p id={`${id}-hint`} className="text-[12.5px] text-mute">{hint}</p> : null}
    </div>
  );
}

/* ---------- Password field with visibility toggle ---------- */
export function PasswordField({ label = "Password", name = "password", error, validate, autoComplete, trailing, showStrength, onValue, autoFocus, hint }: {
  label?: string; name?: string; error?: string; validate?: (v: string) => string | null; autoComplete: string; trailing?: React.ReactNode;
  showStrength?: (v: string) => 0 | 1 | 2 | 3; onValue?: (v: string) => void; autoFocus?: boolean; hint?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const [local, setLocal] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const shown = (touched ? local : null) ?? error;
  const strength = showStrength && value ? showStrength(value) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-small font-medium text-ink">{label}</label>
        {trailing}
      </div>
      <div className="relative">
        <input
          id={id} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} required autoFocus={autoFocus} maxLength={128}
          aria-invalid={shown ? true : undefined} aria-describedby={shown ? `${id}-err` : hint ? `${id}-hint` : undefined}
          onChange={(e) => { setValue(e.currentTarget.value); onValue?.(e.currentTarget.value); if (validate && touched) setLocal(validate(e.currentTarget.value)); }}
          onBlur={(e) => { if (!validate) return; setTouched(true); setLocal(validate(e.currentTarget.value)); }}
          className={`auth-input pr-12 ${shown ? "border-[#C2410C] focus:border-[#C2410C] focus:ring-[#C2410C]/15" : ""}`}
        />
        <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible} aria-controls={id}
          className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-mute transition hover:bg-sunk hover:text-ink">
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
      {showStrength && value && !shown && (
        <div className="flex items-center gap-2" aria-live="polite">
          <div className="flex flex-1 gap-1">{[1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? (strength === 1 ? "bg-[#C2410C]" : strength === 2 ? "bg-mantis" : "bg-forest") : "bg-line"}`} />)}</div>
          <span className="text-[12px] text-mute">{["Too short", "Weak", "Good", "Strong"][strength]}</span>
        </div>
      )}
      {shown ? <FieldError id={`${id}-err`}>{shown}</FieldError> : hint && !value ? <p id={`${id}-hint`} className="text-[12.5px] text-mute">{hint}</p> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return <p id={id} className="flex items-start gap-1.5 text-[13px] text-[#C2410C] dark:text-[#FDBA74]" role="alert"><AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />{children}</p>;
}

/* ---------- Submit button with pending state (prevents double submits) ---------- */
export function SubmitButton({ children, pendingLabel, disabled, variant = "primary", name, value }: { children: React.ReactNode; pendingLabel?: string; disabled?: boolean; variant?: "primary" | "ghost"; name?: string; value?: string }) {
  const { pending } = useFormStatus();
  const cls = variant === "primary"
    ? "bg-btn text-btn-fg hover:opacity-90"
    : "border border-ink/20 text-ink hover:border-ink";
  return (
    <button type="submit" name={name} value={value} disabled={pending || disabled} aria-disabled={pending || disabled}
      className={`relative inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-body font-medium transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuit focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${cls}`}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}

/* ---------- Alerts ---------- */
export function FormAlert({ tone = "error", children, title }: { tone?: "error" | "success" | "info"; children: React.ReactNode; title?: string }) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  const cls = { error: "border-[#C2410C]/30 bg-[#C2410C]/[0.06]", success: "border-forest/30 bg-forest/[0.07]", info: "border-nuit/25 bg-nuit/[0.06]" }[tone];
  const ic = { error: "text-[#C2410C] dark:text-[#FDBA74]", success: "text-forest dark:text-mantis", info: "text-nuit dark:text-[#9DB7E8]" }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 rounded-sm border p-3.5 text-small ${cls}`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${ic}`} aria-hidden="true" />
      <div className="min-w-0 text-ink">{title && <p className="font-medium">{title}</p>}<div className={title ? "mt-0.5 text-mute" : ""}>{children}</div></div>
    </div>
  );
}

export function Divider({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-3 text-[12px] text-mute" role="separator"><span className="h-px flex-1 bg-line" />{children}<span className="h-px flex-1 bg-line" /></div>;
}
