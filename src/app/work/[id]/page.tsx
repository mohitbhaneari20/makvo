"use client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { use, useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Quote } from "lucide-react";
import { PROJECTS, projectById } from "@/data/projects";
import { PEOPLE, personById } from "@/data/people";
import { teamById } from "@/data/teams";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Counter, Reveal, SectionHead, Stars } from "@/components/ui/Misc";
import { Verified } from "@/components/ui/Badge";
import { ConnectButton, LikeButton, SaveButton } from "@/components/ui/Actions";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { HireModal } from "@/components/flows/HireModal";
import { BRAND } from "@/lib/brand";

const SECTIONS = ["Overview", "Challenge", "Process", "Design", "Development", "Final Product", "Results"];
const lum = (hex: string) => { const n = parseInt(hex.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

function Crop({ p, origin, scale = 2.1, ratio = "aspect-[4/3]" }: { p: (typeof PROJECTS)[number]; origin: string; scale?: number; ratio?: string }) {
  return <div className={`${ratio} overflow-hidden rounded-sm bg-sunk`}><div className="h-full w-full" style={{ transform: `scale(${scale})`, transformOrigin: origin }}><ProjectArt art={p.art} palette={p.palette} /></div></div>;
}

export default function CaseStudy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = PROJECTS.find((x) => x.id === id);
  const [active, setActive] = useState("Overview");
  const [hire, setHire] = useState<null | "person" | "team">(null);
  useEffect(() => {
    if (!p) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.getAttribute("data-s") || "Overview")), { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll("[data-s]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [p]);
  if (!p) return notFound();

  const people = p.creators.map((c) => ({ ...c, person: personById(c.id) }));
  const lead = people[0].person;
  const team = p.team ? teamById(p.team) : null;
  const review = PEOPLE.flatMap((x) => x.reviews.map((r) => ({ ...r, who: x }))).find((r) => people.some((c) => c.person.id === r.who.id) && r.project.toLowerCase().includes(p.name.toLowerCase().split(" ")[0]));
  const related = PROJECTS.filter((x) => x.id !== p.id && (x.categories.some((c) => p.categories.includes(c)) || x.industry === p.industry)).slice(0, 3);

  return (
    <div>
      <div className="container-x pt-8 md:pt-12">
        <Link href="/discover" className="inline-flex items-center gap-1.5 text-small text-mute transition hover:text-ink"><ArrowLeft className="h-3.5 w-3.5" />All work</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-5 flex flex-wrap items-center gap-3"><Verified label={`Verified project · completed through ${BRAND.name}`} /><span className="text-small text-mute">{p.kind} · {p.year}</span></div>
            <h1 className="t-display !text-[clamp(3.2rem,9vw,8.5rem)]">{p.name}</h1>
            <p className="mt-4 text-[1.4rem] leading-snug text-mute md:text-[1.8rem]">{p.tagline}</p>
          </div>
          <aside className="flex flex-col gap-3 lg:col-span-4 md:items-stretch lg:justify-end">
            <Button size="lg" full onClick={() => setHire("person")} magnetic>Hire this creator</Button>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-3">
              <Button variant="outline" href={team ? `/teams/${team.id}` : `/people/${lead.id}`}>View team</Button>
              <ConnectButton id={lead.id} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-line bg-surface px-4 py-3"><LikeButton id={p.id} count={p.likes} /><span className="text-small text-mute">{p.views.toLocaleString()} views</span><SaveButton id={p.id} label /></div>
          </aside>
        </div>

        <dl className="mt-12 grid gap-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          {people.slice(0, 2).map((c) => (
            <div key={c.id}><dt className="t-caption mb-3">{c.as}</dt><dd><Link href={`/people/${c.person.id}`} className="group flex items-center gap-3"><Avatar name={c.person.name} tone={c.person.tone} size={38} /><span><span className="block text-body font-medium group-hover:underline">{c.person.name}</span><span className="text-small text-mute">{c.person.role}</span></span></Link></dd></div>
          ))}
          <div><dt className="t-caption mb-3">Client</dt><dd className="text-body font-medium">{p.client}</dd><dd className="text-small text-mute">{p.industry}</dd></div>
          <div><dt className="t-caption mb-3">Duration</dt><dd className="text-body font-medium">{p.duration}</dd><dd className="text-small text-mute">{p.categories.join(" · ")}</dd></div>
        </dl>
      </div>

      <div className="container-x mt-8"><div className="aspect-[16/10] overflow-hidden rounded-sm bg-sunk md:aspect-[16/9]"><ProjectArt art={p.art} palette={p.palette} /></div></div>

      {/* sticky section nav */}
      <div className="sticky top-14 z-30 mt-12 border-b border-line bg-paper/90 backdrop-blur-md md:top-16">
        <div className="container-x no-scrollbar flex gap-1 overflow-x-auto">
          {SECTIONS.map((s) => (<a key={s} href={`#${slug(s)}`} className={`relative shrink-0 px-3 py-3.5 text-small transition-colors ${active === s ? "text-ink" : "text-mute hover:text-ink"}`}>{s}{active === s && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-ink" />}</a>))}
          <a href={`#${slug(SECTIONS[0])}`} className="hidden" />
        </div>
      </div>

      <div className="container-x">
        <section id="overview" data-s="Overview" className="scroll-mt-32 py-16 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12"><div className="t-caption lg:col-span-3">Overview</div><Reveal className="lg:col-span-8"><p className="t-h2 !font-normal">{p.desc}</p><div className="mt-8 flex flex-wrap gap-2">{[...p.categories, ...p.tech].map((s) => <span key={s} className="rounded-xs border border-line px-2.5 py-1 text-small text-mute">{s}</span>)}</div></Reveal></div>
        </section>

        <section id="challenge" data-s="Challenge" className="scroll-mt-32 border-t border-line py-16 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12"><div className="t-caption lg:col-span-3">Challenge</div><Reveal className="lg:col-span-8"><p className="t-h1 !text-[clamp(1.8rem,3.6vw,3rem)] !leading-[1.12]">{p.challenge}</p></Reveal></div>
        </section>

        <section id="process" data-s="Process" className="scroll-mt-32 border-t border-line py-16 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12"><div className="t-caption lg:col-span-3">Process</div>
            <ol className="lg:col-span-8">{p.process.map((s, i) => (<Reveal key={i}><li className="grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7 first:pt-0"><span className="font-mono text-small text-mute">0{i + 1}</span><p className="text-[1.15rem] leading-relaxed">{s}</p></li></Reveal>))}</ol></div>
        </section>
      </div>

      <section id="design" data-s="Design" className="scroll-mt-32 border-t border-line">
        <div className="container-x py-16 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12"><div className="t-caption lg:col-span-3">Design</div><Reveal className="lg:col-span-8"><p className="text-[1.15rem] leading-relaxed">{p.design}</p></Reveal></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7"><Crop p={p} origin="18% 22%" scale={2.2} ratio="aspect-[4/3]" /></Reveal>
            <Reveal className="lg:col-span-5" delay={0.08}><Crop p={p} origin="85% 70%" scale={2.4} ratio="aspect-[4/3] md:aspect-[5/6]" /></Reveal>
            <Reveal className="lg:col-span-12"><div className="grid grid-cols-3 overflow-hidden rounded-sm border border-line">{p.palette.map((c, i) => (<div key={c} className="p-5 md:p-8" style={{ background: c, color: lum(c) < 0.5 ? "#fff" : "#111" }}><div className="mb-10 text-small opacity-70 md:mb-20">{["Base", "Accent", "Surface"][i]}</div><div className="font-mono text-small uppercase">{c}</div></div>))}</div></Reveal>
          </div>
        </div>
      </section>

      <section id="development" data-s="Development" className="scroll-mt-32 border-t border-line">
        <div className="container-x py-16 md:py-28">
          <div className="grid gap-8 lg:grid-cols-12"><div className="t-caption lg:col-span-3">Development</div>
            <div className="lg:col-span-8"><Reveal><p className="text-[1.15rem] leading-relaxed">{p.development}</p></Reveal>
              <Reveal delay={0.06}><div className="mt-10 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2">
                <div className="bg-surface p-6"><div className="t-caption mb-4">Stack</div><div className="flex flex-wrap gap-2">{p.tech.map((t) => <span key={t} className="rounded-xs bg-sunk px-2.5 py-1 font-mono text-small">{t}</span>)}</div></div>
                <div className="bg-surface p-6"><div className="t-caption mb-4">Built by</div>{p.creators.filter((c) => personById(c.id).kind !== "designer" || p.creators.length === 1).slice(0, 2).map((c) => { const x = personById(c.id); return <Link key={c.id} href={`/people/${x.id}`} className="mb-2 flex items-center gap-2.5 last:mb-0 hover:underline"><Avatar name={x.name} tone={x.tone} size={26} /><span className="text-small font-medium">{x.name}</span><span className="text-small text-mute">{c.as}</span></Link>; })}</div>
              </div></Reveal></div></div>
        </div>
      </section>

      <section id="final-product" data-s="Final Product" className="scroll-mt-32 border-t border-line">
        <div className="container-x py-16 md:py-28">
          <div className="t-caption mb-8">Final product</div>
          <Reveal><div className="aspect-[4/3] overflow-hidden rounded-sm bg-sunk md:aspect-[16/9]"><div className="h-full w-full" style={{ transform: "scale(1.02)" }}><ProjectArt art={p.art} palette={p.palette} /></div></div></Reveal>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {["12% 80%", "60% 40%", "90% 15%"].map((o, i) => <Reveal key={o} delay={i * 0.06}><Crop p={p} origin={o} scale={2.6} /></Reveal>)}
          </div>
        </div>
      </section>

      <section id="results" data-s="Results" className="scroll-mt-32 border-t border-line">
        <div className="container-x py-16 md:py-28">
          <div className="t-caption mb-10">Results</div>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {p.results.map((r) => {
              const m = r.v.match(/^([+−-]?)([\d.,]+)(.*)$/);
              return (<div key={r.l} className="bg-paper p-6 md:p-8"><div className="t-h1 !text-[clamp(2rem,3.4vw,3rem)]">{m ? <Counter to={parseFloat(m[2].replace(/,/g, ""))} prefix={m[1]} suffix={m[3]} decimals={m[2].includes(".") ? (m[2].split(".")[1]?.length ?? 0) : 0} /> : r.v}</div><div className="mt-2 text-small text-mute">{r.l}</div></div>);
            })}
          </div>
          {review && (
            <Reveal><figure className="mt-16 grid gap-6 lg:grid-cols-12"><Quote className="h-8 w-8 text-hi lg:col-span-1" /><div className="lg:col-span-8"><blockquote className="t-h2 !font-normal">“{review.text}”</blockquote><figcaption className="mt-6 flex items-center gap-3"><Avatar name={review.by} size={36} /><div className="text-small"><div className="font-medium">{review.by}</div><div className="text-mute">{review.role}</div></div><Stars value={review.rating} /></figcaption></div></figure></Reveal>
          )}
        </div>
      </section>

      {/* hiring CTA */}
      <section className="container-x">
        <div className="relative overflow-hidden rounded-lg grad-midnight px-6 py-14 text-praxeti md:px-14 md:py-20">
          <div className="t-eyebrow mb-5 !text-spring">From portfolio to project</div>
          <h2 className="t-h1 max-w-2xl">Want to build something similar?</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/people?group=Design" variant="accent" size="lg" magnetic>Find a Designer</Button>
            <Button href="/people?group=Development" size="lg" variant="outline" className="!border-praxeti/30 !bg-transparent !text-praxeti hover:!border-praxeti" magnetic>Find a Developer</Button>
            <Button size="lg" variant="outline" className="!border-praxeti/30 !bg-transparent !text-praxeti hover:!border-praxeti" magnetic onClick={() => setHire(team ? "team" : "person")}>Hire this Team</Button>
          </div>
        </div>
      </section>

      <section className="container-x mt-24">
        <SectionHead title="More like this" action={<Link href="/discover" className="inline-flex items-center gap-1 text-body underline-link">All work <ArrowUpRight className="h-4 w-4" /></Link>} />
        <div className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-3">{related.map((r, i) => <ProjectCard key={r.id} project={r} index={i} />)}</div>
      </section>

      <HireModal key={hire ?? "none"} open={!!hire} onClose={() => setHire(null)} target={hire === "team" && team ? { kind: "team", id: team.id, name: team.name, tone: team.tone, sub: team.tagline, project: `${p.name}-style project` } : { kind: "person", id: lead.id, name: lead.name, tone: lead.tone, sub: lead.role, project: `${p.name}-style project` }} />
    </div>
  );
}
