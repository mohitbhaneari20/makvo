"use client";
import { useActionState, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { completeOnboarding, signOut, type FormState } from "@/lib/auth/actions";
import { isAccountType, validateFullName, type AccountType } from "@/lib/auth/validation";
import { AccountTypeCards } from "@/components/auth/AccountTypeCards";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/FormControls";

const initial: FormState = { status: "idle" };

const COPY: Record<AccountType, { title: string; lead: string; dest: string; org?: { label: string; placeholder: string }; headline: { label: string; placeholder: string }; firsts: string[] }> = {
  client: {
    title: "Let’s find the right people.", lead: "Tell us a little about what you’re hiring for. You can write a full brief later.", dest: "/talent",
    org: { label: "Company", placeholder: "Northwind Analytics" }, headline: { label: "What are you hiring for?", placeholder: "A SaaS website redesign" },
    firsts: ["Describe your project and get matched", "Browse finished work by craft", "Invite people to a video interview"],
  },
  designer: {
    title: "Let’s set up your profile.", lead: "Clients find you through your work. Start with the basics and add projects next.", dest: "/dashboard",
    headline: { label: "Your headline", placeholder: "Product designer for SaaS and fintech" },
    firsts: ["Add your first project", "List your services and starting prices", "Switch on Open to work"],
  },
  developer: {
    title: "Let’s set up your profile.", lead: "Show what you’ve built. Start with the basics and add projects next.", dest: "/dashboard",
    headline: { label: "Your headline", placeholder: "Full-stack developer, React and Node" },
    firsts: ["Add a project you’ve shipped", "Add your tech stack", "Browse briefs that match your skills"],
  },
  studio: {
    title: "Let’s set up your studio.", lead: "Present your team’s work and get hired as one. Details can come later.", dest: "/teams",
    org: { label: "Studio name", placeholder: "Studio North" }, headline: { label: "What your studio does", placeholder: "Design and development for product teams" },
    firsts: ["Invite your team members", "Showcase work you’ve shipped together", "Set your team rate"],
  },
};

export function OnboardingFlow({ initialType, fullName, email, next }: { initialType: string; fullName: string; email: string | null; next: string }) {
  const [state, action] = useActionState(completeOnboarding, initial);
  const [type, setType] = useState<string>(state.values?.accountType ?? initialType);
  const [step, setStep] = useState<"type" | "details">(isAccountType(initialType) ? "details" : "type");
  const [typeError, setTypeError] = useState<string>();
  const first = (state.values?.fullName ?? fullName).split(" ")[0];
  const copy = isAccountType(type) ? COPY[type] : null;
  const destination = next !== "/dashboard" ? next : copy?.dest ?? "/dashboard";

  return (
    <div>
      <ol className="mb-8 flex items-center gap-2" aria-label="Setup progress">
        {["What brings you here", "Your details"].map((label, i) => {
          const active = (i === 0 && step === "type") || (i === 1 && step === "details");
          const done = i === 0 && step === "details";
          return (
            <li key={label} className="flex flex-1 items-center gap-2" aria-current={active ? "step" : undefined}>
              <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${done ? "bg-forest text-praxeti" : active ? "bg-btn text-btn-fg" : "bg-sunk text-mute"}`}>{done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}</span>
              <span className={`truncate text-[12.5px] ${active ? "font-medium text-ink" : "text-mute"}`}>{label}</span>
              {i === 0 && <span className="h-px flex-1 bg-line" />}
            </li>
          );
        })}
      </ol>

      {step === "type" ? (
        <div>
          <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em]">{first ? `Welcome, ${first}.` : "Welcome to MAKVO."}</h1>
          <p className="mt-3 text-body text-mute">Pick the one that fits best. You can change it later.</p>
          <div className="mt-7"><AccountTypeCards value={type} onChange={(v) => { setType(v); setTypeError(undefined); }} error={typeError ?? state.fieldErrors?.accountType} /></div>
          <button type="button" onClick={() => (isAccountType(type) ? setStep("details") : setTypeError("Choose what brings you to MAKVO."))}
            className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-btn px-6 text-body font-medium text-btn-fg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuit focus-visible:ring-offset-2 focus-visible:ring-offset-paper">Continue</button>
        </div>
      ) : copy && (
        <form action={action} noValidate>
          <input type="hidden" name="accountType" value={type} />
          <input type="hidden" name="next" value={destination} />
          <button type="button" onClick={() => setStep("type")} className="mb-4 inline-flex items-center gap-1.5 text-small text-mute transition hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />{COPY[type as AccountType] && type[0].toUpperCase() + type.slice(1)} · Change</button>
          <h1 className="text-[2.1rem] font-medium leading-none tracking-[-0.035em]">{copy.title}</h1>
          <p className="mt-3 text-body text-mute">{copy.lead}</p>
          <div className="mt-6" aria-live="polite">{state.message && <FormAlert tone="error">{state.message}</FormAlert>}</div>
          <div className="mt-6 space-y-4">
            <AuthField label={type === "studio" ? "Your name" : "Full name"} name="fullName" autoComplete="name" required maxLength={80}
              defaultValue={state.values?.fullName ?? fullName} error={state.fieldErrors?.fullName} validate={validateFullName} />
            {copy.org && <AuthField label={copy.org.label} name="organization" autoComplete="organization" placeholder={copy.org.placeholder} maxLength={120}
              defaultValue={state.values?.organization} trailing={<span className="text-[12px] text-mute">Optional</span>} />}
            <AuthField label={copy.headline.label} name="headline" placeholder={copy.headline.placeholder} maxLength={140}
              defaultValue={state.values?.headline} trailing={<span className="text-[12px] text-mute">Optional</span>} />
          </div>
          <div className="mt-6 rounded-sm bg-sunk p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-mute">Next, you can</p>
            <ul className="mt-2.5 space-y-2">{copy.firsts.map((f) => <li key={f} className="flex items-start gap-2.5 text-small text-ink"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest dark:text-mantis" strokeWidth={3} aria-hidden="true" />{f}</li>)}</ul>
          </div>
          <div className="mt-6 space-y-2.5">
            <SubmitButton pendingLabel="Saving…">Finish setup</SubmitButton>
            <SubmitButton variant="ghost" name="skip" value="1" pendingLabel="Saving…">Skip for now</SubmitButton>
          </div>
        </form>
      )}

      <form action={signOut} className="mt-8 text-center text-[12.5px] text-mute">
        {email && <span>Signed in as {email} · </span>}
        <button type="submit" className="underline-link hover:text-ink">Sign out</button>
      </form>
    </div>
  );
}
