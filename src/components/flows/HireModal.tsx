"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Misc";
import { Avatar } from "@/components/ui/Avatar";
import { useApp } from "@/lib/store";

export interface HireTarget { kind: "person" | "team"; id: string; name: string; tone: string; sub: string; project?: string }

const BUDGETS = ["Under $2K", "$2K–$5K", "$5K–$10K", "$10K+"];
const TIMES = ["Under 2 weeks", "3–4 weeks", "1–2 months", "Flexible"];

export function HireModal({ open, onClose, target, mode = "hire" }: { open: boolean; onClose: () => void; target: HireTarget; mode?: "hire" | "invite" | "message" }) {
  const { toast, startConversation, invite } = useApp();
  const [title, setTitle] = useState(target.project ?? "");
  const [brief, setBrief] = useState("");
  const [budget, setBudget] = useState(BUDGETS[1]);
  const [time, setTime] = useState(TIMES[1]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const label = mode === "invite" ? "Invite to project" : mode === "message" ? "Start a conversation" : target.kind === "team" ? "Hire this team" : `Hire ${target.name.split(" ")[0]}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => {
      setBusy(false); setSent(true);
      if (target.kind === "person") { startConversation(target.id, title || "New project"); if (mode === "invite") invite(target.id); }
      toast(mode === "message" ? `Message sent to ${target.name.split(" ")[0]}` : `Brief sent to ${target.name}`);
    }, 900);
  };
  const close = () => { onClose(); setTimeout(() => setSent(false), 300); };

  return (
    <Modal open={open} onClose={close} title={label} width="max-w-xl">
      <AnimatePresence mode="wait" initial={false}>
        {!sent ? (
          <motion.form key="f" onSubmit={submit} exit={{ opacity: 0 }} className="flex min-h-0 flex-1 flex-col">
            <div className="overflow-y-auto p-6 md:p-8">
              <div className="flex items-center gap-3"><Avatar name={target.name} tone={target.tone} size={44} /><div><div className="text-small text-mute">{mode === "message" ? "Message" : "Brief for"}</div><div className="text-h3">{target.name}</div></div></div>
              <h2 className="t-h2 mt-6">{mode === "message" ? "Say hello" : "Tell them what you’re building"}</h2>
              <div className="mt-6 space-y-5">
                {mode !== "message" && (<>
                  <label className="block"><span className="t-caption mb-2 block">Project name</span><input required value={title} onChange={(e) => setTitle(e.target.value)} className="field" placeholder="e.g. SaaS Website Redesign" /></label>
                </>)}
                <label className="block"><span className="t-caption mb-2 block">{mode === "message" ? "Message" : "What do you need?"}</span><textarea required rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} className="field resize-none" placeholder={mode === "message" ? "Hi! I saw your work and wanted to say…" : "A few lines is enough. What it is, who it’s for, what good looks like."} /></label>
                {mode !== "message" && (<>
                  <div><span className="t-caption mb-2 block">Budget</span><div className="flex flex-wrap gap-2">{BUDGETS.map((b) => <Chip key={b} active={budget === b} onClick={() => setBudget(b)}>{b}</Chip>)}</div></div>
                  <div><span className="t-caption mb-2 block">Timeline</span><div className="flex flex-wrap gap-2">{TIMES.map((b) => <Chip key={b} active={time === b} onClick={() => setTime(b)}>{b}</Chip>)}</div></div>
                </>)}
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-line bg-surface p-4 md:px-8"><span className="hidden text-small text-mute sm:block">Usually replies {target.kind === "team" ? "within a day" : "within a few hours"}.</span><Button type="submit" loading={busy} className="w-full sm:w-auto">{mode === "message" ? "Send message" : mode === "invite" ? "Send invitation" : "Send brief"}</Button></div>
          </motion.form>
        ) : (
          <motion.div key="s" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-8 text-center md:p-12">
            <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok"><CheckCircle2 className="h-7 w-7" /></motion.div>
            <h2 className="t-h2">Sent to {target.name}</h2>
            <p className="mx-auto mt-3 max-w-sm text-body text-mute">{mode === "message" ? "They’ll see it in Messages." : "They’ll get your brief in Messages. Most people reply the same day. Want to meet first?"}</p>
            <div className="mt-8 flex flex-col justify-center gap-2 sm:flex-row">
              {target.kind === "person" && <Button href="/messages" onClick={close}>Open conversation</Button>}
              {target.kind === "person" && mode !== "message" && <Button href={`/interview?with=${target.id}`} variant="outline" onClick={close}>Schedule interview</Button>}
              {target.kind === "team" && <Button variant="outline" onClick={close}>Done</Button>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
