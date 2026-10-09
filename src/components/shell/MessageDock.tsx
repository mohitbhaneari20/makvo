"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, FileText, Minus, Paperclip, Send, SquarePen, X } from "lucide-react";
import { contact } from "@/data/social";
import { projectById } from "@/data/projects";
import { useApp } from "@/lib/store";
import type { Conversation, Message } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { ProjectArt } from "@/components/art/ProjectArt";

const REPLIES = ["Sounds good. I’ll take a look and get back to you shortly.", "Thanks! Can we hop on a quick call tomorrow?", "Love that. Sending a few thoughts over this afternoon.", "Perfect, that works for me."];

function Mini({ m, who }: { m: Message; who: ReturnType<typeof contact> }) {
  const me = m.from === "me";
  if (m.kind === "system") return <div className="py-1 text-center text-[11px] text-mute">{m.text}</div>;
  return (
    <div className={`flex items-end gap-1.5 ${me ? "justify-end" : ""}`}>
      {!me && <Avatar name={who.name} tone={who.tone} size={22} />}
      <div className="flex max-w-[78%] flex-col gap-1">
        {m.kind === "project" && m.projectId && (() => { const p = projectById(m.projectId); return <Link href={`/work/${p.id}`} className="block overflow-hidden rounded-sm border border-line bg-surface"><div className="aspect-[16/9]"><ProjectArt art={p.art} palette={p.palette} /></div><div className="px-2.5 py-1.5 text-[12px] font-medium">{p.name}</div></Link>; })()}
        {m.kind === "file" && m.file && <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-2 text-[12px]"><FileText className="h-4 w-4 text-mute" /><span className="truncate">{m.file.name}</span></div>}
        {m.kind === "interview" && <div className="rounded-md border border-line bg-surface px-2.5 py-2 text-[12px]"><span className="font-medium">Interview invite</span><br />{m.text}</div>}
        {m.text && m.kind !== "interview" && m.kind !== "file" && <div className={`rounded-sm px-3 py-2 text-[13px] leading-snug ${me ? "bg-ink text-paper" : "border border-line bg-surface"}`}>{m.text}</div>}
      </div>
    </div>
  );
}

function ChatWindow({ convo, onClose, onMin, min }: { convo: Conversation; onClose: () => void; onMin: () => void; min: boolean }) {
  const { send, receive, markRead } = useApp();
  const who = contact(convo.with);
  const [draft, setDraft] = useState(""); const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!min) { markRead(convo.id); end.current?.scrollIntoView({ block: "end" }); } /* eslint-disable-next-line */ }, [convo.thread.length, typing, min]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); if (!draft.trim()) return;
    send(convo.id, { kind: "text", text: draft.trim() }); setDraft(""); setTyping(true);
    setTimeout(() => { setTyping(false); receive(convo.id, { kind: "text", text: REPLIES[Math.floor(Math.random() * REPLIES.length)] }); }, 1600);
  };
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="pointer-events-auto flex w-[330px] flex-col overflow-hidden rounded-t-md border border-b-0 border-line bg-paper shadow-pop" style={{ height: min ? 52 : 440 }}>
      <div className="flex h-[52px] shrink-0 items-center gap-2.5 border-b border-line bg-surface px-3">
        <button onClick={onMin} className="flex min-w-0 flex-1 items-center gap-2.5 text-left"><Avatar name={who.name} tone={who.tone} size={30} status="online" /><span className="min-w-0"><span className="block truncate text-small font-medium leading-tight">{who.name}</span><span className="block truncate text-[11px] leading-tight text-mute">{convo.topic}</span></span></button>
        <Link href={`/messages?c=${convo.id}`} aria-label="Open in Messages" title="Open in Messages" className="rounded-full p-1.5 text-mute hover:bg-sunk hover:text-ink"><ExternalLink className="h-4 w-4" /></Link>
        <button onClick={onMin} aria-label={min ? "Expand" : "Minimise"} className="rounded-full p-1.5 text-mute hover:bg-sunk hover:text-ink">{min ? <ChevronUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</button>
        <button onClick={onClose} aria-label="Close chat" className="rounded-full p-1.5 text-mute hover:bg-sunk hover:text-ink"><X className="h-4 w-4" /></button>
      </div>
      {!min && (<>
        <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
          {convo.thread.map((m, i) => <Mini key={i} m={m} who={who} />)}
          {typing && <div className="flex items-end gap-1.5"><Avatar name={who.name} tone={who.tone} size={22} /><div className="flex gap-1 rounded-md border border-line bg-surface px-3 py-2.5">{[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-faint" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.1, delay: i * 0.18 }} />)}</div></div>}
          <div ref={end} />
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 border-t border-line p-2.5">
          <button type="button" aria-label="Attach file" onClick={() => send(convo.id, { kind: "file", file: { name: "reference.pdf", size: "820 KB" } })} className="rounded-full p-1.5 text-mute hover:bg-sunk hover:text-ink"><Paperclip className="h-4 w-4" /></button>
          <input autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Write a message…" className="h-9 flex-1 rounded-full bg-sunk px-3 text-small outline-none placeholder:text-faint focus:ring-2 focus:ring-ink/10" />
          <button type="submit" aria-label="Send" disabled={!draft.trim()} className="rounded-full p-2 text-ink transition disabled:opacity-30"><Send className="h-4 w-4" /></button>
        </form>
      </>)}
    </motion.div>
  );
}

export function MessageDock() {
  const path = usePathname();
  const { convos } = useApp();
  const [open, setOpen] = useState(false);
  const [wins, setWins] = useState<string[]>([]);
  const [mins, setMins] = useState<string[]>([]);
  const unread = convos.reduce((a, c) => a + c.unread, 0);
  if (path === "/" || path.startsWith("/messages") || path.startsWith("/interview")) return null;

  const openChat = (id: string) => {
    setMins((m) => m.filter((x) => x !== id));
    setWins((w) => (w.includes(id) ? w : [...w.slice(-1), id]));
  };
  const close = (id: string) => { setWins((w) => w.filter((x) => x !== id)); setMins((m) => m.filter((x) => x !== id)); };
  const toggleMin = (id: string) => setMins((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));

  return (
    <div className="pointer-events-none fixed bottom-0 right-6 z-[55] hidden items-end gap-3 lg:flex">
      <AnimatePresence initial={false}>
        {wins.map((id) => { const c = convos.find((x) => x.id === id); return c ? <ChatWindow key={id} convo={c} min={mins.includes(id)} onMin={() => toggleMin(id)} onClose={() => close(id)} /> : null; })}
      </AnimatePresence>
      <div className="pointer-events-auto w-[300px] overflow-hidden rounded-t-md border border-b-0 border-line bg-paper shadow-pop">
        <button onClick={() => setOpen((o) => !o)} className="flex h-[52px] w-full items-center gap-3 bg-surface px-3 text-left" aria-expanded={open}>
          <span className="relative"><Avatar name="Varun Sharma" tone="#E9C8B0" size={30} status="online" />{!open && unread > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-midnight">{unread}</span>}</span>
          <span className="flex-1 text-small font-medium">Messaging</span>
          <SquarePen className="h-4 w-4 text-mute" />
          <ChevronDown className={`h-4 w-4 text-mute transition-transform ${open ? "" : "rotate-180"}`} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0 }} animate={{ height: 380 }} exit={{ height: 0 }} transition={{ duration: 0.26, ease: [0.2, 0.7, 0.2, 1] }} className="overflow-hidden border-t border-line">
              <ul className="h-[380px] overflow-y-auto">
                {convos.map((c) => { const k = contact(c.with); return (
                  <li key={c.id}><button onClick={() => openChat(c.id)} className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-sunk ${wins.includes(c.id) ? "bg-sunk/70" : ""}`}>
                    <Avatar name={k.name} tone={k.tone} size={38} status="online" />
                    <span className="min-w-0 flex-1"><span className="flex items-baseline justify-between gap-2"><span className={`truncate text-small ${c.unread ? "font-semibold" : "font-medium"}`}>{k.name}</span><span className="shrink-0 text-[11px] text-faint">{c.at}</span></span><span className={`block truncate text-[12px] ${c.unread ? "text-ink" : "text-mute"}`}>{c.last}</span></span>
                    {c.unread > 0 && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-hi" />}
                  </button></li>
                ); })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
