"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useMemo, useState } from "react";
import { ArrowUpRight, Github, Globe, Linkedin, MapPin, Clock, Dribbble, Video, Pencil, Share2 } from "lucide-react";
import { PEOPLE } from "@/data/people";
import { PROJECTS } from "@/data/projects";
import { teamById } from "@/data/teams";
import { Avatar } from "@/components/ui/Avatar";
import { AvailabilityBadge, Badge, Spark, Verified } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConnectButton, FollowButton } from "@/components/ui/Actions";
import { Counter, Reveal, Stars } from "@/components/ui/Misc";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HireModal } from "@/components/flows/HireModal";
import { PhotoBanner } from "@/components/ui/Avatar";
import { bannerFor } from "@/data/photos";
import { useApp } from "@/lib/store";

const SECTIONS = ["Work", "Services", "Work DNA", "Experience", "Reviews"];
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

function Heat({ seed }: { seed: number }) {
  const cells = useMemo(() => Array.from({ length: 26 * 7 }, (_, i) => { const v = Math.sin(i * 12.9898 + seed) * 43758.5453; const r = v - Math.floor(v); return r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.8 ? 2 : r < 0.93 ? 3 : 4; }), [seed]);
  const shade = ["bg-sunk", "bg-ok/25", "bg-ok/50", "bg-ok/75", "bg-ok"];
  return <div className="grid grid-flow-col grid-rows-7 gap-[3px]">{cells.map((c, i) => <span key={i} className={`h-[9px] w-[9px] rounded-[2px] ${shade[c]}`} />)}</div>;
}

export default function Profile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = PEOPLE.find((x) => x.id === id);
  const { role, toast, invited } = useApp();
  const [modal, setModal] = useState<null | "hire" | "invite" | "message">(null);
  const [service, setService] = useState<string | undefined>();
  if (!p) return notFound();

  const isDev = p.kind === "developer";
  const first = p.name.split(" ")[0];
  const team = p.team ? teamById(p.team) : null;
  const works = Array.from(new Set([...p.projects, ...(team?.projects ?? [])])).map((x) => PROJECTS.find((pr) => pr.id === x)!).filter(Boolean);
  const verified = works.filter((w) => w.verified && w.creators.some((c) => c.id === p.id)).length;
  const isMe = p.id === "varun-sharma" && role === "creator";
  const links = [p.links.website && { i: Globe, l: "Website", v: p.links.website }, p.links.linkedin && { i: Linkedin, l: "LinkedIn", v: p.links.linkedin }, p.links.dribbble && { i: Dribbble, l: "Dribbble", v: p.links.dribbble }, p.links.github && { i: Github, l: "GitHub", v: p.links.github }].filter(Boolean) as { i: typeof Globe; l: string; v: string }[];
  const target = { kind: "person" as const, id: p.id, name: p.name, tone: p.tone, sub: p.role, project: service };
  const open = (m: "hire" | "invite" | "message", s?: string) => { setService(s); setModal(m); };

  return (
    <div>
      {isMe && <div className="border-b border-line bg-sunk"><div className="container-x flex items-center justify-between gap-4 py-2.5 text-small"><span className="text-mute">This is how clients see your profile.</span><div className="flex gap-2"><Button size="sm" variant="outline" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => toast("Profile editor opens here in the full product")}>Edit</Button><Button size="sm" variant="outline" icon={<Share2 className="h-3.5 w-3.5" />} onClick={() => toast("Profile link copied")}>Share</Button></div></div></div>}

      <section className="container-x pt-6 md:pt-8">
        <PhotoBanner src={bannerFor(p.id)} className="h-40 rounded-lg md:h-60">
          <div className="absolute inset-x-0 bottom-0 h-1.5 grad-spring" />
          <div className="absolute right-5 top-5 hidden items-center gap-2 rounded-full bg-midnight/70 px-3 py-1.5 text-[12px] text-praxeti backdrop-blur md:flex"><Spark className="h-3 w-3" color="#DBE64C" />{team ? `${team.name} · ` : ""}{p.location.split(",")[0]}</div>
        </PhotoBanner>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="-mt-12 flex items-end gap-5 md:-mt-14">
              <div className={`relative flex shrink-0 rounded-full ring-[5px] ${p.availability === "Available" ? "ring-mantis" : "ring-paper"}`}><Avatar name={p.name} tone={p.tone} size={112} /></div>
              <div className="pb-1"><AvailabilityBadge a={p.availability} /><div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-small text-mute"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{p.location}</span><span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{p.tz}</span></div></div>
            </div>
            <h1 className="t-display mt-8 !text-[clamp(3rem,8vw,7rem)]">{p.name}</h1>
            <p className="mt-3 text-h2 font-normal text-mute">{p.role}</p>
            <p className="mt-6 max-w-2xl text-[1.2rem] leading-relaxed">{p.headline}</p>
            <div className="mt-6 flex flex-wrap gap-2">{p.skills.map((s) => <Badge key={s} tone="outline">{s}</Badge>)}</div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">{links.map((l) => <a key={l.l} href="#" onClick={(e) => { e.preventDefault(); toast(`Opens ${l.v}`); }} className="group inline-flex items-center gap-2 text-body"><l.i className="h-4 w-4 text-mute" /><span className="underline-link">{l.l}</span><ArrowUpRight className="h-3.5 w-3.5 text-mute transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>)}</div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-md border border-line bg-surface p-5 lg:sticky lg:top-24 lg:mt-6">
              <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2"><div><div className="t-caption mb-1">Project range</div><div className="t-h2 whitespace-nowrap tabular-nums">${p.rate[0]}K–${p.rate[1]}K</div></div><div className="text-right"><div className="t-caption mb-1">Hourly</div><div className="text-h3 tabular-nums">${p.hourly}/hr</div></div></div>
              <div className="mt-5 grid gap-2">
                <Button size="lg" full onClick={() => open(isDev ? "hire" : "message")} magnetic={false}>{isDev ? `Hire ${first}` : "Start a conversation"}</Button>
                <Button full variant="outline" onClick={() => open("invite")}>Invite to project</Button>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-2"><ConnectButton id={p.id} full /><Button variant="outline" icon={<Video className="h-4 w-4" />} href={`/interview?with=${p.id}`}>Interview</Button></div>
                {isDev && <Button full variant="ghost" onClick={() => open("message")}>Start a conversation</Button>}
              </div>
              {invited.includes(p.id) && <p className="mt-3 text-small text-ok">Invitation sent. {first} will reply in Messages.</p>}
              <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-small">
                <div className="flex justify-between"><dt className="text-mute">Replies</dt><dd>{p.responds}</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Experience</dt><dd>{p.years} years</dd></div>
                <div className="flex justify-between"><dt className="text-mute">Works {p.remote ? "remotely" : "on site"}</dt><dd>{p.tz.split(" ")[0]} hours</dd></div>
                {team && <div className="flex justify-between"><dt className="text-mute">Team</dt><dd><Link href={`/teams/${team.id}`} className="font-medium underline-link">{team.name}</Link></dd></div>}
              </dl>
              <div className="mt-4 flex justify-center"><FollowButton id={p.id} size="md" /></div>
            </div>
          </aside>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-5">
          {[[p.rating, "Average rating", 1, ""], [p.jobsDone, "Projects completed", 0, ""], [verified || works.length, "Verified projects", 0, ""], [p.connections, "Connections", 0, ""], [p.views, "Profile views", 0, ""]].map(([v, l, d]) => (
            <div key={l as string} className="bg-paper p-5"><div className="t-h2 tabular-nums"><Counter to={v as number} decimals={d as number} /></div><div className="mt-1 text-small text-mute">{l as string}</div></div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-30 mt-12 border-b border-line bg-paper/90 backdrop-blur-md md:top-16">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto">{SECTIONS.filter((s) => !(s === "Work DNA" && false)).map((s) => <a key={s} href={`#${slug(s)}`} className="shrink-0 px-3 py-3.5 text-small text-mute transition-colors hover:text-ink">{s === "Work" && isDev ? "Projects" : s}</a>)}</div>
      </div>

      {/* WORK */}
      <section id="work" className="container-x scroll-mt-32 pt-16 md:pt-24">
        <div className="mb-10 flex items-end justify-between"><h2 className="t-h1">{isDev ? "Projects" : "Work"}</h2><span className="text-small text-mute">{works.length} projects · {verified} verified</span></div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
          {works.map((w, i) => (<div key={w.id} className={i === 0 && works.length > 2 ? "lg:col-span-2" : ""}><ProjectCard project={w} size={i === 0 && works.length > 2 ? "lg" : "md"} index={i} /></div>))}
        </div>
      </section>

      {isDev && (
        <section className="container-x mt-24">
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-5">
            <div className="bg-surface p-6 lg:col-span-3"><div className="t-caption mb-5">Tech stack</div><div className="flex flex-wrap gap-2">{p.stack?.map((s) => <span key={s} className="rounded-xs bg-sunk px-3 py-1.5 font-mono text-small">{s}</span>)}</div></div>
            <div className="bg-surface p-6 lg:col-span-2"><div className="mb-5 flex items-center justify-between"><span className="t-caption">GitHub · last 6 months</span><span className="text-small text-mute">{p.links.github}</span></div><div className="overflow-x-auto"><Heat seed={p.years * 3.1} /></div><div className="mt-4 text-small text-mute">1,284 contributions · 31 repositories</div></div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section id="services" className="container-x scroll-mt-32 pt-24 md:pt-36">
        <h2 className="t-h1 mb-10">Services</h2>
        <div className="border-b border-line">
          {p.services.map((s) => (
            <Reveal key={s.name}>
              <div className="group grid items-center gap-4 border-t border-line py-7 lg:grid-cols-12 md:gap-8">
                <div className="lg:col-span-5"><h3 className="t-h2 transition-transform duration-500 group-hover:translate-x-1.5">{s.name}</h3></div>
                <p className="text-body text-mute lg:col-span-4">{s.blurb}<span className="mt-1 block text-small">Typically {s.days}</span></p>
                <div className="flex items-center justify-between gap-4 lg:col-span-3 lg:justify-end"><div className="text-right"><div className="text-small text-mute">Starting</div><div className="t-h3 tabular-nums">${s.from.toLocaleString()}</div></div><Button variant="outline" onClick={() => open("hire", s.name)}>Request</Button></div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DNA */}
      <section id="work-dna" className="container-x scroll-mt-32 pt-24 md:pt-36">
        <div className="mb-10 flex items-end justify-between"><h2 className="t-h1">Work DNA</h2><span className="hidden text-small text-mute md:block">How {first} tends to work, drawn from {p.jobsDone} projects.</span></div>
        <div className="grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {([["Style", p.dna.style], ["Industries", p.dna.industries], ["Strength", p.dna.strengths]] as const).map(([h, items], c) => (
            <div key={h} className="py-8 md:px-8 md:first:pl-0 md:last:pr-0">
              <div className="t-caption mb-6">{h}</div>
              <ul className="space-y-4">{items.map((x, i) => (<li key={x}><div className="flex items-baseline justify-between"><span className="t-h3">{x}</span>{h === "Strength" && <span className="text-small tabular-nums text-mute">{96 - i * 7}%</span>}</div>{h === "Strength" && <div className="mt-2 h-1 overflow-hidden rounded-full bg-sunk"><div className="h-full rounded-full bg-ink" style={{ width: `${96 - i * 7}%` }} /></div>}</li>))}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="container-x scroll-mt-32 pt-24 md:pt-36">
        <h2 className="t-h1 mb-10">Experience</h2>
        <ol className="relative ml-2 border-l border-line">
          {p.experience.map((e, i) => (
            <Reveal key={e.org}><li className="relative pb-12 pl-8 last:pb-0"><span className={`absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-forest ring-4 ring-mantis/30" : "bg-ink"}`} />
              <div className="grid gap-1 lg:grid-cols-12 md:gap-8"><div className="text-small text-mute lg:col-span-3">{e.years}</div><div className="lg:col-span-9"><h3 className="t-h3">{e.role} · {e.org}</h3><p className="mt-1 text-body text-mute">{e.note}</p></div></div></li></Reveal>
          ))}
        </ol>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="container-x scroll-mt-32 pt-24 md:pt-36">
        <div className="mb-10 flex items-end justify-between"><h2 className="t-h1">Reviews</h2><div className="flex items-center gap-2"><Stars value={p.rating} /><span className="text-small tabular-nums">{p.rating.toFixed(1)} · {p.reviews.length} reviews</span></div></div>
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-2">
          {p.reviews.map((r) => (
            <figure key={r.by + r.project} className="flex flex-col justify-between bg-paper p-6 md:p-8">
              <div><Stars value={r.rating} /><blockquote className="mt-5 text-[1.1rem] leading-relaxed">“{r.text}”</blockquote></div>
              <figcaption className="mt-8 flex items-center justify-between gap-3"><div className="flex items-center gap-3"><Avatar name={r.by} size={36} /><div className="text-small"><div className="font-medium">{r.by}</div><div className="text-mute">{r.role}</div></div></div><div className="text-right text-small text-mute"><div className="inline-flex items-center gap-1 text-ink"><Verified compact />{r.project}</div><div>{r.when}</div></div></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-x mt-24 md:mt-36">
        <div className="flex flex-col items-start justify-between gap-6 rounded-lg grad-midnight p-8 text-praxeti md:flex-row md:items-center md:p-14">
          <h2 className="t-h1 max-w-lg">Like what you see? Start with a conversation.</h2>
          <div className="flex flex-wrap gap-3"><Button variant="accent" size="lg" onClick={() => open(isDev ? "hire" : "message")}>{isDev ? `Hire ${first}` : "Start a conversation"}</Button><Button size="lg" className="!border-praxeti/30 !bg-transparent !text-praxeti" variant="outline" onClick={() => open("invite")}>Invite to project</Button></div>
        </div>
      </section>

      <HireModal key={`${modal}${service}`} open={!!modal} onClose={() => setModal(null)} mode={modal ?? "hire"} target={target} />
    </div>
  );
}
