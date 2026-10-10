"use client";
import { useActionState, useEffect, useState } from "react";
import { Briefcase, Building2, CalendarDays, Check, Code2, FolderPlus, Mail, Pencil, PenTool, UsersRound, X } from "lucide-react";
import { updateProfile, type FormState } from "@/lib/auth/actions";
import { ACCOUNT_TYPES, validateFullName, type AccountType } from "@/lib/auth/validation";
import type { SessionUser } from "@/lib/auth/session";
import { AccountTypeCards } from "@/components/auth/AccountTypeCards";
import { AuthField, FormAlert, SubmitButton } from "@/components/auth/FormControls";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, Spark } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";
import { ProfileImages } from "./ProfileImages";

const initial: FormState = { status: "idle" };
const ICONS: Record<AccountType, typeof Briefcase> = { client: Briefcase, designer: PenTool, developer: Code2, studio: UsersRound };
const ORG_LABEL: Partial<Record<AccountType, string>> = { client: "Company", studio: "Studio name" };

function memberSince(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function ProfileView({ user }: { user: SessionUser }) {
  const { toast } = useApp();
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState(updateProfile, initial);
  const [type, setType] = useState<string>(user.accountType ?? "");

  // Close the editor once the server confirms the save; the page re-renders with the new values.
  useEffect(() => {
    if (state.status === "success") { setEditing(false); toast("Profile saved", "ok"); }
  }, [state, toast]);

  const name = user.fullName || user.email || "Your profile";
  const typeInfo = ACCOUNT_TYPES.find((t) => t.id === user.accountType);
  const TypeIcon = user.accountType ? ICONS[user.accountType] : Briefcase;
  const since = memberSince(user.memberSince);
  const isClient = user.accountType === "client";
  const steps = [
    { label: "Add your name", done: Boolean(user.fullName) },
    { label: "Choose what brings you to MAKVO", done: Boolean(user.accountType) },
    { label: isClient ? "Say what you’re hiring for" : "Write a headline", done: Boolean(user.headline) },
    ...(ORG_LABEL[user.accountType as AccountType] ? [{ label: `Add your ${ORG_LABEL[user.accountType as AccountType]!.toLowerCase()}`, done: Boolean(user.organization) }] : []),
    { label: isClient ? "Post your first brief" : "Publish your first project", done: false },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className="container-x pb-24 pt-6 md:pt-8">
      <section>
        <div className="relative h-36 overflow-hidden rounded-lg bg-midnight md:h-52">
          {user.coverUrl
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={user.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            : <><div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-nuit/60 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-forest/50 blur-3xl" aria-hidden="true" /></>}
          <div className="absolute inset-x-0 bottom-0 h-1.5 grad-spring" />
          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-1.5 text-[12px] text-praxeti backdrop-blur"><Spark className="h-3 w-3" color="#DBE64C" />Only you can see this page</div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <div className="-mt-12 flex md:-mt-14"><span className="flex rounded-full ring-[5px] ring-paper"><Avatar name={name} src={user.avatarUrl} size={112} /></span></div>
            <h1 className="t-display mt-6 break-words !text-[clamp(2.4rem,6vw,4.75rem)]">{name}</h1>
            {user.headline ? <p className="mt-4 max-w-2xl text-[1.2rem] leading-relaxed">{user.headline}</p>
              : <button type="button" onClick={() => setEditing(true)} className="mt-4 text-body text-mute underline-link hover:text-ink">{isClient ? "Add what you’re hiring for" : "Add a headline so people know what you do"}</button>}
            <div className="mt-6 flex flex-wrap gap-2">
              {typeInfo && <Badge tone="outline"><span className="inline-flex items-center gap-1.5"><TypeIcon className="h-3.5 w-3.5" />{typeInfo.title}</span></Badge>}
              {user.organization && <Badge tone="outline"><span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{user.organization}</span></Badge>}
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-md border border-line bg-surface p-5 lg:mt-6">
              <div className="flex items-center justify-between gap-3"><div className="t-caption">Account</div>
                {!editing && <Button size="sm" variant="outline" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditing(true)}>Edit profile</Button>}</div>
              <dl className="mt-4 space-y-3 text-small">
                <div className="flex items-start gap-3"><dt className="sr-only">Email</dt><Mail className="mt-0.5 h-4 w-4 shrink-0 text-mute" aria-hidden="true" /><dd className="min-w-0 break-all">{user.email}<span className="block text-[12px] text-mute">Private, never shown to others</span></dd></div>
                {since && <div className="flex items-start gap-3"><dt className="sr-only">Member since</dt><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-mute" aria-hidden="true" /><dd>Member since {since}</dd></div>}
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {editing && (
        <section className="mt-12 rounded-md border border-line bg-surface p-5 md:p-8" aria-labelledby="edit-heading">
          <div className="mb-6 flex items-center justify-between gap-4"><h2 id="edit-heading" className="t-h2">Edit profile</h2>
            <button type="button" onClick={() => setEditing(false)} aria-label="Close editor" className="rounded-full p-2 text-mute transition hover:bg-sunk hover:text-ink"><X className="h-4 w-4" /></button></div>
          <div className="mb-8 border-b border-line pb-8"><ProfileImages userId={user.id} name={name} avatarUrl={user.avatarUrl} coverUrl={user.coverUrl} /></div>
          <form action={action} noValidate className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {state.status === "error" && state.message && <FormAlert tone="error">{state.message}</FormAlert>}
              <AuthField label="Full name" name="fullName" autoComplete="name" required maxLength={80} defaultValue={state.values?.fullName ?? user.fullName ?? ""} error={state.fieldErrors?.fullName} validate={validateFullName} />
              <AuthField label={isClient ? "What are you hiring for?" : "Headline"} name="headline" maxLength={140} placeholder={isClient ? "A SaaS website redesign" : "Product designer for SaaS and fintech"}
                defaultValue={state.values?.headline ?? user.headline ?? ""} trailing={<span className="text-[12px] text-mute">Optional</span>} />
              <AuthField label={ORG_LABEL[type as AccountType] ?? "Company or studio"} name="organization" autoComplete="organization" maxLength={120}
                defaultValue={state.values?.organization ?? user.organization ?? ""} trailing={<span className="text-[12px] text-mute">Optional</span>} />
            </div>
            <div className="space-y-6">
              <AccountTypeCards value={type} onChange={setType} error={state.fieldErrors?.accountType} compact />
              <div className="grid gap-2.5 sm:grid-cols-2">
                <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
                <button type="button" onClick={() => setEditing(false)} className="inline-flex h-12 w-full items-center justify-center rounded-full border border-ink/20 px-6 text-body font-medium transition hover:border-ink">Cancel</button>
              </div>
            </div>
          </form>
        </section>
      )}

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <section className="lg:col-span-8" aria-labelledby="work-heading">
          <div className="mb-6 flex items-end justify-between"><h2 id="work-heading" className="t-h1">{isClient ? "Briefs" : "Work"}</h2><span className="text-small text-mute">0 {isClient ? "briefs" : "projects"}</span></div>
          <div className="flex flex-col items-center rounded-md border border-dashed border-line px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sunk"><FolderPlus className="h-5 w-5" /></span>
            <h3 className="t-h3 mt-5">{isClient ? "No briefs yet" : "Nothing published yet"}</h3>
            <p className="mt-2 max-w-sm text-body text-mute">{isClient ? "Briefs you post will appear here, with the people who applied." : "Projects you publish will appear here. Clients find you through your work."}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button href={isClient ? "/talent" : "/discover"}>{isClient ? "Find talent" : "See what others share"}</Button>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4" aria-labelledby="setup-heading">
          <div className="rounded-md border border-line bg-surface p-5">
            <div className="flex items-baseline justify-between"><h2 id="setup-heading" className="t-caption">Getting started</h2><span className="text-small text-mute tabular-nums">{doneCount}/{steps.length}</span></div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunk"><div className="h-full rounded-full bg-forest transition-all dark:bg-mantis" style={{ width: `${(doneCount / steps.length) * 100}%` }} /></div>
            <ul className="mt-5 space-y-3">
              {steps.map((s) => (
                <li key={s.label} className="flex items-start gap-3 text-small">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${s.done ? "bg-forest text-praxeti dark:bg-mantis dark:text-midnight" : "border border-line"}`} aria-hidden="true">{s.done && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                  <span className={s.done ? "text-mute line-through" : "text-ink"}>{s.label}<span className="sr-only">{s.done ? " (done)" : " (to do)"}</span></span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
