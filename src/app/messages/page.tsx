"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarPlus, FileText, FolderPlus, Handshake as HandshakeIcon, Paperclip, Plus, Search, Send, Share2, Video } from "lucide-react";
import { contact, TEAM_REPLY } from "@/data/social";
import { PROJECTS, projectById } from "@/data/projects";
import { JOBS, jobById } from "@/data/jobs";
import { PEOPLE } from "@/data/people";
import { useApp } from "@/lib/store";
import type { Conversation, Message } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Misc";
import { Modal } from "@/components/ui/Modal";
import { Popover } from "@/components/ui/Dropdown";
import { ProjectArt } from "@/components/art/ProjectArt";

const REPLIES = ["That works for me. I’ll send over a short outline today.", "Thanks! Quick question: are we aiming to launch before the end of the month?", "Love it. Let me check with the team and come back to you within the hour.", "Perfect, that’s exactly what I had in mind."];
const SLOTS = ["Thu 8 Oct · 16:00", "Fri 9 Oct · 11:30", "Mon 12 Oct · 10:00", "Tue 13 Oct · 15:00"];

function Bubble({ m, who }: { m: Message; who: ReturnType<typeof contact> }) {
  const me = m.from === "me";
  if (m.kind === "system") return <div className="my-4 text-center text-small text-mute">{m.text}</div>;
  const base = me ? "bg-ink text-paper" : "border border-line bg-surface";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className={`flex items-end gap-2 ${me ? "justify-end" : ""}`}>
      {!me && <Avatar name={who.name} tone={who.tone} size={28} />}
      <div className={`max-w-[82%] md:max-w-[68%] ${me ? "items-end" : ""} flex flex-col gap-1`}>
        {m.kind === "project" && m.projectId && (() => { const p = projectById(m.projectId); return (
          <Link href={`/work/${p.id}`} className="group block w-64 overflow-hidden rounded-sm border border-line bg-surface text-ink"><div className="aspect-[16/10] overflow-hidden"><div className="h-full w-full transition-transform duration-700 group-hover:scale-105"><ProjectArt art={p.art} palette={p.palette} /></div></div><div className="p-3"><div className="text-small font-medium">{p.name} — {p.kind}</div><div className="text-[12px] text-mute">View case study</div></div></Link>
        ); })()}
        {m.kind === "file" && m.file && <div className="flex w-64 items-center gap-3 rounded-md border border-line bg-surface px-3 py-3 text-ink"><span className="flex h-9 w-9 items-center justify-center rounded-xs bg-sunk"><FileText className="h-4 w-4" /></span><div className="min-w-0"><div className="truncate text-small font-medium">{m.file.name}</div><div className="text-[12px] text-mute">{m.file.size}</div></div></div>}
        {m.kind === "interview" && <div className="w-64 rounded-md border border-line bg-surface p-4 text-ink"><div className="mb-2 flex items-center gap-2 text-small font-medium"><Video className="h-4 w-4 text-hi" />Interview invitation</div><div className="text-body font-medium">{m.text}</div><div className="mb-3 text-small text-mute">30 minutes · Video call</div><Button size="sm" full href="/interview">Join when it’s time</Button></div>}
        {m.text && m.kind !== "interview" && m.kind !== "file" && <div className={`rounded-sm px-3.5 py-2.5 text-body ${base}`}>{m.text}</div>}
        <span className="px-1 text-[11px] text-faint">{m.at}</span>
      </div>
    </motion.div>
  );
}

function Inner() {
  const sp = useSearchParams();
  const { convos, send, receive, markRead, toast, scheduleInterview, createProject, hire, workspaces } = useApp();
  const [activeId, setActiveId] = useState<string | null>(sp.get("c"));
  const [mobileThread, setMobileThread] = useState(!!sp.get("c"));
  const [q, setQ] = useState(""); const [draft, setDraft] = useState(""); const [typing, setTyping] = useState(false);
  const [modal, setModal] = useState<null | "share" | "interview" | "project" | "hire">(null);
  const [slot, setSlot] = useState(SLOTS[0]); const [shareId, setShareId] = useState("finora"); const [projName, setProjName] = useState(""); const [price, setPrice] = useState("3,500");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!activeId && window.matchMedia("(min-width: 768px)").matches) setActiveId(convos[0]?.id ?? null); }, [activeId, convos]);
  const convo = convos.find((c) => c.id === activeId);
  const who = convo ? contact(convo.with) : null;
  useEffect(() => { if (convo) markRead(convo.id); /* eslint-disable-next-line */ }, [activeId]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [convo?.thread.length, typing, activeId]);

  const list = useMemo(() => convos.filter((c) => !q || (contact(c.with).name + c.topic).toLowerCase().includes(q.toLowerCase())), [convos, q]);
  const linkedWorkspace = workspaces.find((w) => w.withId === convo?.with);
  const job = convo?.context ? JOBS.find((j) => j.id === convo.context) : null;
  const ctxProject = convo?.context && PROJECTS.find((p) => p.id === convo.context);

  const reply = (c: Conversation) => { setTyping(true); setTimeout(() => { setTyping(false); receive(c.id, { kind: "text", text: c.with === "makvo" ? TEAM_REPLY : REPLIES[Math.floor(Math.random() * REPLIES.length)] }); }, 1700); };
  const submit = (e?: React.FormEvent) => { e?.preventDefault(); if (!draft.trim() || !convo) return; send(convo.id, { kind: "text", text: draft.trim() }); setDraft(""); reply(convo); };
  const open = (id: string) => { setActiveId(id); setMobileThread(true); };

  const doShare = () => { if (!convo) return; send(convo.id, { kind: "project", projectId: shareId, text: "Sharing this for reference" }); setModal(null); toast("Project shared in the conversation"); };
  const doInterview = () => { if (!convo) return; send(convo.id, { kind: "interview", text: slot }); scheduleInterview({ personId: convo.with, jobId: convo.context ?? "saas-website-redesign", slot }); setModal(null); toast("Interview invitation sent"); };
  const doProject = () => { if (!convo) return; const name = projName || convo.topic; const id = createProject(name, convo.with); send(convo.id, { kind: "system", text: `Project “${name}” created. Workspace is ready.` }); setModal(null); toast("Project workspace created"); void id; };
  const doHire = () => { if (!convo || !who) return; const name = convo.topic; hire(name, convo.with); send(convo.id, { kind: "system", text: `${who.name} hired for “${name}” · $${price}. Workspace is ready.` }); setModal(null); toast(`${who.name.split(" ")[0]} hired. Workspace created`); };

  // The MAKVO team thread is support, not a deal: no interview, project or hire actions there.
  const isTeam = convo?.with === "makvo";
  const actions = isTeam ? [] : [
    { l: "Create Project", i: FolderPlus, f: () => { setProjName(convo?.topic ?? ""); setModal("project"); } },
    { l: "Invite to Interview", i: CalendarPlus, f: () => setModal("interview") },
    { l: "Share Work", i: Share2, f: () => setModal("share") },
    { l: "Hire", i: HandshakeIcon, f: () => setModal("hire") },
  ];

  return (
    <div className="mx-auto grid h-[calc(100dvh-3.5rem-4.2rem)] max-w-[1500px] md:h-[calc(100dvh-4rem)] md:grid-cols-[320px_1fr] xl:grid-cols-[340px_1fr_320px]">
      {/* LIST */}
      <section className={`min-h-0 flex-col border-r border-line ${mobileThread ? "hidden md:flex" : "flex"}`}>
        <div className="px-5 pb-3 pt-5"><h1 className="t-h2 mb-4">Messages</h1><div className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 focus-within:border-ink"><Search className="h-4 w-4 text-mute" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="flex-1 bg-transparent text-small outline-none placeholder:text-faint" /></div></div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {list.map((c) => { const k = contact(c.with); const on = c.id === activeId; return (
            <li key={c.id}><button onClick={() => open(c.id)} className={`relative flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${on ? "bg-sunk/80" : "hover:bg-sunk/50"}`}>
              {on && <motion.span layoutId="msg-active" className="absolute inset-y-0 left-0 w-0.5 bg-ink" />}
              <Avatar name={k.name} tone={k.tone} size={44} status="online" />
              <div className="min-w-0 flex-1"><div className="flex items-baseline justify-between gap-2"><span className={`truncate text-body ${c.unread ? "font-semibold" : "font-medium"}`}>{k.name}</span><span className="shrink-0 text-[11px] text-faint">{c.at}</span></div><div className="truncate text-[12px] text-mute">{c.topic}</div><div className={`mt-0.5 truncate text-small ${c.unread ? "text-ink" : "text-mute"}`}>{c.last}</div></div>
              {c.unread > 0 && <span className="mt-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-midnight">{c.unread}</span>}
            </button></li>
          ); })}
          {list.length === 0 && <li className="p-8 text-center text-small text-mute">No conversations match.</li>}
        </ul>
      </section>

      {/* THREAD */}
      {convo && who && (
        <section className={`${mobileThread ? "fixed inset-0 z-[60] flex bg-paper md:static md:z-auto" : "hidden md:flex"} min-h-0 flex-col md:border-r md:border-line`}>
          <header className="flex items-center gap-3 border-b border-line px-4 py-3 md:px-6 md:py-4">
            <button className="-ml-1 rounded-full p-2 hover:bg-sunk md:hidden" onClick={() => setMobileThread(false)} aria-label="Back"><ArrowLeft className="h-5 w-5" /></button>
            <Avatar name={who.name} tone={who.tone} size={40} status="online" />
            <div className="min-w-0 flex-1"><div className="truncate text-body font-medium">{who.name}</div><div className="truncate text-small text-mute">{convo.topic}</div></div>
            {who.href && <Button size="sm" variant="outline" href={who.href} className="hidden sm:inline-flex">Profile</Button>}
            {!isTeam && <Button size="sm" variant="outline" icon={<Video className="h-3.5 w-3.5" />} href={PEOPLE.some((p) => p.id === convo.with) ? `/interview?with=${convo.with}` : "/interview"}>Interview</Button>}
          </header>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-6">
            <div className="mb-2 text-center text-[11px] uppercase tracking-wider text-faint">Today</div>
            {convo.thread.map((m, i) => <Bubble key={i} m={m} who={who} />)}
            {typing && <div className="flex items-end gap-2"><Avatar name={who.name} tone={who.tone} size={28} /><div className="flex gap-1 rounded-md border border-line bg-surface px-3.5 py-3">{[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-faint" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }} />)}</div></div>}
            <div ref={end} />
          </div>
          <div className="border-t border-line bg-paper p-3 md:p-4">
            {actions.length > 0 && <div className="no-scrollbar mb-3 hidden gap-2 overflow-x-auto md:flex">{actions.map((a) => <button key={a.l} onClick={a.f} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-small transition hover:border-ink"><a.i className="h-3.5 w-3.5" />{a.l}</button>)}</div>}
            <form onSubmit={submit} className="flex items-end gap-2">
              {actions.length > 0 && <div className="md:hidden"><Popover width="w-56" trigger={({ toggle }) => <button type="button" onClick={toggle} aria-label="Actions" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface"><Plus className="h-5 w-5" /></button>}>{(close) => <div className="p-1.5">{actions.map((a) => <button type="button" key={a.l} onClick={() => { a.f(); close(); }} className="flex w-full items-center gap-3 rounded-xs px-3 py-3 text-left text-body hover:bg-sunk"><a.i className="h-4 w-4" />{a.l}</button>)}</div>}</Popover></div>}
              <div className="flex min-h-11 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 focus-within:border-ink"><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`Message ${who.name.split(" ")[0]}`} className="h-11 flex-1 bg-transparent text-body outline-none placeholder:text-faint" /><button type="button" aria-label="Attach file" onClick={() => { send(convo.id, { kind: "file", file: { name: "brief-v2.pdf", size: "1.8 MB" } }); toast("File attached"); }} className="text-mute hover:text-ink"><Paperclip className="h-4 w-4" /></button></div>
              <Button type="submit" disabled={!draft.trim()} className="h-11 w-11 !px-0" aria-label="Send"><Send className="h-4 w-4" /></Button>
            </form>
          </div>
        </section>
      )}

      {/* CONTEXT */}
      {convo && who && (
        <aside className="hidden min-h-0 overflow-y-auto p-6 xl:block">
          <div className="text-center"><div className="mx-auto w-fit"><Avatar name={who.name} tone={who.tone} size={72} /></div><div className="mt-3 text-h3">{who.name}</div><div className="text-small text-mute">{who.role}</div>{who.href && <Button size="sm" variant="outline" className="mt-4" href={who.href}>View profile</Button>}</div>
          {!isTeam && <div className="mt-8 border-t border-line pt-6"><div className="t-caption mb-3">Linked project</div>
            {linkedWorkspace ? <Link href={`/projects/${linkedWorkspace.id}`} className="block rounded-md border border-line bg-surface p-4 transition hover:border-ink"><div className="text-body font-medium">{linkedWorkspace.name}</div><div className="text-small text-mute">Workspace · Open</div></Link>
              : convo.id === "c1" ? <Link href="/projects/finora-website" className="block rounded-md border border-line bg-surface p-4 transition hover:border-ink"><div className="text-body font-medium">Finora Website</div><div className="mt-1 text-small text-mute">In progress · 68%</div><div className="mt-3 h-1 overflow-hidden rounded-full bg-sunk"><div className="h-full w-[68%] bg-ink" /></div></Link>
              : job ? <Link href={`/opportunities/${job.id}`} className="block rounded-md border border-line bg-surface p-4 transition hover:border-ink"><div className="text-body font-medium">{job.title}</div><div className="text-small text-mute">{job.client} · Opportunity</div></Link>
              : ctxProject ? null : <p className="text-small text-mute">Nothing linked yet. Create a project from this conversation.</p>}
            {!linkedWorkspace && convo.id !== "c1" && <Button size="sm" variant="outline" className="mt-3" icon={<FolderPlus className="h-3.5 w-3.5" />} onClick={() => { setProjName(convo.topic); setModal("project"); }}>Create project</Button>}
          </div>}
          <div className="mt-8 border-t border-line pt-6"><div className="t-caption mb-3">Shared in this chat</div>
            <ul className="space-y-2.5 text-small">{convo.thread.filter((m) => m.kind === "file" || m.kind === "project").map((m, i) => <li key={i} className="flex items-center gap-2.5"><FileText className="h-4 w-4 text-mute" />{m.file?.name ?? projectById(m.projectId!).name + " case study"}</li>)}{!convo.thread.some((m) => m.kind === "file" || m.kind === "project") && <li className="text-mute">Files and projects you share will show up here.</li>}</ul></div>
        </aside>
      )}

      {/* MODALS */}
      <Modal open={modal === "share"} onClose={() => setModal(null)} title="Share work" width="max-w-xl"><div className="p-6 md:p-8"><h2 className="t-h2">Share work</h2><p className="mt-2 text-small text-mute">Send a project as a reference. They’ll see the full case study.</p><div className="mt-5 grid max-h-[50dvh] grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">{PROJECTS.map((p) => <button key={p.id} onClick={() => setShareId(p.id)} className={`overflow-hidden rounded-xs text-left ring-2 transition ${shareId === p.id ? "ring-ink" : "ring-transparent hover:ring-line"}`}><div className="aspect-[4/3]"><ProjectArt art={p.art} palette={p.palette} /></div><div className="bg-surface px-2 py-1.5 text-small font-medium">{p.name}</div></button>)}</div><div className="mt-6 flex justify-end"><Button onClick={doShare}>Share project</Button></div></div></Modal>
      <Modal open={modal === "interview"} onClose={() => setModal(null)} title="Invite to interview" width="max-w-lg"><div className="p-6 md:p-8"><h2 className="t-h2">Invite to interview</h2><p className="mt-2 text-small text-mute">30 minutes on video. Pick a time that works for you, and they’ll confirm.</p><div className="mt-5 flex flex-wrap gap-2">{SLOTS.map((s) => <Chip key={s} active={slot === s} onClick={() => setSlot(s)}>{s}</Chip>)}</div><div className="mt-6 flex justify-end"><Button onClick={doInterview} icon={<Video className="h-4 w-4" />}>Send invitation</Button></div></div></Modal>
      <Modal open={modal === "project"} onClose={() => setModal(null)} title="Create project" width="max-w-lg"><div className="p-6 md:p-8"><h2 className="t-h2">Create a project</h2><p className="mt-2 text-small text-mute">Opens a shared workspace with tasks, files, meetings, milestones and payments.</p><label className="mt-5 block"><span className="t-caption mb-2 block">Project name</span><input value={projName} onChange={(e) => setProjName(e.target.value)} className="field" /></label><div className="mt-6 flex justify-end"><Button onClick={doProject}>Create workspace</Button></div></div></Modal>
      <Modal open={modal === "hire"} onClose={() => setModal(null)} title="Hire" width="max-w-lg"><div className="p-6 md:p-8">{who && <><div className="flex items-center gap-3"><Avatar name={who.name} tone={who.tone} size={48} /><div><div className="text-small text-mute">Hire</div><div className="text-h3">{who.name}</div></div></div><dl className="mt-6 divide-y divide-line border-y border-line text-body"><div className="flex justify-between py-3"><dt className="text-mute">Project</dt><dd className="font-medium">{convo?.topic}</dd></div><div className="flex items-center justify-between py-3"><dt className="text-mute">Agreed price</dt><dd className="flex items-center gap-1 font-medium">$<input value={price} onChange={(e) => setPrice(e.target.value)} className="w-20 border-b border-line bg-transparent text-right outline-none focus:border-ink" /></dd></div><div className="flex justify-between py-3"><dt className="text-mute">Start</dt><dd className="font-medium">Monday</dd></div></dl><p className="mt-4 text-small text-mute">Payment is held in milestones and released as work is approved. (Mock only in this prototype.)</p><div className="mt-6 flex justify-end"><Button onClick={doHire} variant="accent">Confirm hire</Button></div></>}</div></Modal>
    </div>
  );
}
export default function Messages() { return <Suspense><Inner /></Suspense>; }
