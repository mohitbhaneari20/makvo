"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarCheck, Check, MessageSquare, Mic, MicOff, MonitorUp, NotebookPen, PhoneOff, Send, Video, VideoOff, X } from "lucide-react";
import { PEOPLE, personById } from "@/data/people";
import { JOBS, jobById } from "@/data/jobs";
import { PROJECTS } from "@/data/projects";
import { useApp, type Decision } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Chip, Stars } from "@/components/ui/Misc";
import { ProjectArt } from "@/components/art/ProjectArt";

const DAYS = [["Thu", "8 Oct"], ["Fri", "9 Oct"], ["Mon", "12 Oct"], ["Tue", "13 Oct"], ["Wed", "14 Oct"]];
const TIMES = ["10:00", "11:30", "14:00", "15:30", "16:00", "17:30"];
const BUSY = new Set(["10:00", "15:30"]);
const CAPTIONS = ["I’d start with the homepage hierarchy. Right now the product takes too long to explain.", "For a SaaS site like this, I usually design the pricing page early, because it exposes the real positioning.", "Rahul and I have worked together for three years, so handoff is fast and honest.", "I can share the Finora process document if that helps. It’s the closest to what you’re describing.", "Timeline-wise, four weeks is realistic if we agree the copy structure in week one."];
const CHAT_SEED = [{ me: false, t: "Hi! Thanks for making time today." }, { me: true, t: "Great to meet you. Excited to talk through the project." }];
type Phase = "schedule" | "scheduled" | "joining" | "call" | "feedback" | "decided";

function Inner() {
  const sp = useSearchParams();
  const withId = sp.get("with") && PEOPLE.some((p) => p.id === sp.get("with")) ? sp.get("with")! : "varun-sharma";
  const person = personById(withId);
  const { role, scheduleInterview, decide, decisions, hire, toast } = useApp();
  const meName = role === "client" ? "Amelia Brooks" : "You";
  const [phase, setPhase] = useState<Phase>("schedule");
  const [jobId, setJobId] = useState("saas-website-redesign");
  const [dur, setDur] = useState(30);
  const [day, setDay] = useState(0); const [time, setTime] = useState("16:00");
  const [agenda, setAgenda] = useState("");
  const job = jobById(jobId);
  const slotLabel = `${DAYS[day][0]} ${DAYS[day][1]} · ${time}`;

  const [muted, setMuted] = useState(false); const [cam, setCam] = useState(true); const [share, setShare] = useState(false);
  const [panel, setPanel] = useState<null | "chat" | "notes">(null);
  const [chat, setChat] = useState(CHAT_SEED); const [msg, setMsg] = useState(""); const [notes, setNotes] = useState("");
  const [secs, setSecs] = useState(0); const [cap, setCap] = useState(0);
  const [ratings, setRatings] = useState({ Communication: 5, "Relevant experience": 5, "Technical understanding": 4, "Project fit": 5 });
  const [fbNote, setFbNote] = useState("");
  const [outcome, setOutcome] = useState<Decision | null>(null);
  const [wsId, setWsId] = useState("");
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { if (phase !== "call") return; const t = setInterval(() => setSecs((s) => s + 1), 1000); const c = setInterval(() => setCap((x) => (x + 1) % CAPTIONS.length), 5200); return () => { clearInterval(t); clearInterval(c); }; }, [phase]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, panel]);
  useEffect(() => { document.body.style.overflow = phase === "call" ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [phase]);

  const mmss = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const schedule = () => { scheduleInterview({ personId: person.id, jobId, slot: slotLabel }); setPhase("scheduled"); toast(`Interview scheduled with ${person.name.split(" ")[0]}`); };
  const join = () => { setPhase("joining"); setSecs(0); setTimeout(() => setPhase("call"), 1800); };
  const sendChat = (e: React.FormEvent) => { e.preventDefault(); if (!msg.trim()) return; setChat((c) => [...c, { me: true, t: msg }]); setMsg(""); setTimeout(() => setChat((c) => [...c, { me: false, t: "Sure, sending that over right after the call." }]), 1500); };
  const avg = Object.values(ratings).reduce((a, b) => a + b, 0) / 4;

  const choose = (d: Decision) => {
    decide(person.id, d); setOutcome(d);
    if (d === "hire") setWsId(hire(job.title, person.id));
    setPhase("decided");
    toast({ hire: `${person.name.split(" ")[0]} hired`, second: "Second interview requested", shortlist: "Added to shortlist", reject: "Candidate declined politely" }[d]);
  };

  /* ---------- CALL ---------- */
  if (phase === "call") {
    const ctl = (on: boolean, danger = false) => `flex h-12 w-12 items-center justify-center rounded-full transition ${danger ? "bg-red-500 text-white hover:bg-red-600" : on ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`;
    return (
      <div className="fixed inset-0 z-[80] flex flex-col bg-[#00152B] text-white">
        <header className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="min-w-0"><div className="truncate text-small font-medium">Interview · {job.title}</div><div className="text-[12px] text-white/50">{job.client} · {dur} min</div></div>
          <div className="flex items-center gap-3 text-small tabular-nums"><span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1"><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-red-500" />{mmss}</span></div>
        </header>
        <div className="flex min-h-0 flex-1 gap-3 px-3 pb-3 md:px-6">
          <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg grad-midnight">
            {share ? (
              <div className="absolute inset-0 p-3 md:p-8"><div className="relative h-full overflow-hidden rounded-sm"><ProjectArt art="fintech" palette={PROJECTS[0].palette} /><div className="absolute left-3 top-3 rounded-full bg-spring px-3 py-1.5 text-small font-medium text-midnight">You’re sharing your screen</div></div></div>
            ) : (
              <>
                <div className="absolute inset-0 opacity-60" style={{ background: `radial-gradient(60% 60% at 50% 40%, ${person.tone}33, transparent 70%)` }} />
                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <motion.span className="absolute inset-0 rounded-full" style={{ background: person.tone }} animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }} transition={{ repeat: Infinity, duration: 2.4 }} />
                    <motion.span className="absolute inset-0 rounded-full" style={{ background: person.tone }} animate={{ scale: [1, 1.7, 1], opacity: [0.2, 0, 0.2] }} transition={{ repeat: Infinity, duration: 2.4, delay: 0.5 }} />
                    <span className="relative block"><Avatar name={person.name} tone={person.tone} size={140} /></span>
                  </div>
                </div>
              </>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-sm bg-black/55 px-3 py-1.5 text-small backdrop-blur"><span className="flex items-end gap-0.5">{[0, 1, 2].map((i) => <motion.span key={i} className="w-0.5 rounded-full bg-accent" animate={{ height: [4, 12, 5, 10, 4] }} transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }} />)}</span>{person.name}</div>
            <AnimatePresence mode="wait"><motion.div key={cap} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute inset-x-4 bottom-14 mx-auto max-w-xl rounded-sm bg-black/60 px-4 py-2.5 text-center text-small backdrop-blur md:bottom-16 md:text-body">{CAPTIONS[cap]}</motion.div></AnimatePresence>
            {/* self view */}
            <div className="absolute right-3 top-3 h-28 w-20 overflow-hidden rounded-sm border border-white/15 bg-[#0A2A4D] md:h-36 md:w-52">
              {cam ? <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1E488F] to-[#001F3F]"><Avatar name={role === "client" ? "Amelia Brooks" : "You"} tone="#CFD8E6" size={48} /></div> : <div className="flex h-full w-full items-center justify-center text-white/40"><VideoOff className="h-6 w-6" /></div>}
              <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-xs bg-black/60 px-1.5 py-0.5 text-[11px]">{muted && <MicOff className="h-2.5 w-2.5 text-red-400" />}{meName}</div>
            </div>
          </div>

          <AnimatePresence>
            {panel && (
              <motion.aside initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} className="absolute inset-x-3 bottom-24 top-16 z-10 flex flex-col overflow-hidden rounded-md bg-paper text-ink shadow-pop md:static md:inset-auto md:w-[340px] md:shrink-0">
                <div className="flex items-center justify-between border-b border-line px-4 py-3"><div className="text-body font-medium">{panel === "chat" ? "In-call chat" : "Private notes"}</div><button onClick={() => setPanel(null)} aria-label="Close panel" className="rounded-full p-1 hover:bg-sunk"><X className="h-4 w-4" /></button></div>
                {panel === "chat" ? (<>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">{chat.map((c, i) => <div key={i} className={`flex ${c.me ? "justify-end" : ""}`}><div className={`max-w-[85%] rounded-sm px-3 py-2 text-small ${c.me ? "bg-ink text-paper" : "bg-sunk"}`}>{c.t}</div></div>)}<div ref={chatEnd} /></div>
                  <form onSubmit={sendChat} className="flex gap-2 border-t border-line p-3"><input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message everyone" className="field !py-2 !text-small" /><Button type="submit" size="md" aria-label="Send"><Send className="h-4 w-4" /></Button></form>
                </>) : (<div className="flex flex-1 flex-col p-4"><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Only you can see these. Jot down what stands out." className="field flex-1 resize-none" /><p className="mt-2 text-[11px] text-mute">Notes carry into your feedback after the call.</p></div>)}
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
        <footer className="flex items-center justify-center gap-2 px-4 pb-5 pt-1 md:gap-3">
          <button onClick={() => setMuted((m) => !m)} className={ctl(!muted)} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted}>{muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}</button>
          <button onClick={() => setCam((c) => !c)} className={ctl(cam)} aria-label={cam ? "Turn camera off" : "Turn camera on"}>{cam ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}</button>
          <button onClick={() => { setShare((s) => !s); toast(share ? "Stopped sharing" : "Sharing your screen"); }} className={ctl(share)} aria-label="Share screen" aria-pressed={share}><MonitorUp className="h-5 w-5" /></button>
          <button onClick={() => setPanel(panel === "chat" ? null : "chat")} className={ctl(panel === "chat")} aria-label="Chat"><MessageSquare className="h-5 w-5" /></button>
          <button onClick={() => setPanel(panel === "notes" ? null : "notes")} className={`${ctl(panel === "notes")} hidden sm:flex`} aria-label="Notes"><NotebookPen className="h-5 w-5" /></button>
          <button onClick={() => { setPhase("feedback"); setPanel(null); setShare(false); }} className="ml-2 flex h-12 items-center gap-2 rounded-full bg-red-500 px-5 text-small font-medium text-white transition hover:bg-red-600"><PhoneOff className="h-5 w-5" /><span className="hidden sm:inline">Leave call</span></button>
        </footer>
      </div>
    );
  }

  /* ---------- JOINING ---------- */
  if (phase === "joining") {
    return (
      <div className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-[#00152B] px-6 text-center text-white">
        <Avatar name={person.name} tone={person.tone} size={96} />
        <h1 className="mt-6 text-h2">Joining with {person.name.split(" ")[0]}…</h1>
        <p className="mt-2 text-small text-white/60">Checking camera and microphone</p>
        <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-accent" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.7, ease: "easeInOut" }} /></div>
      </div>
    );
  }

  /* ---------- SCHEDULE / FEEDBACK ---------- */
  return (
    <div className="container-x min-h-[calc(100dvh-4rem)] pb-28 pt-10 md:pb-16 md:pt-16">
      <AnimatePresence mode="wait" initial={false}>
        {(phase === "schedule" || phase === "scheduled") && (
          <motion.div key="s" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="t-caption mb-3">Interview</div>
              <h1 className="t-h1">Interview with {person.name}</h1>
              <div className="mt-6 flex items-center gap-3"><Avatar name={person.name} tone={person.tone} size={48} /><div className="text-body"><Link href={`/people/${person.id}`} className="font-medium hover:underline">{person.name}</Link><div className="text-small text-mute">{person.role} · {person.location.split(",")[0]}</div></div></div>

              {phase === "schedule" ? (
                <div className="mt-10 space-y-9">
                  <div><div className="t-caption mb-3">Project</div><div className="grid gap-2">{JOBS.slice(0, 3).map((j) => <button key={j.id} onClick={() => setJobId(j.id)} className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left transition ${jobId === j.id ? "border-ink bg-surface" : "border-line hover:border-ink/50"}`}><span><span className="block text-body font-medium">{j.title}</span><span className="text-small text-mute">{j.client}</span></span>{jobId === j.id && <Check className="h-4 w-4" />}</button>)}</div></div>
                  <div><div className="t-caption mb-3">Duration</div><div className="flex gap-2">{[15, 30, 45, 60].map((d) => <Chip key={d} active={dur === d} onClick={() => setDur(d)}>{d} min</Chip>)}</div></div>
                  <div><div className="t-caption mb-3">Date</div><div className="no-scrollbar flex gap-2 overflow-x-auto">{DAYS.map(([d, n], i) => <button key={n} onClick={() => setDay(i)} className={`flex w-[72px] shrink-0 flex-col items-center rounded-sm border py-3 transition ${day === i ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink"}`}><span className="text-small opacity-70">{d}</span><span className="text-body font-medium">{n.split(" ")[0]}</span><span className="text-[11px] opacity-70">{n.split(" ")[1]}</span></button>)}</div>
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{TIMES.map((t) => { const off = BUSY.has(t) && day % 2 === 0; return <button key={t} disabled={off} onClick={() => setTime(t)} className={`rounded-sm border py-2.5 text-small tabular-nums transition ${off ? "cursor-not-allowed border-transparent bg-sunk text-faint line-through" : time === t ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink"}`}>{t}</button>; })}</div>
                    <div className="mt-2 text-small text-mute">Times shown in your timezone. {person.name.split(" ")[0]} is in {person.tz}.</div></div>
                  <label className="block"><div className="t-caption mb-3">What would you like to cover? (optional)</div><textarea rows={3} value={agenda} onChange={(e) => setAgenda(e.target.value)} className="field resize-none" placeholder="Process, timeline, similar projects…" /></label>
                  <div className="flex flex-col gap-3 sm:flex-row"><Button size="lg" onClick={schedule} icon={<CalendarCheck className="h-4 w-4" />}>Schedule interview</Button><Button size="lg" variant="outline" onClick={join} icon={<Video className="h-4 w-4" />}>Start interview now</Button></div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                  <div className="rounded-md border border-line bg-surface p-6"><div className="mb-4 flex items-center gap-2 text-body font-medium text-ok"><CalendarCheck className="h-5 w-5" />Interview scheduled</div><div className="t-h2">{slotLabel}</div><div className="mt-1 text-body text-mute">{dur} minutes · {job.title} · {job.client}</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button size="lg" variant="accent" onClick={join} icon={<Video className="h-4 w-4" />}>Start Interview</Button><Button size="lg" variant="outline" onClick={() => setPhase("schedule")}>Reschedule</Button></div></div>
                  <p className="mt-4 text-small text-mute">For the prototype, you can start the call right away. In the full product it opens at the scheduled time and both people get a reminder.</p>
                </motion.div>
              )}
            </div>
            <aside className="lg:col-span-5"><div className="sticky top-24 rounded-sm bg-sunk/70 p-6"><div className="t-caption mb-4">Summary</div><dl className="space-y-3 text-body"><div className="flex justify-between"><dt className="text-mute">With</dt><dd className="font-medium">{person.name}</dd></div><div className="flex justify-between"><dt className="text-mute">Project</dt><dd className="text-right font-medium">{job.title}</dd></div><div className="flex justify-between"><dt className="text-mute">Duration</dt><dd className="font-medium">{dur} minutes</dd></div><div className="flex justify-between"><dt className="text-mute">When</dt><dd className="font-medium">{slotLabel}</dd></div></dl>
              <div className="mt-6 border-t border-line pt-5"><div className="t-caption mb-3">Worth looking at first</div><div className="grid grid-cols-2 gap-3">{person.projects.slice(0, 2).map((id) => { const p = PROJECTS.find((x) => x.id === id)!; return <Link key={id} href={`/work/${id}`}><div className="aspect-[4/3] overflow-hidden rounded-xs"><ProjectArt art={p.art} palette={p.palette} /></div><div className="mt-1 text-small font-medium">{p.name}</div></Link>; })}</div></div></div></aside>
          </motion.div>
        )}

        {phase === "feedback" && (
          <motion.div key="f" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-3xl">
            <div className="t-caption mb-3">Call ended · {mmss}</div>
            <h1 className="t-h1">Interview feedback</h1>
            <p className="mt-3 text-body text-mute">Only you see this. It helps compare candidates side by side.</p>
            <div className="mt-6 flex items-center gap-3 rounded-md border border-line bg-surface p-4"><Avatar name={person.name} tone={person.tone} size={44} /><div><div className="text-body font-medium">{person.name}</div><div className="text-small text-mute">{job.title}</div></div><div className="ml-auto text-right"><div className="t-h2 tabular-nums">{avg.toFixed(1)}</div><div className="text-small text-mute">overall</div></div></div>
            <ul className="mt-8 divide-y divide-line border-y border-line">{(Object.keys(ratings) as (keyof typeof ratings)[]).map((k) => <li key={k} className="flex items-center justify-between gap-4 py-4"><span className="text-body">{k}</span><Stars size={22} value={ratings[k]} onChange={(n) => setRatings({ ...ratings, [k]: n })} /></li>)}</ul>
            <label className="mt-8 block"><div className="t-caption mb-2">Notes</div><textarea rows={4} value={fbNote || notes} onChange={(e) => setFbNote(e.target.value)} className="field resize-none" placeholder="What stood out? Any concerns?" /></label>
            <div className="mt-10"><div className="t-caption mb-3">Decision</div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Button size="lg" variant="accent" onClick={() => choose("hire")}>Hire</Button>
                <Button size="lg" variant="outline" onClick={() => choose("second")}>Second Interview</Button>
                <Button size="lg" variant="outline" onClick={() => choose("shortlist")}>Shortlist</Button>
                <Button size="lg" variant="ghost" className="!border !border-line" onClick={() => choose("reject")}>Reject</Button>
              </div></div>
          </motion.div>
        )}

        {phase === "decided" && outcome && (
          <motion.div key="d" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-xl py-10 text-center">
            <motion.div initial={{ scale: 0.3 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 13 }} className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full ${outcome === "reject" ? "bg-sunk text-mute" : "bg-ok/10 text-ok"}`}>{outcome === "reject" ? <X className="h-8 w-8" /> : <Check className="h-8 w-8" strokeWidth={2.5} />}</motion.div>
            <h1 className="t-h1">{{ hire: `${person.name.split(" ")[0]} is hired.`, second: "Second interview requested.", shortlist: "Added to your shortlist.", reject: "Candidate declined." }[outcome]}</h1>
            <p className="mt-4 text-body text-mute">{{ hire: "A shared workspace is ready, with tasks, files, milestones and payments.", second: `${person.name.split(" ")[0]} will get a message with times for a deeper conversation.`, shortlist: "You can compare shortlisted people from your dashboard.", reject: "We’ll send a polite note. They’ll never see your private feedback." }[outcome]}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {outcome === "hire" ? <Button size="lg" href={`/projects/${wsId}`} variant="accent" iconRight={<ArrowRight className="h-4 w-4" />}>Open project workspace</Button> : <Button size="lg" href="/talent">Back to matches</Button>}
              <Button size="lg" variant="outline" href="/dashboard">Go to dashboard</Button>
            </div>
            {outcome !== "hire" && <button onClick={() => setPhase("feedback")} className="mt-5 text-small text-mute underline-link">Change decision</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default function Interview() { return <Suspense><Inner /></Suspense>; }
