"use client";
import { Briefcase, Check, Code2, PenTool, UsersRound } from "lucide-react";
import { ACCOUNT_TYPES, type AccountType } from "@/lib/auth/validation";
import { FieldError } from "./FormControls";

const ICONS: Record<AccountType, typeof Briefcase> = { client: Briefcase, designer: PenTool, developer: Code2, studio: UsersRound };

/** "What brings you to MAKVO?" as an accessible radio group styled as cards. */
export function AccountTypeCards({ value, onChange, error, compact }: { value: string; onChange: (v: AccountType) => void; error?: string; compact?: boolean }) {
  return (
    <fieldset className="space-y-2.5" aria-describedby={error ? "account-type-error" : undefined}>
      <legend className="mb-2.5 text-small font-medium text-ink">What brings you to MAKVO?</legend>
      <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
        {ACCOUNT_TYPES.map((t) => {
          const Icon = ICONS[t.id]; const on = value === t.id;
          return (
            <label key={t.id} className={`group relative flex cursor-pointer gap-3 rounded-sm border p-3.5 transition focus-within:ring-2 focus-within:ring-nuit focus-within:ring-offset-2 focus-within:ring-offset-paper ${on ? "border-ink bg-surface shadow-soft" : "border-line bg-surface/60 hover:border-ink/40"}`}>
              <input type="radio" name="accountType" value={t.id} checked={on} onChange={() => onChange(t.id)} className="sr-only" />
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${on ? "bg-btn text-btn-fg" : "bg-sunk text-ink"}`}><Icon className="h-4 w-4" aria-hidden="true" /></span>
              <span className="min-w-0 pr-5">
                <span className="block text-small font-medium text-ink">{t.title}</span>
                {!compact && <span className="mt-0.5 block text-[12.5px] leading-snug text-mute">{t.description}</span>}
              </span>
              <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border transition ${on ? "border-ink bg-ink text-paper" : "border-line"}`} aria-hidden="true">{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
            </label>
          );
        })}
      </div>
      {error && <FieldError id="account-type-error">{error}</FieldError>}
    </fieldset>
  );
}
