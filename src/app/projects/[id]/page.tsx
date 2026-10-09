"use client";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, Check, CircleDashed, FileText, FolderOpen, Figma, GitBranch, Layers, Plus, Send, Video } from "lucide-react";
import { useApp } from "@/lib/store";
import { getWorkspace } from "@/lib/workspace";
import { contact } from "@/data/social";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Misc";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";
import { BRAND } from "@/lib/brand";

const TABS = ["Overview", "Tasks", "Files", "Messages", "Meetings", "Milestones", "Payments"] as const;
const FILE_ICON = { figma: Figma, system: Layers, folder: FolderOpen, repo: GitBranch } as const;

function Ring({ value, size = 140 }: { value: number; size?: number }) {
  const r = size / 2 - 8, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90"><defs><linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#DBE64C" /><stop offset=".55" stopColor="#74C365" /><stop offset="1" stopColor="#00804C" /></linearGradient></defs><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(var(--sunk))" strokeWidth="8" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ring-g)" strokeWidth="8" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - value / 100) }} transition={{ duration: 1.3, ease: [0.2, 0.7, 0.2, 1] }} /></svg>
  );
}

export default function Workspace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { workspaces, toast, tasks: taskState, cycleTask } = useApp();
  const base = useMemo(() => getWorkspace(id, workspaces), [id, workspaces]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [chat, setChat] = useState(base?.messages ?? []);
  const [draft, setDraft] = useState("");
  const [files, setFiles] = useState(base?.files ?? []);
  const [meetings, setMeetings] = useState(base?.meetings ?? []);
  const [verify, setVerify] = useState<"idle" | "open" | "done">("idle");
  const [localTasks, setLocalTasks] = useState<Record<string, "done" | "progress" | "upcoming">>({});
  const router = useRouter();
  if (!base) return notFound();
  const isSeed = id === "finora-website";
  const ws = base;
  const st = (tid: string, d: "done" | "progress" | "upcoming") => (isSeed ? taskState[tid] ?? d : localTasks[tid] ?? d);
  const cycle = (tid: string, cur: string) => { if (isSeed) cycleTask(tid); else setLocalTasks({ ...localTasks, [tid]: cur === "upcoming" ? "progress" : cur === "progress" ? "done" : "upcoming" }); };
  const doneCount = ws.tasks.filter((t) => st(t.id, t.state) === "done").length;
  const people = ws.members.map((m) => ({ ...m, c: contact(m.id) }));
  const total = ws.milestones.reduce((a, m) => a + m.amount, 0);
  const paid = ws.milestones.filter((m) => m.pct === 100).reduce((a, m) => a + m.amount, 0);
  const escrow = ws.milestones.filter((m) => m.pct > 0 && m.pct < 100).reduce((a, m) => a + m.amount, 0);

  const sendMsg = (e: React.FormEvent) => { e.preventDefault(); if (!draft.trim()) return; setChat([...chat, { from: "varun-sharma", text: draft, at: "Now" }]); setDraft(""); };
  const next = ws.milestones.find((m) => m.pct < 100);

  return (
    <div className="container-x pt-8 md:pt-12">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-small text-mute hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />Your projects</Link>
      <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-3"><Badge tone="accent"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-hi" />{ws.status}</Badge><span className="text-small text-mute">Deadline {ws.deadline}</span></div>
          <h1 className="t-h1">{ws.name}</h1>
          <div className="mt-5 flex items-center gap-3"><AvatarStack people={people.map((p) => p.c)} size={34} /><span className="text-small text-mute">{people.map((p) => p.c.name.split(" ")[0]).join(" · ")}</span></div>
        </div>
        <div className="flex gap-2"><Button variant="outline" icon={<Video className="h-4 w-4" />} href="/interview?with=rahul-mehta">Start call</Button><Button onClick={() => setVerify("open")} icon={<BadgeCheck className="h-4 w-4" />}>Complete &amp; verify</Button></div>
      </div>

      <Tabs id="ws" tabs={TABS} value={tab} onChange={setTab} className="mt-10" />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="pt-10">
          {tab === "Overview" && (
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
                  <div className="relative flex items-center gap-5 bg-paper p-6 sm:col-span-1"><div className="relative"><Ring value={ws.progress} size={96} /><div className="absolute inset-0 flex items-center justify-center t-h3 tabular-nums"><Counter to={ws.progress} suffix="%" /></div></div><div><div className="t-caption">Progress</div><div className="text-small text-mute">{doneCount} of {ws.tasks.length} tasks done</div></div></div>
                  <div className="bg-paper p-6"><div className="t-caption mb-3">Deadline</div><div className="t-h2">{ws.deadline}</div><div className="mt-1 text-small text-mute">On track</div></div>
                  <div className="bg-paper p-6"><div className="t-caption mb-3">Next milestone</div><div className="t-h3">{next?.name ?? "Done"}</div><div className="mt-1 text-small text-mute">{next ? `${next.pct}% · $${next.amount.toLocaleString()}` : ""}</div></div>
                </div>
                <h2 className="t-h3 mb-4 mt-12">Recent activity</h2>
                <ul className="border-b border-line">{ws.activity.map((a, i) => { const c = contact(a.who); return <li key={i} className="flex items-center gap-3 border-t border-line py-4"><Avatar name={c.name} tone={c.tone} size={32} /><span className="flex-1 text-body"><span className="font-medium">{c.name.split(" ")[0]}</span> {a.what}</span><span className="text-small text-mute">{a.when}</span></li>; })}</ul>
              </div>
              <aside className="space-y-10 lg:col-span-4">
                <div><div className="t-caption mb-4">Team</div><ul className="space-y-4">{people.map((m) => <li key={m.id}><Link href={m.c.href ?? "#"} className="flex items-center gap-3"><Avatar name={m.c.name} tone={m.c.tone} size={40} status="online" /><div><div className="text-body font-medium">{m.c.name}</div><div className="text-small text-mute">{m.role}</div></div></Link></li>)}</ul></div>
                <div><div className="t-caption mb-4">Up next</div>{meetings[0] && <div className="rounded-md border border-line bg-surface p-4"><div className="text-body font-medium">{meetings[0].title}</div><div className="text-small text-mute">{meetings[0].when} · {meetings[0].length}</div></div>}</div>
              </aside>
            </div>
          )}

          {tab === "Tasks" && (
            <div className="max-w-3xl"><div className="mb-6 flex items-end justify-between"><h2 className="t-h2">Tasks</h2><span className="text-small text-mute">{doneCount}/{ws.tasks.length} complete</span></div>
              <ul className="border-b border-line">{ws.tasks.map((t) => { const s = st(t.id, t.state); const c = contact(t.owner); return (
                <li key={t.id} className="flex items-center gap-4 border-t border-line py-5">
                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => cycle(t.id, s)} aria-label={`Change status of ${t.title}`} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${s === "done" ? "border-ink bg-ink text-paper" : s === "progress" ? "border-forest" : "border-line"}`}>{s === "done" && <Check className="h-3.5 w-3.5" strokeWidth={3} />}{s === "progress" && <span className="h-2 w-2 rounded-full bg-hi" />}</motion.button>
                  <div className="min-w-0 flex-1"><div className={`text-body font-medium transition ${s === "done" ? "text-mute line-through" : ""}`}>{t.title}</div><div className="text-small text-mute">{c.name.split(" ")[0]} · Due {t.due}</div></div>
                  <Badge tone={s === "done" ? "ok" : s === "progress" ? "accent" : "outline"}>{s === "done" ? "Done" : s === "progress" ? "In progress" : "Upcoming"}</Badge>
                </li>); })}</ul>
              <p className="mt-4 text-small text-mute">Tap the circle to move a task forward.</p></div>
          )}

          {tab === "Files" && (
            <div><div className="mb-6 flex items-end justify-between"><h2 className="t-h2">Files</h2><Button variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => { setFiles([...files, { name: "Meeting notes.pdf", sub: "Uploaded just now", kind: "folder", size: "240 KB", by: "You" }]); toast("File uploaded"); }}>Upload</Button></div>
              <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">{files.map((f) => { const I = FILE_ICON[f.kind as keyof typeof FILE_ICON] ?? FileText; return (
                <button key={f.name} onClick={() => toast(`Opening ${f.name}`)} className="group flex items-center gap-5 bg-paper p-6 text-left transition hover:bg-surface"><span className="flex h-14 w-14 items-center justify-center rounded-sm bg-sunk transition group-hover:bg-ink group-hover:text-paper"><I className="h-6 w-6" strokeWidth={1.5} /></span><div className="min-w-0 flex-1"><div className="t-h3">{f.name}</div><div className="truncate text-small text-mute">{f.sub}</div><div className="mt-1 text-[12px] text-faint">{f.size} · {f.by}</div></div></button>); })}</div></div>
          )}

          {tab === "Messages" && (
            <div className="mx-auto flex max-w-2xl flex-col"><div className="space-y-4">{chat.map((m, i) => { const c = contact(m.from); const me = m.from === "varun-sharma"; return <div key={i} className={`flex items-end gap-2 ${me ? "justify-end" : ""}`}>{!me && <Avatar name={c.name} tone={c.tone} size={28} />}<div className="max-w-[80%]"><div className={`rounded-sm px-3.5 py-2.5 text-body ${me ? "bg-ink text-paper" : "border border-line bg-surface"}`}>{m.text}</div><div className="mt-1 px-1 text-[11px] text-faint">{c.name.split(" ")[0]} · {m.at}</div></div></div>; })}</div>
              <form onSubmit={sendMsg} className="mt-8 flex gap-2"><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Message the project team" className="field" /><Button type="submit" aria-label="Send" disabled={!draft.trim()}><Send className="h-4 w-4" /></Button></form></div>
          )}

          {tab === "Meetings" && (
            <div className="max-w-3xl"><div className="mb-6 flex items-end justify-between"><h2 className="t-h2">Meetings</h2><Button variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => { setMeetings([...meetings, { title: "Design review", when: "Wed 14 Oct · 14:00", length: "30 min", with: "Everyone" }]); toast("Meeting scheduled for everyone"); }}>Schedule</Button></div>
              <ul className="border-b border-line">{meetings.map((m, i) => <li key={i} className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6"><div><div className="t-h3">{m.title}</div><div className="text-small text-mute">{m.when} · {m.length} · {m.with}</div></div><Button size="sm" variant={i === 0 ? "primary" : "outline"} icon={<Video className="h-3.5 w-3.5" />} href="/interview?with=rahul-mehta">{i === 0 ? "Join" : "Details"}</Button></li>)}</ul></div>
          )}

          {tab === "Milestones" && (
            <div className="max-w-3xl"><h2 className="t-h2 mb-8">Milestones</h2>
              <ol className="relative ml-3 border-l border-line">{ws.milestones.map((m) => (
                <li key={m.name} className="relative pb-10 pl-8 last:pb-0"><span className={`absolute -left-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full ${m.pct === 100 ? "bg-ink text-paper" : m.pct > 0 ? "border-2 border-forest bg-paper" : "border border-line bg-paper text-faint"}`}>{m.pct === 100 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : m.pct > 0 ? <span className="h-2 w-2 rounded-full bg-hi" /> : <CircleDashed className="h-3.5 w-3.5" />}</span>
                  <div className="flex items-baseline justify-between gap-4"><h3 className="t-h3">{m.name}</h3><span className="text-small tabular-nums text-mute">${m.amount.toLocaleString()}</span></div>
                  <div className="mt-1 text-small text-mute">{m.state}{m.pct > 0 && m.pct < 100 ? ` · ${m.pct}%` : ""}</div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-sunk"><motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: 0.9 }} className={`h-full rounded-full ${m.pct === 100 ? "bg-ink" : "grad-spring"}`} /></div></li>))}</ol></div>
          )}

          {tab === "Payments" && (
            <div className="max-w-3xl"><h2 className="t-h2 mb-8">Payments</h2>
              <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">{[["Project total", total], ["Paid", paid], ["Held in escrow", escrow]].map(([l, v]) => <div key={l as string} className="bg-paper p-6"><div className="t-caption mb-3">{l as string}</div><div className="t-h2 tabular-nums">$<Counter to={v as number} /></div></div>)}</div>
              <ul className="mt-8 border-b border-line">{ws.milestones.map((m) => <li key={m.name} className="flex items-center justify-between gap-4 border-t border-line py-5"><div><div className="text-body font-medium">{m.name}</div><div className="text-small text-mute">{m.pct === 100 ? "Released" : m.pct > 0 ? "Held in escrow" : "Not funded yet"}</div></div><div className="flex items-center gap-4"><span className="text-h3 tabular-nums">${m.amount.toLocaleString()}</span>{m.pct === 100 ? <Badge tone="ok">Paid</Badge> : m.pct > 0 ? <Button size="sm" variant="outline" onClick={() => toast("Payment is released when the client approves")}>Request release</Button> : <Button size="sm" variant="ghost" onClick={() => toast("Funding is simulated in this prototype")}>Fund</Button>}</div></li>)}</ul>
              <p className="mt-4 text-small text-mute">Payments are mocked in this prototype. In production, funds are held by a payments partner and released on approval.</p></div>
          )}
        </motion.div>
      </AnimatePresence>

      <Modal open={verify !== "idle"} onClose={() => setVerify("idle")} title="Complete and verify" width="max-w-lg">
        <div className="p-8 text-center md:p-10">
          {verify === "open" ? (<>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-spring text-midnight"><BadgeCheck className="h-7 w-7" /></div>
            <h2 className="t-h2">Turn this into a verified project?</h2>
            <p className="mx-auto mt-3 max-w-sm text-body text-mute">The client confirms the work, and {ws.name} appears on your profile with a <span className="font-medium text-ink">Verified project</span> badge: completed through {BRAND.name}.</p>
            <div className="mt-8 flex justify-center gap-2"><Button variant="outline" onClick={() => setVerify("idle")}>Not yet</Button><Button onClick={() => { setVerify("done"); toast("Verification request sent to the client"); }}>Request verification</Button></div>
          </>) : (<>
            <motion.div initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 12 }} className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-ok/10 text-ok"><BadgeCheck className="h-8 w-8" /></motion.div>
            <h2 className="t-h2">Request sent</h2>
            <p className="mx-auto mt-3 max-w-sm text-body text-mute">{ws.client} will get a short confirmation. Once approved, the badge goes live on your profile and case study.</p>
            <div className="mt-8 flex justify-center gap-2"><Button variant="outline" onClick={() => setVerify("idle")}>Close</Button><Button href="/projects" onClick={() => setVerify("idle")}>See verified projects</Button></div>
          </>)}
        </div>
      </Modal>
    </div>
  );
}
