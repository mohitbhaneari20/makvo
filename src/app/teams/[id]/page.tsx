"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import { TEAMS } from "@/data/teams";
import { PEOPLE, personById } from "@/data/people";
import { PROJECTS } from "@/data/projects";
import { Avatar, AvatarStack, PhotoBanner } from "@/components/ui/Avatar";
import { bannerFor } from "@/data/photos";
import { AvailabilityBadge, Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConnectButton } from "@/components/ui/Actions";
import { Counter, Reveal, Stars } from "@/components/ui/Misc";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HireModal } from "@/components/flows/HireModal";

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = TEAMS.find((x) => x.id === id);
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState<string | undefined>();
  if (!t) return notFound();
  const members = t.members.map((m) => ({ ...m, p: personById(m.id) }));
  const works = t.projects.map((x) => PROJECTS.find((p) => p.id === x)!).filter(Boolean);
  const reviews = members.flatMap((m) => m.p.reviews.map((r) => ({ ...r, by2: m.p.name }))).sort((a, b) => b.rating - a.rating).slice(0, 4);
  const hire = (s?: string) => { setSvc(s); setOpen(true); };

  return (
    <div>
      <section className="container-x pt-8 md:pt-12">
        <Link href="/teams" className="inline-flex items-center gap-1.5 text-small text-mute hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />All teams</Link>
        <PhotoBanner src={bannerFor(t.id + "team")} className="mt-6 h-44 rounded-lg md:h-72">
          <div className="absolute inset-x-0 bottom-0 h-1.5 grad-spring" />
          <div className="absolute bottom-6 left-6 flex items-center gap-3 md:bottom-8 md:left-8"><AvatarStack people={members.map((m) => m.p)} size={40} /><span className="text-small font-medium text-praxeti">{t.members.length} people · {t.tagline}</span></div>
        </PhotoBanner>
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-6 flex flex-wrap items-center gap-4"><Badge tone="ink">Team</Badge><AvailabilityBadge a={t.availability} /><span className="text-small text-mute">Since {t.founded}</span></div>
            <h1 className="t-display !text-[clamp(3rem,9vw,8rem)]">{t.name}</h1>
            <p className="mt-3 text-[1.6rem] text-mute">{t.tagline}</p>
            <p className="mt-6 max-w-xl text-[1.15rem] leading-relaxed">{t.blurb}</p>
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-md border border-line bg-surface p-5 lg:sticky lg:top-24">
              <div className="t-caption mb-1">Team rate</div><div className="t-h2 tabular-nums">${t.rate[0]}K–${t.rate[1]}K</div><div className="mt-1 text-small text-mute">per project, all {t.members.length} members</div>
              <Button size="lg" full className="mt-5" onClick={() => hire()}>Hire Team</Button>
              <Button full variant="outline" className="mt-2" href={`/interview?with=${members[0].p.id}`}>Interview the team</Button>
              <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-small">
                <div className="flex justify-between"><dt className="text-mute">Rating</dt><dd className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-ink" />{t.rating.toFixed(1)}</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Projects together</dt><dd>{t.jobs}</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Industries</dt><dd>{t.industries.join(", ")}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-x mt-20">
        <div className="mb-8 flex items-end justify-between"><h2 className="t-h1">{t.members.length} members</h2></div>
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-3">
          {members.map((m) => (
            <div key={m.id} className="flex flex-col justify-between gap-10 bg-paper p-6">
              <Link href={`/people/${m.id}`} data-cursor="View" className="group flex items-center gap-4"><Avatar name={m.p.name} tone={m.p.tone} size={64} /><div><div className="t-h3 group-hover:underline">{m.p.name.split(" ")[0]}</div><div className="text-small text-mute">{m.role}</div></div></Link>
              <div><div className="mb-4 text-small text-mute">{m.p.skills.slice(0, 3).join(" · ")}</div><div className="flex gap-2"><Button size="sm" href={`/people/${m.id}`} className="flex-1">View profile</Button><ConnectButton id={m.id} size="sm" /></div></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x mt-24">
        <div className="mb-10 flex items-end justify-between"><h2 className="t-h1">Selected work</h2><span className="text-small text-mute">{works.length} verified {works.length === 1 ? "project" : "projects"}</span></div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">{works.map((w, i) => <ProjectCard key={w.id} project={w} index={i} size={i === 0 && works.length % 2 === 1 ? "lg" : "md"} />)}</div>
      </section>

      <section className="container-x mt-24 md:mt-36">
        <h2 className="t-h1 mb-10">Services</h2>
        <div className="border-b border-line">
          {t.services.map((s) => (
            <Reveal key={s.name}><div className="group grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12 md:gap-8">
              <h3 className="t-h2 transition-transform duration-500 group-hover:translate-x-1.5 lg:col-span-5">{s.name}</h3>
              <p className="text-body text-mute lg:col-span-4">{s.blurb}<span className="mt-1 block text-small">Typically {s.days}</span></p>
              <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end"><div className="text-right"><div className="text-small text-mute">Starting</div><div className="t-h3 tabular-nums">${s.from.toLocaleString()}</div></div><Button variant="outline" onClick={() => hire(s.name)}>Request</Button></div>
            </div></Reveal>
          ))}
        </div>
      </section>

      <section className="container-x mt-24 md:mt-36">
        <div className="mb-10 flex items-end justify-between"><h2 className="t-h1">What clients say</h2><div className="flex items-center gap-2"><Stars value={t.rating} /><span className="text-small tabular-nums"><Counter to={t.jobs} /> projects</span></div></div>
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
          {reviews.map((r) => (<figure key={r.by + r.project} className="bg-paper p-6 md:p-8"><Stars value={r.rating} /><blockquote className="mt-4 text-[1.05rem] leading-relaxed">“{r.text}”</blockquote><figcaption className="mt-6 text-small"><span className="font-medium">{r.by}</span> <span className="text-mute">· {r.role} · about {r.by2.split(" ")[0]}</span></figcaption></figure>))}
        </div>
      </section>

      <section className="container-x mt-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg grad-midnight p-8 text-praxeti md:flex-row md:items-center md:p-14"><h2 className="t-h1 max-w-lg">One brief. {t.members.length} people. {t.name}.</h2><Button variant="accent" size="lg" onClick={() => hire()}>Hire Team</Button></div>
      </section>

      <HireModal key={`${open}${svc}`} open={open} onClose={() => setOpen(false)} target={{ kind: "team", id: t.id, name: t.name, tone: t.tone, sub: t.tagline, project: svc }} />
    </div>
  );
}
