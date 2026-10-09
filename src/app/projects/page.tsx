"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Clock, Video } from "lucide-react";
import { useApp } from "@/lib/store";
import { JOBS, jobById, fmtBudget } from "@/data/jobs";
import { PROJECTS } from "@/data/projects";
import { WORKSPACE } from "@/data/workspace";
import { PEOPLE, personById } from "@/data/people";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Badge, Verified } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Empty } from "@/components/ui/Misc";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { JobCard } from "@/components/cards/JobCard";
import { ProjectArt } from "@/components/art/ProjectArt";
import { BRAND } from "@/lib/brand";

const TABS = ["Active", "Applications", "Interviews", "Saved", "Completed"] as const;
const sp = (id: string) => PEOPLE.find((p) => p.id === id) ?? personById("rahul-mehta");
const tone = { Shortlisted: "ok", Viewed: "neutral", "Under review": "accent" } as const;

export default function Projects() {
  const { workspaces, applications, interviews, saved, savedJobs, toast } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active");
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const apps = Object.entries(applications);
  const mine = PROJECTS.filter((p) => p.creators.some((c) => c.id === "varun-sharma"));

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><h1 className="t-h1">Your projects</h1><p className="mt-3 max-w-lg text-body text-mute">Everything in motion: active work, applications, interviews, and the finished projects that become your reputation.</p></div>
      <Tabs id="proj" tabs={TABS} value={tab} onChange={setTab} counts={{ Active: 1 + workspaces.length, Applications: apps.length, Interviews: interviews.length, Saved: saved.length + savedJobs.length }} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pt-8">
          {tab === "Active" && (
            <div className="border-b border-line">
              {[{ id: WORKSPACE.id, name: WORKSPACE.name, p: WORKSPACE.progress, due: WORKSPACE.deadline, status: WORKSPACE.status, withId: "rahul-mehta", next: "Development · 60%" }, ...workspaces.map((w) => ({ id: w.id, name: w.name, p: 4, due: "In 4 weeks", status: "Just started", withId: w.withId, next: "Discovery · 20%" }))].map((w) => (
                <Link key={w.id} href={`/projects/${w.id}`} data-cursor="Open" className="group grid items-center gap-5 border-t border-line py-8 lg:grid-cols-12 md:gap-8">
                  <div className="lg:col-span-5"><Badge tone={w.p > 10 ? "accent" : "ok"}>{w.status}</Badge><h2 className="t-h2 mt-3 transition-transform duration-500 group-hover:translate-x-1.5">{w.name}</h2><div className="mt-3 flex items-center gap-2.5"><AvatarStack people={[personById("varun-sharma"), sp(w.withId)]} size={26} /><span className="text-small text-mute">Varun, {sp(w.withId).name.split(" ")[0]}, Client</span></div></div>
                  <div className="lg:col-span-4"><div className="mb-2 flex justify-between text-small"><span className="text-mute">Next: {w.next}</span><span className="tabular-nums">{w.p}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-sunk"><motion.div initial={{ width: 0 }} animate={{ width: `${w.p}%` }} transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }} className="h-full rounded-full bg-ink" /></div></div>
                  <div className="flex items-center justify-between lg:col-span-3 lg:justify-end md:gap-6"><div className="lg:text-right"><div className="t-caption">Deadline</div><div className="text-h3">{w.due}</div></div><span className="hidden h-10 w-10 items-center justify-center rounded-full border border-line transition group-hover:border-ink group-hover:bg-ink group-hover:text-paper md:inline-flex"><ArrowRight className="h-4 w-4" /></span></div>
                </Link>
              ))}
            </div>
          )}
          {tab === "Applications" && (apps.length ? <div className="border-b border-line">{apps.map(([id, a]) => { const j = jobById(id); return (
            <div key={id} className="grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12 md:gap-8">
              <div className="lg:col-span-5"><Link href={`/opportunities/${id}`} className="t-h3 hover:underline">{j.title}</Link><div className="text-small text-mute">{j.client} · Applied {a.at}</div></div>
              <div className="grid grid-cols-2 gap-4 lg:col-span-4"><div><div className="t-caption mb-1">You proposed</div><div className="text-h3 tabular-nums">{a.price}</div></div><div><div className="t-caption mb-1">Timeline</div><div className="text-h3">{a.timeline}</div></div></div>
              <div className="flex items-center justify-between gap-3 lg:col-span-3 lg:justify-end"><Badge tone={tone[a.status ?? "Under review"]}>{a.status ?? "Under review"}</Badge><Button size="sm" variant="outline" href={`/opportunities/${id}`}>View</Button></div>
            </div>); })}</div> : <Empty title="No applications yet" sub="Find a brief that fits and send something thoughtful." action={<Button href="/opportunities">Browse opportunities</Button>} />)}
          {tab === "Interviews" && (interviews.length ? <div className="border-b border-line">{interviews.map((i, k) => { const j = jobById(i.jobId); const me = i.personId === "varun-sharma"; const p = personById(i.personId); return (
            <div key={k} className="grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12 md:gap-8">
              <div className="flex items-center gap-4 lg:col-span-5"><Avatar name={me ? j.client : p.name} tone={me ? j.clientTone : p.tone} size={48} square={me} /><div><div className="t-h3">Interview with {me ? j.client : p.name}</div><div className="text-small text-mute">{j.title}</div></div></div>
              <div className="lg:col-span-4"><div className="t-caption mb-1">When</div><div className="flex items-center gap-2 text-h3"><Clock className="h-4 w-4 text-mute" />{i.slot}</div></div>
              <div className="flex justify-end lg:col-span-3"><Button href={`/interview?with=${me ? "varun-sharma" : i.personId}`} icon={<Video className="h-4 w-4" />}>Join</Button></div>
            </div>); })}</div> : <Empty title="No interviews scheduled" sub="Invite someone from their profile or from a conversation." action={<Button href="/talent">Find talent</Button>} />)}
          {tab === "Saved" && (<div className="space-y-14">
            <section><div className="t-caption mb-5">Saved work · {saved.length}</div>{saved.length ? <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">{PROJECTS.filter((p) => saved.includes(p.id)).map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}</div> : <Empty title="Nothing saved yet" sub="Tap the bookmark on any project to keep it here." action={<Button href="/discover" variant="outline">Discover work</Button>} />}</section>
            <section><div className="t-caption mb-2">Saved briefs · {savedJobs.length}</div>{savedJobs.length ? <div className="border-b border-line">{JOBS.filter((j) => savedJobs.includes(j.id)).map((j, i) => <JobCard key={j.id} job={j} index={i} />)}</div> : <Empty title="No saved briefs" sub="Save opportunities to come back to them." />}</section>
          </div>)}
          {tab === "Completed" && (<div>
            <div className="mb-8 flex items-start gap-3 rounded-sm bg-sunk/70 p-5"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-hi" /><p className="max-w-2xl text-body"><span className="font-medium">Verified projects</span> were completed through {BRAND.name} and confirmed by the client. They carry a badge on your profile, so buyers know the work and the outcome are real.</p></div>
            <div className="border-b border-line">{mine.map((p) => { const on = visible[p.id] ?? true; return (
              <div key={p.id} className="grid items-center gap-5 border-t border-line py-6 lg:grid-cols-12 md:gap-8">
                <Link href={`/work/${p.id}`} data-cursor="View" className="lg:col-span-3"><div className="aspect-[4/3] overflow-hidden rounded-xs"><ProjectArt art={p.art} palette={p.palette} /></div></Link>
                <div className="lg:col-span-5"><Verified label={`Verified through ${BRAND.name}`} /><h3 className="t-h3 mt-3">{p.name} — {p.kind}</h3><div className="text-small text-mute">{p.client} · {p.duration} · {p.year}</div></div>
                <div className="flex items-center justify-between gap-4 lg:col-span-4 lg:justify-end"><label className="flex cursor-pointer items-center gap-2.5 text-small"><button role="switch" aria-checked={on} onClick={() => { setVisible({ ...visible, [p.id]: !on }); toast(on ? "Hidden from your profile" : "Shown on your profile"); }} className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-ink" : "bg-line"}`}><span className={`absolute top-0.5 h-4 w-4 rounded-full bg-paper transition-all ${on ? "left-[18px]" : "left-0.5"}`} /></button>On profile</label><Button size="sm" variant="outline" href={`/work/${p.id}`}>View</Button></div>
              </div>); })}</div>
          </div>)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
