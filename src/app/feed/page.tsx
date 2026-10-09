"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Flag, Hammer, ImagePlus, MessageCircle, Sparkles } from "lucide-react";
import { POSTS } from "@/data/social";
import { PEOPLE, personById } from "@/data/people";
import { TEAMS, teamById } from "@/data/teams";
import { PROJECTS, projectById } from "@/data/projects";
import { JOBS, fmtBudget } from "@/data/jobs";
import type { Post } from "@/data/types";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Badge, Verified } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConnectButton, FollowButton, LikeButton, SaveButton } from "@/components/ui/Actions";
import { Modal } from "@/components/ui/Modal";
import { Chip, Skeleton, useFakeLoad } from "@/components/ui/Misc";
import { SubNav, DISCOVER_NAV } from "@/components/shell/SubNav";
import { useApp } from "@/lib/store";

const LABEL: Record<Post["type"], string> = { shared: "shared a project", seeking: "is looking for someone", published: "published a project", milestone: "hit a milestone", hired: "started a new project" };

function PostCard({ post: p }: { post: Post }) {
  const { interestedPosts, toggleInterested, toast, togglePostLike } = useApp();
  const [comments, setComments] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const isTeam = p.by.kind === "team";
  const person = isTeam ? null : personById(p.by.id);
  const team = isTeam ? teamById(p.by.id) : null;
  const name = person?.name ?? team!.name; const tone = person?.tone ?? team!.tone;
  const sub = person?.role ?? team!.tagline;
  const href = isTeam ? `/teams/${p.by.id}` : `/people/${p.by.id}`;
  const proj = p.projectId ? projectById(p.projectId) : null;
  const on = interestedPosts.includes(p.id);
  const connectId = person?.id;

  return (
    <motion.article layout initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -24px 0px", amount: 0.01 }} transition={{ duration: 0.5 }} className="border-t border-line py-7 first:border-t-0 md:py-9">
      <header className="flex items-start gap-3">
        <Link href={href}><Avatar name={name} tone={tone} size={44} square={isTeam} /></Link>
        <div className="min-w-0 flex-1 leading-snug"><div className="text-body"><Link href={href} className="font-medium hover:underline">{name}</Link> <span className="text-mute">{LABEL[p.type]}</span></div><div className="text-small text-mute">{sub} · {p.when}</div></div>
        {connectId && <ConnectButton id={connectId} size="sm" />}{isTeam && <FollowButton id={p.by.id} />}
      </header>
      <p className="mt-4 text-[1.08rem] leading-relaxed">{p.text}</p>

      {p.type === "seeking" && (
        <div className="mt-5 rounded-md border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center gap-2"><Badge tone="accent"><Sparkles className="h-3 w-3" />Looking for collaborators</Badge>{p.budget && <span className="text-small text-mute">Budget {p.budget}</span>}</div>
          <div className="mt-3 flex flex-wrap gap-1.5">{p.tags?.map((t) => <span key={t} className="rounded-xs border border-line px-2 py-0.5 text-[11px]">{t}</span>)}</div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-small text-mute">{(p.interested ?? 0) + (on ? 1 : 0)} interested</span>
            <div className="flex gap-2"><Button size="sm" variant={on ? "soft" : "primary"} onClick={() => { toggleInterested(p.id); toast(on ? "Removed your interest" : `Interest sent to ${name.split(" ")[0]}`); }}>{on ? "Interested ✓" : "Interested"}</Button><Button size="sm" variant="outline" href="/messages">Message</Button></div></div>
        </div>
      )}
      {p.type === "hired" && (
        <div className="mt-5 flex items-center gap-3 rounded-sm bg-ok/10 px-4 py-3 text-small"><Briefcase className="h-4 w-4 text-ok" /><span><span className="font-medium">New project started</span> with Bellini Architects · Framer website</span></div>
      )}
      {proj && (
        <Link href={`/work/${proj.id}`} data-cursor="View" className="group mt-5 block overflow-hidden rounded-sm bg-sunk">
          <div className="relative aspect-[16/10] overflow-hidden"><div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.04]"><ProjectArt art={proj.art} palette={proj.palette} /></div><div className="absolute left-3 top-3">{proj.verified && p.type !== "shared" && <Verified compact />}</div>
            {p.type === "milestone" && <div className="absolute bottom-3 left-3 rounded-xs bg-surface px-2.5 py-1.5 text-small font-medium shadow-soft">3m 40s median onboarding</div>}</div>
          <div className="flex items-center justify-between bg-surface px-4 py-3"><div><div className="text-body font-medium">{proj.name} <span className="font-normal text-mute">— {proj.tagline}</span></div><div className="text-small text-mute">{proj.categories.slice(0, 3).join(" · ")}</div></div><AvatarStack people={proj.creators.map((c) => personById(c.id))} size={26} /></div>
        </Link>
      )}

      <footer className="mt-4 flex items-center gap-5">
        <LikeButton kind="post" id={p.id} count={p.likes} />
        <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 text-small text-mute transition hover:text-ink"><MessageCircle className="h-4 w-4" />{p.comments + comments.length}</button>
        <div className="ml-auto flex items-center gap-1">{proj && <SaveButton id={proj.id} label />}</div>
      </footer>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-3 border-t border-line pt-4">
              {[{ n: "Elena Petrova", t: "This is the kind of clarity I wish more teams had.", tone: "#E5D6E3" }, ...comments.map((c) => ({ n: "Varun Sharma", t: c, tone: "#E9C8B0" }))].map((c, i) => (<div key={i} className="flex gap-3"><Avatar name={c.n} tone={c.tone} size={28} /><div className="rounded-sm bg-sunk px-3 py-2 text-small"><span className="font-medium">{c.n}</span> {c.t}</div></div>))}
              <form onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; setComments([...comments, text]); setText(""); }} className="flex gap-2"><input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a comment" className="field !py-2 !text-small" /><Button size="md" type="submit" variant="outline">Post</Button></form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

const INTENTS = [{ k: "shared", label: "Share a project", icon: ImagePlus }, { k: "seeking", label: "Looking for someone", icon: Flag }, { k: "milestone", label: "Post a milestone", icon: Hammer }] as const;

export default function Feed() {
  const { toast, role } = useApp();
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [filter, setFilter] = useState<"All" | "Work" | "Looking" | "Network">("All");
  const [compose, setCompose] = useState<null | (typeof INTENTS)[number]["k"]>(null);
  const [text, setText] = useState(""); const [proj, setProj] = useState("finora");
  const loading = useFakeLoad([filter], 400);
  const shown = posts.filter((p) => filter === "All" || (filter === "Work" && ["shared", "published", "milestone"].includes(p.type)) || (filter === "Looking" && p.type === "seeking") || (filter === "Network" && p.type === "hired"));
  const post = () => { if (!text.trim() || !compose) return; setPosts([{ id: `u${Date.now()}`, type: compose, by: { kind: "person", id: "varun-sharma" }, text, when: "now", projectId: compose === "seeking" ? undefined : proj, tags: compose === "seeking" ? ["Design", "SaaS"] : undefined, budget: compose === "seeking" ? "$2K–$5K" : undefined, likes: 0, comments: 0, interested: 0 }, ...posts]); setCompose(null); setText(""); toast("Posted to your network"); };
  const me = personById("varun-sharma");

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><div className="mb-5"><SubNav items={DISCOVER_NAV} id="discover" /></div><h1 className="t-h1">From your network</h1><p className="mt-3 max-w-lg text-body text-mute">New work, open briefs and projects starting. No selfies, just what people are building.</p></div>
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-md border border-line bg-surface p-4">
            <div className="flex items-center gap-3"><Avatar name={me.name} tone={me.tone} size={40} /><button onClick={() => setCompose("shared")} className="h-11 flex-1 rounded-full border border-line bg-paper px-4 text-left text-body text-mute transition hover:border-ink">What are you working on?</button></div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">{INTENTS.map((i) => <button key={i.k} onClick={() => setCompose(i.k)} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-small transition hover:bg-sunk"><i.icon className="h-4 w-4 text-mute" />{i.label}</button>)}</div>
          </div>
          <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">{(["All", "Work", "Looking", "Network"] as const).map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f === "Looking" ? "Looking for someone" : f}</Chip>)}</div>
          <div className="mt-4">
            {loading ? [0, 1].map((i) => <div key={i} className="border-t border-line py-8 first:border-t-0"><div className="flex gap-3"><Skeleton className="h-11 w-11 !rounded-full" /><div className="flex-1"><Skeleton className="h-4 w-1/2" /><Skeleton className="mt-2 h-3 w-1/3" /></div></div><Skeleton className="mt-5 h-4 w-full" /><Skeleton className="mt-5 aspect-[16/10] w-full" /></div>) : <AnimatePresence initial={false}>{shown.map((p) => <PostCard key={p.id} post={p} />)}</AnimatePresence>}
          </div>
        </div>
        <aside className="hidden space-y-12 lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-24 space-y-12">
            <section><div className="t-caption mb-4">Open briefs for you</div><ul className="space-y-1">{JOBS.slice(0, 3).map((j) => <li key={j.id}><Link href={`/opportunities/${j.id}`} className="group block rounded-sm py-3"><div className="flex items-baseline justify-between gap-3"><span className="text-body font-medium group-hover:underline">{j.title}</span><span className="text-small text-hi">{j.match}%</span></div><div className="text-small text-mute">{j.client} · {fmtBudget(j.budget)}</div></Link></li>)}</ul></section>
            <section><div className="t-caption mb-4">Follow</div><ul className="space-y-4">{PEOPLE.filter((p) => ["diego-ramos", "zara-hussain", "elena-petrova"].includes(p.id)).map((p) => <li key={p.id} className="flex items-center gap-3"><Avatar name={p.name} tone={p.tone} size={38} /><div className="min-w-0 flex-1"><Link href={`/people/${p.id}`} className="block truncate text-small font-medium hover:underline">{p.name}</Link><div className="truncate text-[12px] text-mute">{p.role}</div></div><FollowButton id={p.id} /></li>)}</ul></section>
            <section><div className="t-caption mb-4">Teams hiring</div><ul className="space-y-3">{TEAMS.slice(2, 4).map((t) => <li key={t.id}><Link href={`/teams/${t.id}`} className="flex items-center gap-3 hover:underline"><Avatar name={t.name} tone={t.tone} size={34} square /><span className="text-small font-medium">{t.name}</span><span className="text-small text-mute">{t.tagline}</span></Link></li>)}</ul></section>
          </div>
        </aside>
      </div>

      <Modal open={!!compose} onClose={() => setCompose(null)} title="New post" width="max-w-xl">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3"><Avatar name={me.name} tone={me.tone} size={40} /><div><div className="text-body font-medium">{me.name}</div><div className="text-small text-mute">Posting to your network</div></div></div>
          <div className="mt-5 flex flex-wrap gap-2">{INTENTS.map((i) => <Chip key={i.k} active={compose === i.k} onClick={() => setCompose(i.k)}>{i.label}</Chip>)}</div>
          <textarea autoFocus rows={5} value={text} onChange={(e) => setText(e.target.value)} className="field mt-4 resize-none" placeholder={compose === "seeking" ? "What are you building and who do you need?" : compose === "milestone" ? "What just shipped, and what did it change?" : "Tell people what you made and what you’d do differently."} />
          {compose !== "seeking" && <div className="mt-4"><div className="t-caption mb-2">Attach project</div><div className="no-scrollbar flex gap-2 overflow-x-auto">{PROJECTS.filter((x) => x.creators.some((c) => c.id === "varun-sharma")).map((x) => <button key={x.id} onClick={() => setProj(x.id)} className={`w-28 shrink-0 overflow-hidden rounded-xs ring-2 transition ${proj === x.id ? "ring-ink" : "ring-transparent"}`}><div className="aspect-[4/3]"><ProjectArt art={x.art} palette={x.palette} /></div></button>)}</div></div>}
          <div className="mt-6 flex justify-end"><Button onClick={post} disabled={!text.trim()}>Post</Button></div>
        </div>
      </Modal>
    </div>
  );
}
