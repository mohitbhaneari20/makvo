"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Sparkles, Video } from "lucide-react";
import { PEOPLE, personById } from "@/data/people";
import { TEAMS } from "@/data/teams";
import { PROJECTS } from "@/data/projects";
import { scorePerson } from "@/lib/match";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { AvailabilityBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip, Skeleton } from "@/components/ui/Misc";
import { SubNav, OPP_NAV } from "@/components/shell/SubNav";
import { ProjectArt } from "@/components/art/ProjectArt";
import { useApp } from "@/lib/store";

const EXAMPLES = ["I need a designer and developer to build a modern SaaS website.", "We’re launching a fintech mobile app and need a design lead.", "Looking for a brand identity for a small ceramics studio."];
const BUDGETS = ["Under $2K", "$2K–$5K", "$5K–$10K", "$10K+"];
const STEPS = ["Reading your brief", "Looking through 12,480 portfolios", "Checking budgets and availability", "Ranking the best fits"];

interface Result { kind: "person" | "team"; id: string; name: string; role: string; tags: string[]; rate: [number, number]; availability: "Available" | "Limited" | "Booked"; tone: string; score: number; why: { k: string; v: string; s: number }[]; members?: string[]; works: string[] }

const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);

function build(prompt: string, budget: string): Result[] {
  const t = tok(prompt);
  const wantsDesign = /design|brand|ui|ux|identity|logo/.test(prompt.toLowerCase());
  const wantsDev = /develop|build|code|engineer|app|react|shopify|site|website/.test(prompt.toLowerCase());
  const isSaas = t.includes("saas");
  const [bLo, bHi] = budget === "Under $2K" ? [0, 2] : budget === "$2K–$5K" ? [2, 5] : budget === "$5K–$10K" ? [5, 10] : budget === "$10K+" ? [10, 99] : isSaas ? [2, 6] : [0, 99];
  const why = (p: { skills: string[]; industries: string[]; style: string[]; rate: [number, number]; availability: string; projects: string[] }, s: number) => {
    const skillHits = p.skills.filter((x) => t.some((w) => x.toLowerCase().includes(w)));
    const indHits = p.industries.filter((x) => t.some((w) => x.toLowerCase().includes(w) || w.includes(x.toLowerCase())));
    const fit = p.rate[0] <= bHi && p.rate[1] >= bLo;
    const rel = p.projects.map((id) => PROJECTS.find((x) => x.id === id)?.name).filter(Boolean).slice(0, 2).join(" and ");
    return [
      { k: "Relevant industry", v: indHits.length ? `Has shipped ${indHits.join(", ")} work` : `Adjacent experience in ${p.industries[0]}`, s: indHits.length ? 96 : 72 },
      { k: "Similar project style", v: `${p.style.slice(0, 2).join(" and ")} approach. See ${rel || "their work"}`, s: Math.min(95, s - 2) },
      { k: "Required skills", v: skillHits.length ? `Covers ${skillHits.slice(0, 4).join(", ")}` : `Core skills: ${p.skills.slice(0, 3).join(", ")}`, s: skillHits.length ? 94 : 76 },
      { k: "Budget compatibility", v: fit ? `Typical range $${p.rate[0]}K–$${p.rate[1]}K fits your budget` : `Usually $${p.rate[0]}K–$${p.rate[1]}K, may stretch your budget`, s: fit ? 93 : 60 },
      { k: "Availability", v: p.availability === "Available" ? "Can start within a week" : p.availability === "Limited" ? "Has room for one more project" : "Booked for now", s: p.availability === "Available" ? 98 : p.availability === "Limited" ? 78 : 30 },
    ];
  };
  const mk = (id: string, score?: number): Result => { const p = personById(id); const s = score ?? scorePerson(p, t); return { kind: "person", id, name: p.name, role: p.role, tags: p.skills.slice(0, 3), rate: p.rate, availability: p.availability, tone: p.tone, score: s, works: p.projects, why: why({ skills: p.skills, industries: p.dna.industries, style: p.dna.style, rate: p.rate, availability: p.availability, projects: p.projects }, s) }; };
  const mt = (id: string, score?: number): Result => { const tm = TEAMS.find((x) => x.id === id)!; const ms = tm.members.map((m) => personById(m.id)); const s = score ?? Math.min(96, Math.round(ms.reduce((a, p) => a + scorePerson(p, t), 0) / ms.length) + 2); return { kind: "team", id, name: tm.name, role: tm.tagline, tags: tm.industries, rate: tm.rate as [number, number], availability: tm.availability, tone: tm.tone, score: s, works: tm.projects, members: tm.members.map((m) => m.id), why: why({ skills: ms.flatMap((m) => m.skills), industries: tm.industries, style: ms[0].dna.style, rate: tm.rate as [number, number], availability: tm.availability, projects: tm.projects }, s) }; };

  if (isSaas && wantsDesign && wantsDev) return [mk("varun-sharma", 94), mk("rahul-mehta", 91), mt("studio-north", 89)];
  const people = PEOPLE.filter((p) => (wantsDesign && !wantsDev ? p.kind === "designer" || p.group.includes("Branding") : wantsDev && !wantsDesign ? p.kind === "developer" : true)).map((p) => mk(p.id));
  const teams = wantsDesign && wantsDev ? TEAMS.map((x) => mt(x.id)) : [];
  return [...people, ...teams].sort((a, b) => b.score - a.score).slice(0, 3);
}

export default function Talent() {
  const [prompt, setPrompt] = useState("");
  const [budget, setBudget] = useState("");
  const [phase, setPhase] = useState<"idle" | "thinking" | "done">("idle");
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const { decisions, decide, toast } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  const run = (text = prompt) => {
    if (!text.trim()) return;
    setPhase("thinking"); setStep(0); setOpen(null);
    [0, 1, 2, 3].forEach((i) => setTimeout(() => setStep(i), i * 520));
    setTimeout(() => { setResults(build(text, budget)); setPhase("done"); setOpen(null); setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80); }, 2200);
  };
  const detected = useMemo(() => {
    const l = prompt.toLowerCase(); const d: string[] = [];
    if (/design/.test(l)) d.push("Designer"); if (/develop|build|code/.test(l)) d.push("Developer"); if (/brand|identity/.test(l)) d.push("Brand"); if (/mobile|app/.test(l)) d.push("Mobile"); if (/saas/.test(l)) d.push("SaaS"); if (/fintech|bank/.test(l)) d.push("Fintech"); if (/web|site/.test(l)) d.push("Website"); if (budget) d.push(budget);
    return d;
  }, [prompt, budget]);

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><div className="mb-5"><SubNav items={OPP_NAV} id="opps" /></div><h1 className="t-h1 max-w-3xl">Find the right people for your project.</h1><p className="mt-3 max-w-lg text-body text-mute">Describe what you need in your own words. We’ll look at real work, availability and budget.</p></div>

      <div className="rounded-md border border-line bg-surface p-4 shadow-soft md:p-6">
        <label className="t-caption mb-3 block" htmlFor="brief">Tell us what you’re building</label>
        <textarea id="brief" rows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") run(); }}
          placeholder="e.g. I need a designer and developer to build a modern SaaS website." className="w-full resize-none bg-transparent text-[1.25rem] leading-snug outline-none placeholder:text-faint md:text-[1.6rem]" />
        <AnimatePresence>{detected.length > 0 && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex flex-wrap items-center gap-1.5 overflow-hidden"><span className="mr-1 flex items-center gap-1 text-small text-mute"><Sparkles className="h-3.5 w-3.5 text-hi" />Understood</span>{detected.map((d) => <Badge key={d} tone="accent">{d}</Badge>)}</motion.div>}</AnimatePresence>
        <div className="mt-5 flex flex-col justify-between gap-4 border-t border-line pt-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-small text-mute">Budget</span>{BUDGETS.map((b) => <Chip key={b} active={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>{b}</Chip>)}</div>
          <Button size="lg" onClick={() => run()} disabled={!prompt.trim() || phase === "thinking"} loading={phase === "thinking"} iconRight={<ArrowRight className="h-4 w-4" />}>Find matches</Button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-small text-mute">Try</span>{EXAMPLES.map((e) => <button key={e} onClick={() => { setPrompt(e); run(e); }} className="rounded-full border border-line px-3.5 py-1.5 text-left text-small transition hover:border-ink">{e}</button>)}</div>

      <div ref={ref} className="scroll-mt-24 pt-14">
        {phase === "thinking" && (
          <div>
            <ul className="mb-8 space-y-2">{STEPS.map((s, i) => <li key={s} className={`flex items-center gap-2.5 text-body transition-colors ${i <= step ? "text-ink" : "text-faint"}`}><span className={`flex h-4 w-4 items-center justify-center rounded-full ${i < step ? "bg-ok text-white" : i === step ? "border-2 border-ink border-t-transparent animate-spin" : "border border-line"}`}>{i < step && <Check className="h-2.5 w-2.5" strokeWidth={3.5} />}</span>{s}</li>)}</ul>
            {[0, 1, 2].map((i) => <div key={i} className="grid gap-4 border-t border-line py-8 lg:grid-cols-12"><Skeleton className="h-16 w-16 !rounded-full lg:col-span-1" /><div className="lg:col-span-6"><Skeleton className="h-6 w-1/2" /><Skeleton className="mt-3 h-4 w-2/3" /></div><div className="lg:col-span-5"><Skeleton className="h-10 w-full" /></div></div>)}
          </div>
        )}
        {phase === "done" && (
          <div>
            <div className="mb-6 flex items-end justify-between"><div><div className="t-caption mb-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-hi" />Prototype of AI matching</div><h2 className="t-h1 !text-[clamp(1.8rem,3.4vw,2.8rem)]">Your recommended matches</h2></div></div>
            <ol className="border-b border-line">
              {results.map((r, i) => {
                const isOpen = open === r.id; const dec = decisions[r.id];
                return (
                  <motion.li key={r.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, duration: 0.6 }} className="border-t border-line">
                    <div className="grid items-center gap-5 py-7 lg:grid-cols-12 md:gap-8">
                      <div className="flex items-center gap-4 lg:col-span-5">
                        <span className="font-mono text-small text-mute">{i + 1}.</span>
                        {r.kind === "team" ? <AvatarStack people={r.members!.map((m) => personById(m))} size={44} /> : <Avatar name={r.name} tone={r.tone} size={60} />}
                        <div className="min-w-0"><Link href={r.kind === "team" ? `/teams/${r.id}` : `/people/${r.id}`} className="t-h3 hover:underline">{r.name}</Link><div className="text-small text-mute">{r.role}</div><div className="mt-1.5 text-small">{r.tags.join(" · ")}</div></div>
                      </div>
                      <div className="grid grid-cols-3 items-end gap-4 lg:col-span-4">
                        <div><div className="t-caption mb-1">Match</div><div className="t-h2 tabular-nums text-hi">{r.score}%</div></div>
                        <div><div className="t-caption mb-1">Budget</div><div className="text-h3 tabular-nums">${r.rate[0]}K–${r.rate[1]}K</div></div>
                        <div><AvailabilityBadge a={r.availability} className="!text-[12px]" /></div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end">
                        <Button size="sm" variant="primary" href={r.kind === "team" ? `/teams/${r.id}` : `/people/${r.id}`}>View</Button>
                        {r.kind === "person" && <Button size="sm" variant="outline" icon={<Video className="h-3.5 w-3.5" />} href={`/interview?with=${r.id}`}>Interview</Button>}
                        <Button size="sm" variant={dec === "shortlist" ? "soft" : "outline"} onClick={() => { decide(r.id, "shortlist"); toast(`${r.name} shortlisted`); }}>{dec === "shortlist" ? "Shortlisted" : "Shortlist"}</Button>
                      </div>
                    </div>
                    <button onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen} className="mb-5 inline-flex items-center gap-1.5 text-small font-medium text-ink"><Sparkles className="h-3.5 w-3.5 text-hi" />Why this match?<ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} /></button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden">
                          <div className="mb-8 grid gap-8 rounded-sm bg-sunk/70 p-5 lg:grid-cols-12 md:p-6">
                            <ul className="space-y-4 lg:col-span-7">{r.why.map((w) => (<li key={w.k}><div className="flex items-baseline justify-between gap-4"><span className="text-body font-medium">{w.k}</span><span className="text-small tabular-nums text-mute">{w.s}</span></div><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line"><motion.div initial={{ width: 0 }} animate={{ width: `${w.s}%` }} transition={{ duration: 0.8, delay: 0.1 }} className={`h-full rounded-full ${w.s > 85 ? "bg-ink" : "bg-faint"}`} /></div><p className="mt-1.5 text-small text-mute">{w.v}</p></li>))}</ul>
                            <div className="lg:col-span-5"><div className="t-caption mb-3">Relevant work</div><div className="grid grid-cols-2 gap-3">{r.works.slice(0, 2).map((id) => { const p = PROJECTS.find((x) => x.id === id)!; return <Link key={id} href={`/work/${id}`}><div className="aspect-[4/3] overflow-hidden rounded-xs"><ProjectArt art={p.art} palette={p.palette} /></div><div className="mt-1.5 text-small font-medium">{p.name}</div></Link>; })}</div></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ol>
            <p className="mt-6 text-small text-mute">In the full product, matching uses portfolio content, verified outcomes, reviews and live availability. This prototype scores on skills, industry, style, budget and availability.</p>
          </div>
        )}
      </div>
    </div>
  );
}
