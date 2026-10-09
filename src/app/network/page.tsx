"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageSquare, Search, X } from "lucide-react";
import { PEOPLE, personById } from "@/data/people";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { ConnectButton, FollowButton } from "@/components/ui/Actions";
import { SubNav, PEOPLE_NAV } from "@/components/shell/SubNav";
import { Empty } from "@/components/ui/Misc";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { BRAND } from "@/lib/brand";
import type { Person } from "@/data/types";

const TABS = ["Connections", "Following", "Requests"] as const;

export default function Network() {
  const { conn, following, incoming, accept, decline, startConversation, toast } = useApp();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Connections");
  const [q, setQ] = useState("");
  const router = useRouter();
  const connected = PEOPLE.filter((p) => conn[p.id] === "connected");
  const pending = PEOPLE.filter((p) => conn[p.id] === "pending");
  const suggestions = PEOPLE.filter((p) => p.id !== "varun-sharma" && (conn[p.id] ?? "none") === "none" && !incoming.includes(p.id)).slice(0, 4);
  const f = (list: Person[]) => list.filter((p) => !q || (p.name + p.role + p.skills.join(" ")).toLowerCase().includes(q.toLowerCase()));
  const followingList = PEOPLE.filter((p) => following.includes(p.id));
  const msg = (p: Person) => { const id = startConversation(p.id, "Introduction"); router.push(`/messages?c=${id}`); };

  const Row = ({ p, children, sub }: { p: Person; children: React.ReactNode; sub?: string }) => (
    <motion.li layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="grid items-center gap-4 border-t border-line py-5 sm:grid-cols-[1fr_auto]">
      <Link href={`/people/${p.id}`} className="group flex min-w-0 items-center gap-4"><Avatar name={p.name} tone={p.tone} size={52} status={p.availability === "Available" ? "online" : "away"} /><div className="min-w-0"><div className="text-h3 group-hover:underline">{p.name}</div><div className="truncate text-small text-mute">{p.role} · {p.location.split(",")[0]}</div><div className="mt-0.5 text-small text-mute">{sub ?? `${Math.max(2, (p.connections % 14) + 3)} mutual connections`}</div></div></Link>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </motion.li>
  );

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><div className="mb-5"><SubNav items={PEOPLE_NAV} id="people" /></div><h1 className="t-h1">Your network</h1><p className="mt-3 max-w-lg text-body text-mute">People you’ve worked with, learned from or want to work with next.</p></div>
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Tabs id="net" tabs={TABS} value={tab} onChange={setTab} counts={{ Connections: connected.length, Following: followingList.length, Requests: incoming.length }} className="flex-1" />
          </div>
          <div className="mt-5 flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 focus-within:border-ink"><Search className="h-4 w-4 text-mute" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${tab.toLowerCase()}`} className="flex-1 bg-transparent text-small outline-none placeholder:text-faint" /></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === "Connections" && (<ul className="mt-2 border-b border-line">{f(connected).map((p) => <Row key={p.id} p={p}><Button size="sm" variant="outline" icon={<MessageSquare className="h-3.5 w-3.5" />} onClick={() => msg(p)}>Message</Button><ConnectButton id={p.id} size="sm" /><FollowButton id={p.id} /></Row>)}{f(connected).length === 0 && <li><Empty title="No connections yet" sub="Connect with people whose work you admire." /></li>}</ul>)}
              {tab === "Following" && (<ul className="mt-2 border-b border-line">{f(followingList).map((p) => <Row key={p.id} p={p} sub={`Posted ${(p.views % 5) + 1} days ago`}><Button size="sm" variant="outline" icon={<MessageSquare className="h-3.5 w-3.5" />} onClick={() => msg(p)}>Message</Button><ConnectButton id={p.id} size="sm" /><FollowButton id={p.id} /></Row>)}{f(followingList).length === 0 && <li><Empty title="You’re not following anyone" sub="Follow people to see their new work in your feed." action={<Button href="/people" variant="outline">Find people</Button>} /></li>}</ul>)}
              {tab === "Requests" && (<div>
                <div className="t-caption mb-1 mt-6">Received · {incoming.length}</div>
                <ul className="border-b border-line"><AnimatePresence>{incoming.map((id) => { const p = personById(id); return <Row key={id} p={p} sub="“I loved your latest project and would like to connect.”"><Button size="sm" icon={<Check className="h-3.5 w-3.5" />} onClick={() => { accept(id); toast(`You’re now connected with ${p.name.split(" ")[0]}`); }}>Accept</Button><Button size="sm" variant="ghost" icon={<X className="h-3.5 w-3.5" />} onClick={() => { decline(id); toast("Request declined"); }}>Decline</Button></Row>; })}</AnimatePresence>{incoming.length === 0 && <li className="border-t border-line py-8 text-center text-small text-mute">You’re all caught up.</li>}</ul>
                <div className="t-caption mb-1 mt-10">Sent · {pending.length}</div>
                <ul className="border-b border-line">{pending.map((p) => <Row key={p.id} p={p} sub="Waiting for a reply"><ConnectButton id={p.id} size="sm" /></Row>)}{pending.length === 0 && <li className="border-t border-line py-8 text-center text-small text-mute">No pending requests.</li>}</ul>
              </div>)}
            </motion.div>
          </AnimatePresence>
        </div>
        <aside className="lg:col-span-4">
          <div className="t-caption mb-4">People you may know</div>
          <ul className="space-y-5">{suggestions.map((p) => (<li key={p.id} className="flex items-center gap-3"><Link href={`/people/${p.id}`}><Avatar name={p.name} tone={p.tone} size={44} /></Link><div className="min-w-0 flex-1"><Link href={`/people/${p.id}`} className="block truncate text-body font-medium hover:underline">{p.name}</Link><div className="truncate text-small text-mute">{p.role}</div><AvailabilityBadge a={p.availability} className="!text-[11px]" /></div><ConnectButton id={p.id} size="sm" /></li>))}</ul>
          <div className="mt-10 rounded-sm bg-sunk p-5"><div className="text-body font-medium">Your network is your pipeline.</div><p className="mt-1 text-small text-mute">64% of projects on {BRAND.name} start with someone who already knows the work.</p></div>
        </aside>
      </div>
    </div>
  );
}
