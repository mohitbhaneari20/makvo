"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { ArrowLeft, BadgeCheck, CalendarClock, Check, Globe2, MessageCircleQuestion, Wallet } from "lucide-react";
import { JOBS, fmtBudget } from "@/data/jobs";
import { PEOPLE } from "@/data/people";
import { recommendFor } from "@/lib/match";
import { Avatar, AvatarStack } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { SaveButton } from "@/components/ui/Actions";
import { Modal } from "@/components/ui/Modal";
import { Reveal } from "@/components/ui/Misc";
import { ProjectArt } from "@/components/art/ProjectArt";
import { PersonCard } from "@/components/cards/PersonCard";
import { ApplyModal } from "@/components/flows/ApplyModal";
import { useApp } from "@/lib/store";

export default function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const j = JOBS.find((x) => x.id === id);
  const { applications, toast } = useApp();
  const [apply, setApply] = useState(false);
  const [ask, setAsk] = useState(false);
  const [q, setQ] = useState("");
  if (!j) return notFound();
  const app = applications[j.id];
  const rec = recommendFor(j, 3);
  const applicants = PEOPLE.filter((_, i) => i % 2 === 0).slice(0, 6);

  return (
    <div className="container-x pt-8 md:pt-12">
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-small text-mute hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />All opportunities</Link>
      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="mb-5 flex items-center gap-3"><Avatar name={j.client} tone={j.clientTone} size={36} square /><div className="text-body"><span className="font-medium">{j.client}</span>{j.verifiedClient && <BadgeCheck className="ml-1.5 inline h-4 w-4 text-hi" />}<span className="text-mute"> · {j.spent}</span></div></div>
          <h1 className="t-h1">{j.title}</h1>
          <p className="mt-4 max-w-2xl text-[1.25rem] leading-snug text-mute">{j.summary}</p>
          <div className="mt-8 flex flex-wrap gap-2">{j.skills.map((s) => <span key={s} className="rounded-xs border border-line px-2.5 py-1 text-small">{s}</span>)}</div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
            {[[Wallet, "Budget", fmtBudget(j.budget)], [CalendarClock, "Timeline", j.timeline], [Globe2, "Location", j.location.split(" · ")[0]]].map(([I, l, v]) => { const Ic = I as typeof Wallet; return <div key={l as string} className="bg-paper p-5"><Ic className="mb-6 h-4 w-4 text-mute" strokeWidth={1.5} /><div className="t-caption mb-1">{l as string}</div><div className="t-h3 tabular-nums">{v as string}</div></div>; })}
          </div>

          <Block title="Description"><p className="text-[1.08rem] leading-relaxed">{j.desc}</p></Block>
          <Block title="Requirements"><ul className="divide-y divide-line border-y border-line">{j.requirements.map((r) => <li key={r} className="flex gap-3 py-3.5 text-body"><Check className="mt-1 h-4 w-4 shrink-0 text-ink" />{r}</li>)}</ul></Block>
          <Block title="Deliverables"><ol className="divide-y divide-line border-y border-line">{j.deliverables.map((r, i) => <li key={r} className="grid grid-cols-[2.5rem_1fr] py-3.5 text-body"><span className="font-mono text-small text-mute">0{i + 1}</span>{r}</li>)}</ol></Block>
          <Block title="References">
            <div className="grid gap-5 sm:grid-cols-2">{j.references.map((r) => (<div key={r.name}><div className="aspect-[4/3] overflow-hidden rounded-sm"><ProjectArt art={r.art} palette={r.palette} /></div><div className="mt-2 text-body font-medium">{r.name}</div><div className="text-small text-mute">{r.note}</div></div>))}</div>
          </Block>
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-md border border-line bg-surface p-5 lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between"><div className="t-h2 text-hi tabular-nums">{j.match}% match</div><span className="text-small text-mute">Posted {j.posted}</span></div>
            <p className="mt-1 text-small text-mute">Based on your portfolio and availability.</p>
            {app ? (
              <div className="mt-5 rounded-sm bg-ok/10 p-4"><div className="flex items-center gap-2 text-body font-medium text-ok"><Check className="h-4 w-4" />Application sent</div><div className="mt-1 text-small text-mute">{app.price} · {app.timeline} · Under review</div><Button variant="outline" size="sm" className="mt-3" href="/projects">View in Projects</Button></div>
            ) : (
              <Button size="lg" full className="mt-5" variant="accent" onClick={() => setApply(true)}>Apply</Button>
            )}
            <div className="mt-2 grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-2"><Button variant="outline" icon={<MessageCircleQuestion className="h-4 w-4" />} onClick={() => setAsk(true)}>Ask a question</Button><SaveButton id={j.id} kind="job" label /></div>
            <div className="mt-6 border-t border-line pt-5"><div className="t-caption mb-3">Applicants</div><div className="flex items-center gap-3"><AvatarStack people={applicants} size={30} /><span className="text-small">{j.applicants} so far · 3 shortlisted</span></div></div>
            <div className="mt-5 border-t border-line pt-5 text-small text-mute">Posted by <span className="text-ink">{j.client}</span>. {j.verifiedClient ? "Payment verified." : "Payment not yet verified."}</div>
          </div>
        </aside>
      </div>

      <section className="mt-24">
        <div className="mb-8"><div className="t-caption mb-2">Recommended people</div><h2 className="t-h2">Based on this project.</h2></div>
        <div className="grid gap-6 md:grid-cols-3">{rec.map((r, i) => <PersonCard key={r.p.id} person={r.p} match={r.score} index={i} />)}</div>
      </section>

      <ApplyModal key={j.id} job={j} open={apply} onClose={() => setApply(false)} />
      <Modal open={ask} onClose={() => setAsk(false)} title="Ask a question" width="max-w-lg">
        <form className="p-6 md:p-8" onSubmit={(e) => { e.preventDefault(); setAsk(false); setQ(""); toast(`Question sent to ${j.client}`); }}>
          <div className="t-caption mb-2">To {j.client}</div><h2 className="t-h2">Ask before you apply.</h2>
          <p className="mt-2 text-small text-mute">Good questions show how you think. Keep it short and specific.</p>
          <textarea required rows={5} value={q} onChange={(e) => setQ(e.target.value)} className="field mt-5 resize-none" placeholder="e.g. Who is the main audience for the new site?" />
          <div className="mt-5 flex justify-end"><Button type="submit">Send question</Button></div>
        </form>
      </Modal>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return <Reveal><section className="mt-14"><h2 className="t-h3 mb-5">{title}</h2>{children}</section></Reveal>;
}
