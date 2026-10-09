"use client";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass, Hammer, Handshake, Search, UsersRound } from "lucide-react";
import { Arches } from "@/components/art/Arches";
import { portraitTall } from "@/data/photos";
import { useApp } from "@/lib/store";
import { PROJECTS, projectById } from "@/data/projects";
import { PEOPLE, personById } from "@/data/people";
import { JOBS, fmtBudget } from "@/data/jobs";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Button } from "@/components/ui/Button";
import { Counter, Reveal, SectionHead } from "@/components/ui/Misc";
import { Avatar } from "@/components/ui/Avatar";
import { Verified } from "@/components/ui/Badge";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { PersonCard } from "@/components/cards/PersonCard";
import { BRAND } from "@/lib/brand";

const words = ["Discover", "people", "who", "build", "things."];

function Tile({ id, className = "", ratio = "aspect-[4/5]" }: { id: string; className?: string; ratio?: string }) {
  const p = projectById(id);
  return (
    <Link href={`/work/${id}`} data-cursor="View" className={`group relative block overflow-hidden rounded-sm bg-sunk ${ratio} ${className}`}>
      <div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.05]"><ProjectArt art={p.art} palette={p.palette} /></div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-small font-medium">{p.name} — {p.kind}</span><ArrowUpRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

const STEPS = [
  { n: "01", t: "Discover", d: "Browse real, finished work. See who made it, how they think and what it did for the client.", icon: Compass, href: "/discover", cta: "Explore work" },
  { n: "02", t: "Connect", d: "Follow the people whose work you like. Send a note, share a project, start a conversation.", icon: UsersRound, href: "/people", cta: "Find people" },
  { n: "03", t: "Hire", d: "Post a brief or invite someone directly. Interview on a call, compare, decide.", icon: Handshake, href: "/talent", cta: "Find talent" },
  { n: "04", t: "Build", d: "Work in a shared project space. When it ships, it becomes verified portfolio work.", icon: Hammer, href: "/projects/finora-website", cta: "See a workspace" },
];

export default function Landing() {
  const { setSearchOpen } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 90]);
  const y3 = useTransform(scrollYProgress, [0, 1], [90, -30]);

  return (
    <div>
      {/* HERO · dark web */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full grad-glow opacity-40 blur-2xl" />
        <div className="container-x relative grid gap-12 pb-6 pt-12 md:grid-cols-12 md:pt-20">
          <div className="md:col-span-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="t-eyebrow mb-7">For designers, developers, creators &amp; studios</motion.div>
            <h1 className="t-display max-w-[14ch] md:max-w-[11ch]" aria-label="Discover people who build things.">
              {words.map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                  <motion.span className={`inline-block ${w === "build" ? "text-hi" : ""}`} initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.2, 0.7, 0.2, 1] }}>{w}</motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }} className="mt-8 max-w-xl text-[1.15rem] leading-relaxed text-mute md:text-[1.3rem]">
              A professional network where designers, developers, creators and studios showcase their work, connect with each other, and get hired.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="mt-9 flex flex-wrap gap-3">
              <Button href="/discover" size="lg" magnetic iconRight={<ArrowRight className="h-4 w-4" />}>Explore Work</Button>
              <Button href="/talent" size="lg" variant="outline" magnetic>Find Talent</Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="mt-10 max-w-xl">
              <button onClick={() => setSearchOpen(true)} className="flex h-14 w-full items-center gap-3 rounded-full border border-line bg-surface pl-5 pr-1.5 text-left text-body text-mute transition hover:border-ink/40">
                <Search className="h-4 w-4" /><span className="flex-1">Search makers, work, roles</span>
                <span className="rounded-full bg-spring px-5 py-2.5 text-small font-medium text-midnight">Search</span>
              </button>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Branding", "UI/UX", "Motion", "React", "3D"].map((c) => <Link key={c} href="/discover" className="rounded-full border border-ink/20 px-4 py-1.5 text-small transition hover:border-ink">{c}</Link>)}
              </div>
            </motion.div>
          </div>
          <div className="h-64 sm:h-80 md:hidden">
            <Arches colors={["#1E488F", "#00804C"]} images={[portraitTall("Ana Ruiz"), portraitTall("Varun Sharma")]} heights={[72, 100]} className="mx-auto max-w-[240px] pt-10" />
          </div>
          <div className="hidden h-[440px] md:col-span-4 md:block">
            <Arches colors={["#1E488F", "#00804C"]} images={[portraitTall("Ana Ruiz"), portraitTall("Varun Sharma")]} heights={[72, 100]} className="mx-auto max-w-[340px] pt-16" />
          </div>
        </div>
      </section>

      {/* COLLAGE */}
      <section ref={ref} className="container-x mt-16 md:mt-24">
        <div className="snap-row -mx-5 px-5 md:hidden">
          {["finora", "lumen", "noma", "orbit", "arc"].map((id) => <Tile key={id} id={id} className="w-[78vw]" />)}
        </div>
        <div className="hidden grid-cols-12 items-start gap-5 md:grid">
          <motion.div style={{ y: y1 }} className="col-span-4 space-y-5"><Tile id="finora" ratio="aspect-[4/5]" /><Tile id="mono" ratio="aspect-[4/3]" /></motion.div>
          <motion.div style={{ y: y2 }} className="col-span-4 space-y-5 pt-24"><Tile id="lumen" ratio="aspect-[3/4]" /><Tile id="forma" ratio="aspect-[4/3]" /></motion.div>
          <motion.div style={{ y: y3 }} className="col-span-4 space-y-5"><Tile id="noma" ratio="aspect-[4/3]" /><Tile id="arc" ratio="aspect-[4/5]" /></motion.div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className="container-x mt-32 md:mt-52">
        <Reveal><div className="t-caption mb-6">The idea</div></Reveal>
        <Reveal delay={0.05}><p className="max-w-[22ch] text-[1.6rem] font-medium leading-[1.2] tracking-[-0.025em] sm:text-[2rem] md:max-w-4xl md:text-h1">A CV says what you did. <span className="text-mute">Your work shows how you think.</span> On {BRAND.name}, people are found through what they’ve built, and every project links back to the people who made it.</p></Reveal>
      </section>

      {/* STEPS */}
      <section className="container-x mt-24 md:mt-40">
        <SectionHead eyebrow="How it works" title="Discover, connect, hire, build." />
        <div className="mt-12 grid border-y border-line md:grid-cols-4">
          {STEPS.map((s) => (
            <Reveal key={s.n} className="h-full border-b border-line last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <Link href={s.href} className="group flex h-full flex-col p-6 transition-colors hover:bg-surface md:p-8">
                <div className="flex items-start justify-between"><span className="font-mono text-small text-mute">{s.n}</span><s.icon className="h-5 w-5 text-mute transition-colors group-hover:text-hi" strokeWidth={1.5} /></div>
                <h3 className="mt-10 text-[2rem] font-medium leading-none tracking-[-0.03em] md:mt-16 md:text-[2.6rem]">{s.t}</h3>
                <p className="mt-3 text-body text-mute">{s.d}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-small font-medium">{s.cta}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LOOP: person → work → opportunity */}
      <section className="container-x mt-24 md:mt-40">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal><div className="t-caption mb-4">Everything connects</div></Reveal>
            <Reveal delay={0.05}><h2 className="t-h1">Work leads to people. People lead to projects.</h2></Reveal>
            <Reveal delay={0.1}><p className="mt-6 max-w-md text-body text-mute">Open a case study and you can meet the designer, see the developer, read the client’s review and ask them to build something similar. A finished project becomes part of their reputation.</p></Reveal>
            <Reveal delay={0.15}><div className="mt-8 flex gap-3"><Button href="/work/finora" variant="outline" iconRight={<ArrowRight className="h-4 w-4" />}>Open a case study</Button></div></Reveal>
          </div>
          <Reveal className="md:col-span-7" delay={0.1}>
            <div className="relative rounded-md border border-line bg-surface p-4 shadow-soft md:p-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xs"><ProjectArt art="fintech" palette={projectById("finora").palette} /><div className="absolute left-3 top-3"><Verified /></div></div>
              <div className="mt-5 grid gap-5 md:grid-cols-3">
                <div><div className="t-caption mb-2">Designed by</div><div className="flex items-center gap-2.5"><Avatar name="Varun Sharma" tone="#E9C8B0" size={32} /><div className="text-small"><div className="font-medium">Varun Sharma</div><div className="text-mute">Available</div></div></div></div>
                <div><div className="t-caption mb-2">Developed by</div><div className="flex items-center gap-2.5"><Avatar name="Rahul Mehta" tone="#BFD3E6" size={32} /><div className="text-small"><div className="font-medium">Rahul Mehta</div><div className="text-mute">Available</div></div></div></div>
                <div><div className="t-caption mb-2">Result</div><div className="text-h3">+38% trial to paid</div></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5"><span className="text-small text-mute">Want to build something similar?</span><span className="rounded-full bg-spring px-4 py-2 text-small font-medium text-midnight">Hire this team</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="container-x mt-24 md:mt-40">
        <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line md:grid-cols-4">
          {[{ v: 12480, l: "Portfolios published", s: "" }, { v: 3.2, l: "Median days to first reply", s: "", d: 1 }, { v: 94, l: "Projects hired through work", s: "%" }, { v: 8.4, l: "Million in verified projects", s: "M", p: "$", d: 1 }].map((x) => (
            <div key={x.l} className="bg-paper p-6 md:p-8"><div className="t-h1"><Counter to={x.v} suffix={x.s} prefix={x.p} decimals={x.d ?? 0} /></div><div className="mt-2 text-small text-mute">{x.l}</div></div>
          ))}
        </div>
      </section>

      {/* FEATURED WORK */}
      <section className="container-x mt-24 md:mt-40">
        <SectionHead eyebrow="Recently published" title="Work worth a closer look." action={<Link href="/discover" className="hidden items-center gap-1.5 text-body underline-link md:inline-flex">See all work <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.filter((p) => ["orbit", "arc", "forma"].includes(p.id)).map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </section>

      {/* PEOPLE */}
      <section className="container-x mt-24 md:mt-40">
        <SectionHead eyebrow="People" title="Find people worth working with." action={<Link href="/people" className="hidden items-center gap-1.5 text-body underline-link md:inline-flex">Browse everyone <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="snap-row -mx-5 mt-10 px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {["varun-sharma", "rahul-mehta", "aiko-tanaka"].map((id, i) => <div key={id} className="w-[82vw] md:w-auto"><PersonCard person={personById(id)} index={i} /></div>)}
        </div>
      </section>

      {/* JOB TEASER */}
      <section className="container-x mt-24 md:mt-40">
        <SectionHead eyebrow="Opportunities" title="Your next project might be here." action={<Link href="/opportunities" className="hidden items-center gap-1.5 text-body underline-link md:inline-flex">All opportunities <ArrowRight className="h-4 w-4" /></Link>} />
        <div className="mt-8">
          {JOBS.slice(0, 3).map((j) => (
            <Link key={j.id} href={`/opportunities/${j.id}`} data-cursor="Open" className="group grid grid-cols-12 items-center gap-4 border-t border-line py-6 last:border-b">
              <div className="col-span-12 md:col-span-6"><div className="t-h3 transition-transform group-hover:translate-x-1">{j.title}</div><div className="text-small text-mute">{j.client} · {j.posted}</div></div>
              <div className="col-span-6 text-body tabular-nums md:col-span-3">{fmtBudget(j.budget)} <span className="text-mute">· {j.timeline}</span></div>
              <div className="col-span-6 text-right text-body font-medium text-hi md:col-span-3">{j.match}% match</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA · campaign block, Midnight on Spring */}
      <section className="container-x mt-24 md:mt-40">
        <div className="relative grid overflow-hidden rounded-lg bg-spring text-midnight md:grid-cols-12">
          <div className="px-6 py-14 md:col-span-7 md:px-14 md:py-20">
            <div className="font-mono text-[12px] uppercase tracking-[0.1em]">{BRAND.name} · @makvo</div>
            <h2 className="t-display mt-6 !text-[clamp(2.6rem,6.5vw,5.6rem)]">Show the work.<br /><span className="text-forest">Get hired.</span></h2>
            <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-midnight/80">Flip one switch and studios looking for your skills find you first.</p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-midnight py-1.5 pl-1.5 pr-4 text-praxeti">
              <span className="flex shrink-0 rounded-full ring-2 ring-spring"><Avatar name="Ana Ruiz" size={36} /></span><span className="text-small font-medium">Open to work</span>
              <span className="relative ml-2 h-5 w-9 rounded-full bg-spring"><span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-midnight" /></span>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/people/varun-sharma" className="inline-flex h-12 items-center rounded-full bg-midnight px-7 text-body font-medium text-spring transition hover:opacity-90">See a profile</Link>
              <Link href="/opportunities" className="inline-flex h-12 items-center rounded-full border border-midnight/30 px-7 text-body font-medium transition hover:border-midnight">Looking for someone to build this?</Link>
            </div>
          </div>
          <div className="relative min-h-[260px] md:col-span-5">
            <Arches colors={["#001F3F", "#001F3F"]} spark="#00804C" sparkAt={1} heights={[78, 64]} className="absolute inset-x-6 bottom-0 top-16 md:inset-x-10" />
          </div>
        </div>
      </section>

      {/* Profile-cover band */}
      <section className="container-x mt-6">
        <div className="relative h-56 overflow-hidden rounded-lg bg-midnight ring-1 ring-line md:h-72">
          <div className="absolute inset-y-0 right-0 w-[58%] max-w-[620px] px-4 md:w-full md:px-6"><Arches colors={["#1E488F", "#00804C", "#74C365", "#DBE64C"]} images={[portraitTall("Aiko Tanaka"), null, portraitTall("Diego Ramos"), null]} spark="#F6F7ED" sparkAt={3} heights={[62, 74, 86, 100]} className="pt-10" /></div>
          <div className="relative flex h-full flex-col justify-end p-6 md:p-10"><div className="font-mono text-[11px] uppercase tracking-[0.1em] text-spring">Made on {BRAND.name}</div><div className="mt-2 max-w-xs text-h2 text-praxeti">Discover people who build things.</div></div>
        </div>
      </section>
    </div>
  );
}
