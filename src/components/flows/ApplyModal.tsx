"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, ChevronLeft, Sparkles } from "lucide-react";
import { PEOPLE, personById } from "@/data/people";
import { PROJECTS } from "@/data/projects";
import { fmtBudget, fmtMoney } from "@/data/jobs";
import type { JobPost } from "@/data/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Misc";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Verified } from "@/components/ui/Badge";
import { useApp } from "@/lib/store";

const STEPS = ["Profile", "Work", "Approach", "Review"];
const PROMPTS = ["What caught my eye", "How I’d start", "One question for you"];

export function ApplyModal({ job, open, onClose }: { job: JobPost; open: boolean; onClose: () => void }) {
  const { apply, toast } = useApp();
  const me = personById("varun-sharma");
  const mine = me.projects.map((id) => PROJECTS.find((p) => p.id === id)!);
  const rank = (id: string) => { const p = PROJECTS.find((x) => x.id === id)!; return p.categories.filter((c) => job.skills.includes(c) || c === job.category).length + (job.skills.some((s) => p.tech.includes(s)) ? 1 : 0) + (p.industry === "Fintech" || p.industry === "AI" ? 0 : 0); };
  const sorted = useMemo(() => [...mine].sort((a, b) => rank(b.id) - rank(a.id)), [job.id]); // eslint-disable-line
  const mid = Math.round((job.budget[0] + job.budget[1]) / 2 / 50) * 50;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>(sorted.slice(0, 2).map((p) => p.id));
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [price, setPrice] = useState(mid);
  const [weeks, setWeeks] = useState(job.weeks);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const min = Math.round(job.budget[0] * 0.6 / 50) * 50, max = Math.round(job.budget[1] * 1.4 / 50) * 50;
  const within = price >= job.budget[0] && price <= job.budget[1];
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 3 ? (toast("Pick up to three"), p) : [...p, id]));
  const canNext = step === 1 ? picked.length > 0 : step === 2 ? msg.trim().length > 20 : true;
  const signals = [
    ["Relevant industry", job.skills.includes("SaaS") || job.skills.includes("Fintech") ? "SaaS and fintech work in your portfolio" : "Adjacent experience in your portfolio"],
    ["Required skills", `${job.skills.filter((s) => me.skills.includes(s)).length || 2} of ${job.skills.length} skills match`],
    ["Budget", `Your range $${me.rate[0]}K–$${me.rate[1]}K fits ${fmtBudget(job.budget)}`],
    ["Availability", "You’re available to start next week"],
  ];

  const send = () => { setBusy(true); setTimeout(() => { apply(job.id, { price: fmtMoney(price), timeline: `${weeks} weeks`, message: msg, work: picked }); setBusy(false); setDone(true); toast("Application sent"); }, 1100); };
  const close = () => { onClose(); setTimeout(() => { setDone(false); setStep(0); }, 300); };

  return (
    <Modal open={open} onClose={close} title="Apply" width="max-w-5xl">
      {done ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="grid overflow-y-auto md:grid-cols-2">
          <div className="p-8 md:p-14">
            <motion.div initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 280, damping: 13 }} className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok"><CheckCircle2 className="h-7 w-7" /></motion.div>
            <h2 className="t-h1 !text-[2.4rem]">Sent to {job.client}.</h2>
            <p className="mt-3 text-body text-mute">They’ll see your profile, the {picked.length} projects you picked and your note. Most teams reply within two days.</p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row"><Button href="/projects" onClick={close}>See your applications</Button><Button variant="outline" onClick={close}>Back to the brief</Button></div>
          </div>
          <div className="bg-surface p-8 md:p-14"><div className="t-caption mb-6">What happens next</div>
            <ol className="space-y-6">{[["Client reviews", "Usually within 48 hours"], ["Interview", "A 30-minute call if you’re shortlisted"], ["Decision", "Hired, second interview or a polite no"], ["Workspace", "A shared project space opens when you’re hired"]].map(([t, s], i) => (<li key={t} className="flex gap-4"><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${i === 0 ? "bg-ink text-paper" : "bg-sunk text-mute"}`}>{i + 1}</span><div><div className="text-body font-medium">{t}</div><div className="text-small text-mute">{s}</div></div></li>))}</ol></div>
        </motion.div>
      ) : (
        <div className="grid min-h-0 flex-1 md:h-[min(680px,86dvh)] md:grid-cols-[1.35fr_1fr]">
          <div className="flex min-h-0 flex-col">
            <div className="border-b border-line px-6 pb-4 pt-6 md:px-8">
              <div className="t-caption mb-1">Applying to {job.client}</div>
              <h2 className="t-h3 pr-8">{job.title}</h2>
              <ol className="mt-5 flex items-center gap-2">{STEPS.map((s, i) => (<li key={s} className="flex flex-1 items-center gap-2"><span className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= step ? "bg-ink" : "bg-line"}`} /></li>))}</ol>
              <div className="mt-2 flex justify-between text-[11px] text-mute">{STEPS.map((s, i) => <span key={s} className={i === step ? "font-medium text-ink" : ""}>{s}</span>)}</div>
            </div>

            <div className="min-h-[340px] flex-1 overflow-y-auto px-6 py-6 md:px-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
                  {step === 0 && (<div>
                    <h3 className="t-h2">This is who they’ll meet.</h3>
                    <div className="mt-6 flex items-center gap-4 rounded-md border border-line bg-surface p-4"><Avatar name={me.name} tone={me.tone} size={56} /><div className="min-w-0"><div className="text-h3">{me.name}</div><div className="text-small text-mute">{me.role} · {me.location}</div><div className="mt-1 text-small">{me.rating} · {me.jobsDone} projects · Replies {me.responds}</div></div></div>
                    <div className="t-caption mb-3 mt-7 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-hi" />Why you’re a {job.match}% match</div>
                    <ul className="divide-y divide-line border-y border-line">{signals.map(([a, b]) => (<li key={a} className="flex items-start gap-3 py-3"><span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ok/15 text-ok"><Check className="h-2.5 w-2.5" strokeWidth={3.5} /></span><div className="text-small"><span className="font-medium">{a}.</span> <span className="text-mute">{b}</span></div></li>))}</ul>
                  </div>)}
                  {step === 1 && (<div>
                    <h3 className="t-h2">Show your most relevant work.</h3>
                    <p className="mt-2 text-small text-mute">Sorted by relevance to this brief. Pick up to three and say why each matters.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {sorted.map((p, i) => { const on = picked.includes(p.id); return (
                        <div key={p.id}>
                          <button type="button" onClick={() => toggle(p.id)} aria-pressed={on} className={`group relative block w-full overflow-hidden rounded-sm text-left ring-2 transition ${on ? "ring-ink" : "ring-transparent hover:ring-line"}`}>
                            <div className="aspect-[4/3] bg-sunk"><ProjectArt art={p.art} palette={p.palette} /></div>
                            <span className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border transition ${on ? "border-ink bg-ink text-paper" : "border-white/70 bg-white/60 text-transparent"}`}><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>
                            {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-spring px-2 py-1 text-[11px] font-semibold text-midnight">Most relevant</span>}
                          </button>
                          <div className="mt-2 flex items-center justify-between"><span className="text-small font-medium">{p.name}</span><span className="text-[11px] text-mute">{p.kind}</span></div>
                          {on && <motion.input initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} value={notes[p.id] ?? ""} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })} placeholder="Why this one? (optional)" className="field mt-2 !py-2 !text-small" />}
                        </div>
                      ); })}
                    </div>
                  </div>)}
                  {step === 2 && (<div>
                    <h3 className="t-h2">Your approach.</h3>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-between"><span className="t-caption">Proposed price</span><span className="t-h2 tabular-nums">${price.toLocaleString()}</span></div>
                      <div className="relative mt-5">
                        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-mantis/45" style={{ left: `${((job.budget[0] - min) / (max - min)) * 100}%`, width: `${((job.budget[1] - job.budget[0]) / (max - min)) * 100}%` }} />
                        <input type="range" min={min} max={max} step={50} value={price} onChange={(e) => setPrice(+e.target.value)} className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-ink [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-line [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-line [&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink [&::-webkit-slider-thumb]:shadow-soft" aria-label="Proposed price" />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-small"><span className="text-mute">Client budget {fmtBudget(job.budget)}</span><span className={within ? "text-ok" : "text-mute"}>{within ? "Within budget" : price < job.budget[0] ? "Below their range" : "Above their range, explain why"}</span></div>
                    </div>
                    <div className="mt-8"><div className="flex items-baseline justify-between"><span className="t-caption">Estimated timeline</span><span className="t-h3">{weeks} {weeks === 1 ? "week" : "weeks"}</span></div><div className="mt-3 flex flex-wrap gap-2">{[2, 3, 4, 6, 8, 10, 12].map((w) => <Chip key={w} active={weeks === w} onClick={() => setWeeks(w)}>{w}w</Chip>)}</div><div className="mt-2 text-small text-mute">They asked for {job.timeline}.</div></div>
                    <div className="mt-8"><span className="t-caption">A short note</span>
                      <div className="mt-2 flex flex-wrap gap-1.5">{PROMPTS.map((p) => <button key={p} type="button" onClick={() => setMsg((m) => `${m}${m ? "\n\n" : ""}${p}: `)} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mute transition hover:border-ink hover:text-ink">+ {p}</button>)}</div>
                      <textarea rows={5} value={msg} onChange={(e) => setMsg(e.target.value)} className="field mt-3 resize-none" placeholder={`Hi ${job.client.split(" ")[0]} team, I read the brief twice. Here’s how I’d approach it…`} />
                      <div className="mt-1 text-[11px] text-mute">{msg.trim().length < 20 ? "A few real sentences beats a template." : "Looks good."}</div></div>
                  </div>)}
                  {step === 3 && (<div>
                    <h3 className="t-h2">Ready when you are.</h3>
                    <dl className="mt-6 divide-y divide-line border-y border-line text-body">
                      <div className="flex justify-between py-3"><dt className="text-mute">Price</dt><dd className="font-medium tabular-nums">${price.toLocaleString()}</dd></div>
                      <div className="flex justify-between py-3"><dt className="text-mute">Timeline</dt><dd className="font-medium">{weeks} weeks</dd></div>
                      <div className="flex justify-between py-3"><dt className="text-mute">Selected work</dt><dd className="font-medium">{picked.map((id) => PROJECTS.find((p) => p.id === id)!.name).join(", ")}</dd></div>
                      <div className="py-3"><dt className="mb-1 text-mute">Note</dt><dd className="whitespace-pre-wrap text-small">{msg}</dd></div>
                    </dl>
                    <p className="mt-4 text-small text-mute">You can withdraw any time before the client opens it.</p>
                  </div>)}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-line bg-surface px-6 py-4 md:px-8">
              <Button variant="ghost" onClick={() => (step === 0 ? close() : setStep(step - 1))} icon={<ChevronLeft className="h-4 w-4" />}>{step === 0 ? "Cancel" : "Back"}</Button>
              {step < 3 ? <Button onClick={() => setStep(step + 1)} disabled={!canNext}>Continue</Button> : <Button onClick={send} loading={busy} variant="accent">Send Application</Button>}
            </div>
          </div>

          {/* live preview — what the client sees */}
          <aside className="hidden border-l border-line bg-sunk/60 p-8 md:block">
            <div className="t-caption mb-4">How {job.client} will see it</div>
            <div className="rounded-sm border border-line bg-paper p-5 shadow-soft">
              <div className="flex items-center gap-3"><Avatar name={me.name} tone={me.tone} size={40} /><div><div className="text-body font-medium">{me.name}</div><div className="text-small text-mute">{me.role}</div></div><span className="ml-auto rounded-full bg-spring px-2 py-1 text-[11px] font-semibold text-midnight">{job.match}%</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2">{picked.slice(0, 2).map((id) => { const p = PROJECTS.find((x) => x.id === id)!; return <div key={id} className="aspect-[4/3] overflow-hidden rounded-xs"><ProjectArt art={p.art} palette={p.palette} /></div>; })}{picked.length === 0 && <div className="col-span-2 flex aspect-[8/3] items-center justify-center rounded-xs border border-dashed border-line text-small text-mute">Pick work to show</div>}</div>
              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4"><span className="text-h3 tabular-nums">${price.toLocaleString()}</span><span className="text-small text-mute">{weeks} weeks</span></div>
              <p className="mt-3 line-clamp-4 text-small text-mute">{msg || "Your note appears here."}</p>
            </div>
            <p className="mt-4 text-small text-mute">Thoughtful, specific applications get replies about three times as often.</p>
          </aside>
        </div>
      )}
    </Modal>
  );
}
