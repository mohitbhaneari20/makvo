"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";
import { useApp } from "@/lib/store";
import { JOBS, jobById, fmtBudget } from "@/data/jobs";
import { PEOPLE, personById } from "@/data/people";
import { WORKSPACE } from "@/data/workspace";
import { contact } from "@/data/social";
import { recommendFor, scorePerson } from "@/lib/match";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, AvailabilityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip, Counter } from "@/components/ui/Misc";
import { Tabs } from "@/components/ui/Tabs";
import { JobCard } from "@/components/cards/JobCard";
import { PersonCard } from "@/components/cards/PersonCard";
import type { Availability } from "@/data/types";

const CREATOR_TABS = ["Overview", "Active Projects", "Applications", "Messages", "Earnings", "Profile views", "Opportunities", "Availability"] as const;
const CLIENT_TABS = ["Overview", "Active Projects", "Applicants", "Shortlisted", "Interviews", "Messages", "Payments", "Talent recommendations"] as const;

function Bars({ data, labels, prefix = "$" }: { data: number[]; labels: string[]; prefix?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-48 items-end gap-3" role="img" aria-label="Bar chart">
      {data.map((v, i) => (
        <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
          <span className="text-[11px] tabular-nums text-mute opacity-0 transition group-hover:opacity-100">{prefix}{v.toLocaleString()}</span>
          <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 80}%` }} transition={{ duration: 0.8, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] }} className={`w-full rounded-t-xs transition-colors ${i === data.length - 1 ? "grad-spring" : "bg-ink/85 group-hover:bg-ink"}`} />
          <span className="text-[11px] text-mute">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function Line({ data }: { data: number[] }) {
  const w = 600, h = 160, max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 12 - ((v - min) / (max - min || 1)) * (h - 32)]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-48 w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label="Line chart">
      <defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#74C365" stopOpacity=".35" /><stop offset="1" stopColor="#DBE64C" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75].map((t) => <line key={t} x1="0" x2={w} y1={h * t} y2={h * t} stroke="rgb(var(--line))" strokeDasharray="3 5" />)}
      <path d={`${d} L${w} ${h} L0 ${h} Z`} fill="url(#lg)" />
      <motion.path d={d} fill="none" stroke="#00804C" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const Stat = ({ l, v, p = "", s = "", sub, d = 0 }: { l: string; v: number; p?: string; s?: string; sub?: string; d?: number }) => (
  <div className="bg-paper p-5 md:p-6"><div className="t-caption mb-3">{l}</div><div className="t-h1 !text-[clamp(1.8rem,3vw,2.6rem)]"><Counter to={v} prefix={p} suffix={s} decimals={d} /></div>{sub && <div className="mt-1 text-small text-mute">{sub}</div>}</div>
);
const Panel = ({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <section><div className="mb-5 flex items-end justify-between gap-4"><h2 className="t-h3">{title}</h2>{action}</div>{children}</section>
);

export default function Dashboard() {
  const { role, setRole, applications, interviews, convos, decisions, decide, toast, workspaces } = useApp();
  const [tab, setTab] = useState<string>("Overview");
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d");
  const [avail, setAvail] = useState<Availability>("Available");
  const [hours, setHours] = useState(24);
  const tabs = role === "creator" ? CREATOR_TABS : CLIENT_TABS;
  const unread = convos.reduce((a, c) => a + c.unread, 0);
  const views = useMemo(() => ({ "7d": [310, 420, 380, 510, 470, 640, 702], "30d": [220, 260, 310, 290, 380, 420, 410, 520, 560, 610, 590, 702], "90d": [120, 160, 210, 190, 260, 310, 340, 420, 480, 560, 640, 702] }[range]), [range]);
  const apps = Object.entries(applications);
  const first = JOBS[0];
  const applicants = PEOPLE.filter((p) => p.id !== "varun-sharma" || true).map((p) => ({ p, score: scorePerson(p, [...first.skills, first.category]) })).sort((a, b) => b.score - a.score).slice(0, 6);
  const shortlisted = PEOPLE.filter((p) => decisions[p.id] === "shortlist" || ["varun-sharma", "leo-marchetti"].includes(p.id) && !decisions[p.id]);
  const switchRole = (r: "creator" | "client") => { setRole(r); setTab("Overview"); };

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div><div className="t-caption mb-3">{role === "creator" ? "Creator dashboard" : "Client dashboard"}</div><h1 className="t-h1">{role === "creator" ? "Good morning, Varun." : "Good morning, Amelia."}</h1><p className="mt-3 text-body text-mute">{role === "creator" ? `You have ${unread} unread messages, 1 interview this week and 3 new briefs that match.` : `${applicants.length} people applied to your open brief. 2 interviews this week.`}</p></div>
        <div className="inline-flex rounded-full bg-sunk p-1">{(["creator", "client"] as const).map((r) => <button key={r} onClick={() => switchRole(r)} className={`relative rounded-full px-4 py-1.5 text-small font-medium capitalize ${role === r ? "text-paper" : "text-mute"}`}>{role === r && <motion.span layoutId="dash-role" className="absolute inset-0 rounded-full bg-ink" />}<span className="relative">{r}</span></button>)}</div>
      </div>

      <Tabs id={`dash-${role}`} tabs={tabs as readonly string[]} value={tab} onChange={setTab} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={role + tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pt-8">

          {/* ---------------- CREATOR ---------------- */}
          {role === "creator" && tab === "Overview" && (
            <div className="space-y-14">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4"><Stat l="Earned this month" v={4800} p="$" sub="+22% vs. September" /><Stat l="Active projects" v={1 + workspaces.length} sub="1 due this month" /><Stat l="Applications" v={apps.length} sub="1 shortlisted" /><Stat l="Profile views" v={12480} sub="+18% this week" /></div>
              <div className="grid gap-12 lg:grid-cols-2">
                <Panel title="Earnings, last 6 months" action={<span className="text-small text-mute">$14,200 total</span>}><Bars data={[1800, 2400, 1200, 3100, 2900, 4800]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} /></Panel>
                <Panel title="Next up"><ul className="border-b border-line">{[["Weekly sync · Finora", "Thu 8 Oct · 16:00", "/projects/finora-website"], ["Interview · Kora Bank", "Thu 8 Oct · 16:00", "/projects"], ["Development milestone", "Due 18 Oct", "/projects/finora-website"]].map(([a, b, h]) => <li key={a}><Link href={h} className="flex items-center justify-between border-t border-line py-4 hover:bg-sunk/50"><span className="text-body font-medium">{a}</span><span className="text-small text-mute">{b}</span></Link></li>)}</ul></Panel>
              </div>
              <Panel title="Matched for you" action={<Link href="/opportunities" className="inline-flex items-center gap-1 text-small underline-link">All opportunities <ArrowRight className="h-3.5 w-3.5" /></Link>}><div className="border-b border-line">{JOBS.slice(0, 2).map((j, i) => <JobCard key={j.id} job={j} index={i} />)}</div></Panel>
            </div>
          )}
          {role === "creator" && tab === "Active Projects" && (
            <div className="border-b border-line">{[{ id: WORKSPACE.id, name: WORKSPACE.name, p: 68, d: "24 Oct" }, ...workspaces.map((w) => ({ id: w.id, name: w.name, p: 4, d: "In 4 weeks" }))].map((w) => <Link key={w.id} href={`/projects/${w.id}`} className="group grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12"><div className="lg:col-span-5"><div className="t-h3 group-hover:underline">{w.name}</div><div className="text-small text-mute">Deadline {w.d}</div></div><div className="lg:col-span-5"><div className="mb-1 flex justify-between text-small"><span className="text-mute">Progress</span><span className="tabular-nums">{w.p}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-sunk"><div className="h-full rounded-full bg-ink" style={{ width: `${w.p}%` }} /></div></div><div className="lg:col-span-2 lg:text-right"><ArrowRight className="inline h-4 w-4" /></div></Link>)}</div>
          )}
          {role === "creator" && tab === "Applications" && (
            <div className="border-b border-line">{apps.map(([id, a]) => { const j = jobById(id); return <Link key={id} href={`/opportunities/${id}`} className="grid items-center gap-3 border-t border-line py-6 lg:grid-cols-12"><div className="lg:col-span-6"><div className="t-h3">{j.title}</div><div className="text-small text-mute">{j.client} · {a.at}</div></div><div className="text-body tabular-nums lg:col-span-3">{a.price} · {a.timeline}</div><div className="lg:col-span-3 lg:text-right"><Badge tone={a.status === "Shortlisted" ? "ok" : a.status === "Viewed" ? "neutral" : "accent"}>{a.status}</Badge></div></Link>; })}</div>
          )}
          {role === "creator" && tab === "Messages" && (
            <ul className="border-b border-line">{convos.slice(0, 5).map((c) => { const k = contact(c.with); return <li key={c.id}><Link href={`/messages?c=${c.id}`} className="flex items-center gap-4 border-t border-line py-5 hover:bg-sunk/40"><Avatar name={k.name} tone={k.tone} size={44} /><div className="min-w-0 flex-1"><div className={`text-body ${c.unread ? "font-semibold" : "font-medium"}`}>{k.name} <span className="font-normal text-mute">· {c.topic}</span></div><div className="truncate text-small text-mute">{c.last}</div></div>{c.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-midnight">{c.unread}</span>}</Link></li>; })}</ul>
          )}
          {role === "creator" && tab === "Earnings" && (
            <div className="space-y-12"><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4"><Stat l="Total earned" v={14200} p="$" /><Stat l="In escrow" v={3200} p="$" /><Stat l="Upcoming" v={800} p="$" /><Stat l="Avg. per project" v={4733} p="$" /></div><Panel title="Monthly earnings"><Bars data={[1800, 2400, 1200, 3100, 2900, 4800]} labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]} /></Panel>
              <Panel title="Recent payouts"><ul className="border-b border-line">{[["Finora · Design milestone", "$2,400", "12 Sep"], ["Finora · Discovery milestone", "$1,200", "28 Aug"], ["Atelier Sol · Final invoice", "$3,100", "30 Jul"]].map(([a, b, c]) => <li key={a} className="flex items-center justify-between border-t border-line py-4"><span className="text-body">{a}</span><span className="text-body tabular-nums"><span className="mr-5 text-mute">{c}</span>{b}</span></li>)}</ul></Panel></div>
          )}
          {role === "creator" && tab === "Profile views" && (
            <div><div className="mb-6 flex items-end justify-between"><div><div className="t-caption mb-2">Profile views</div><div className="t-h1"><Counter to={views[views.length - 1] * 18} /></div></div><div className="flex gap-2">{(["7d", "30d", "90d"] as const).map((r) => <Chip key={r} active={range === r} onClick={() => setRange(r)}>{r}</Chip>)}</div></div><Line data={views} />
              <div className="mt-12 grid gap-12 md:grid-cols-2"><Panel title="Who’s looking"><ul className="border-b border-line">{[["Ines Carvalho", "Founder, Atelier Sol", "12 min ago"], ["Hana Sato", "PM, Syntra", "2 hours ago"], ["A studio in Berlin", "3 people", "Yesterday"]].map(([a, b, c]) => <li key={a} className="flex items-center justify-between border-t border-line py-4"><div><div className="text-body font-medium">{a}</div><div className="text-small text-mute">{b}</div></div><span className="flex items-center gap-1 text-small text-mute"><Eye className="h-3.5 w-3.5" />{c}</span></li>)}</ul></Panel>
                <Panel title="Most viewed work"><ul className="border-b border-line">{[["Finora", "4,120"], ["Noma", "3,310"], ["Orbit", "2,680"]].map(([a, b]) => <li key={a} className="flex items-center justify-between border-t border-line py-4"><span className="text-body font-medium">{a}</span><span className="tabular-nums text-body">{b}</span></li>)}</ul></Panel></div></div>
          )}
          {role === "creator" && tab === "Opportunities" && <div className="border-b border-line">{JOBS.slice(0, 5).map((j, i) => <JobCard key={j.id} job={j} index={i} />)}</div>}
          {role === "creator" && tab === "Availability" && (
            <div className="max-w-2xl space-y-10"><Panel title="Your status">
              <div className="grid gap-2 sm:grid-cols-3">{(["Available", "Limited", "Booked"] as const).map((a) => <button key={a} onClick={() => { setAvail(a); toast(`Profile now shows “${a}”`); }} className={`rounded-sm border p-4 text-left transition ${avail === a ? "border-ink bg-surface shadow-soft" : "border-line hover:border-ink/50"}`}><AvailabilityBadge a={a} /><div className="mt-2 text-small text-mute">{{ Available: "Appear first in searches and match feeds.", Limited: "Room for one more project.", Booked: "Hidden from new invitations." }[a]}</div></button>)}</div></Panel>
              <Panel title="Weekly capacity"><div className="flex items-baseline justify-between"><span className="t-h2 tabular-nums">{hours} hrs</span><span className="text-small text-mute">per week</span></div><input type="range" min={0} max={40} value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-4 h-2 w-full cursor-pointer accent-[rgb(var(--ink))]" aria-label="Weekly hours" /></Panel>
              <Panel title="Open to"><div className="flex flex-wrap gap-2">{["Fixed-price projects", "Retainers", "Team projects", "Mentoring"].map((o, i) => <Chip key={o} active={i < 3}>{o}</Chip>)}</div></Panel>
              <Button onClick={() => toast("Availability saved")}>Save changes</Button></div>
          )}

          {/* ---------------- CLIENT ---------------- */}
          {role === "client" && tab === "Overview" && (
            <div className="space-y-14">
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4"><Stat l="Active projects" v={2 + workspaces.length} /><Stat l="Applicants" v={14} sub="6 strong matches" /><Stat l="Shortlisted" v={shortlisted.length} /><Stat l="Spent to date" v={18400} p="$" /></div>
              <Panel title="Your open brief" action={<Button size="sm" variant="outline" href="/opportunities/saas-website-redesign">View brief</Button>}><div className="rounded-md border border-line bg-surface p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><div className="t-h3">{first.title}</div><div className="text-small text-mute">{fmtBudget(first.budget)} · {first.timeline} · Posted {first.posted}</div></div><Badge tone="accent">14 applicants</Badge></div></div></Panel>
              <Panel title="Top applicants" action={<button onClick={() => setTab("Applicants")} className="text-small underline-link">See all</button>}><div className="grid gap-6 md:grid-cols-3">{applicants.slice(0, 3).map((a, i) => <PersonCard key={a.p.id} person={a.p} match={a.score} index={i} />)}</div></Panel>
            </div>
          )}
          {role === "client" && tab === "Active Projects" && (
            <div className="border-b border-line">{[{ id: "finora-website", n: "Finora Website", p: 68, s: "In progress" }, { id: "brand-refresh", n: "Northwind Brand Refresh", p: 32, s: "In progress" }, ...workspaces.map((w) => ({ id: w.id, n: w.name, p: 4, s: "Just started" }))].map((w) => <Link key={w.id} href={w.id === "brand-refresh" ? "/projects/finora-website" : `/projects/${w.id}`} className="group grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12"><div className="lg:col-span-5"><div className="t-h3 group-hover:underline">{w.n}</div><div className="text-small text-mute">{w.s}</div></div><div className="lg:col-span-5"><div className="h-1.5 overflow-hidden rounded-full bg-sunk"><div className="h-full rounded-full bg-ink" style={{ width: `${w.p}%` }} /></div><div className="mt-1 text-small tabular-nums text-mute">{w.p}%</div></div><div className="lg:col-span-2 lg:text-right"><ArrowRight className="inline h-4 w-4" /></div></Link>)}</div>
          )}
          {role === "client" && tab === "Applicants" && (
            <ul className="border-b border-line">{applicants.map(({ p, score }) => <li key={p.id} className="grid items-center gap-4 border-t border-line py-6 lg:grid-cols-12"><Link href={`/people/${p.id}`} className="flex items-center gap-4 lg:col-span-5"><Avatar name={p.name} tone={p.tone} size={52} /><div><div className="t-h3 hover:underline">{p.name}</div><div className="text-small text-mute">{p.role}</div></div></Link><div className="grid grid-cols-2 gap-4 lg:col-span-3"><div><div className="t-caption mb-1">Match</div><div className="text-h3 text-hi">{score}%</div></div><div><div className="t-caption mb-1">Proposed</div><div className="text-h3 tabular-nums">${(p.rate[0] + 1) * 1000}</div></div></div><div className="flex gap-2 lg:col-span-4 lg:justify-end"><Button size="sm" variant={decisions[p.id] === "shortlist" ? "soft" : "outline"} onClick={() => { decide(p.id, "shortlist"); toast(`${p.name.split(" ")[0]} shortlisted`); }}>{decisions[p.id] === "shortlist" ? "Shortlisted" : "Shortlist"}</Button><Button size="sm" href={`/interview?with=${p.id}`}>Interview</Button></div></li>)}</ul>
          )}
          {role === "client" && tab === "Shortlisted" && (shortlisted.length ? <div className="grid gap-6 md:grid-cols-3">{shortlisted.map((p, i) => <PersonCard key={p.id} person={p} index={i} match={scorePerson(p, [...first.skills, first.category])} />)}</div> : <p className="text-body text-mute">Shortlist people from the Applicants tab.</p>)}
          {role === "client" && tab === "Interviews" && (
            <div className="border-b border-line">{[...interviews.filter((i) => i.personId !== "varun-sharma"), { personId: "aiko-tanaka", jobId: "ai-dashboard", slot: "Fri 9 Oct · 11:30", at: "" }, { personId: "varun-sharma", jobId: "saas-website-redesign", slot: "Mon 12 Oct · 10:00", at: "" }].map((i, k) => { const p = personById(i.personId); return <div key={k} className="grid items-center gap-4 border-t border-line py-6 lg:grid-cols-12"><div className="flex items-center gap-4 lg:col-span-5"><Avatar name={p.name} tone={p.tone} size={48} /><div><div className="t-h3">{p.name}</div><div className="text-small text-mute">{jobById(i.jobId).title}</div></div></div><div className="text-body lg:col-span-4">{i.slot}</div><div className="lg:col-span-3 lg:text-right"><Button size="sm" href={`/interview?with=${p.id}`}>Join interview</Button></div></div>; })}</div>
          )}
          {role === "client" && tab === "Messages" && (<ul className="border-b border-line">{convos.slice(0, 4).map((c) => { const k = contact(c.with); return <li key={c.id}><Link href={`/messages?c=${c.id}`} className="flex items-center gap-4 border-t border-line py-5"><Avatar name={k.name} tone={k.tone} size={44} /><div className="min-w-0 flex-1"><div className="text-body font-medium">{k.name} <span className="font-normal text-mute">· {c.topic}</span></div><div className="truncate text-small text-mute">{c.last}</div></div></Link></li>; })}</ul>)}
          {role === "client" && tab === "Payments" && (
            <div className="space-y-12"><div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line lg:grid-cols-4"><Stat l="Spent to date" v={18400} p="$" /><Stat l="In escrow" v={3200} p="$" /><Stat l="Upcoming" v={800} p="$" /><Stat l="Projects funded" v={4} /></div>
              <ul className="border-b border-line">{WORKSPACE.milestones.map((m) => <li key={m.name} className="flex items-center justify-between border-t border-line py-5"><div><div className="text-body font-medium">Finora Website · {m.name}</div><div className="text-small text-mute">{m.state}</div></div><span className="text-h3 tabular-nums">${m.amount.toLocaleString()}</span></li>)}</ul></div>
          )}
          {role === "client" && tab === "Talent recommendations" && (<div><p className="mb-8 max-w-lg text-body text-mute">Based on your open brief and the work you’ve saved.</p><div className="grid gap-6 md:grid-cols-3">{recommendFor(first, 3).map((r, i) => <PersonCard key={r.p.id} person={r.p} match={r.score} index={i} />)}</div><div className="mt-10"><Button href="/talent" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>Describe a new project</Button></div></div>)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
