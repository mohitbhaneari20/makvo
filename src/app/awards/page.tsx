"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Trophy } from "lucide-react";
import { personById } from "@/data/people";
import { teamById } from "@/data/teams";
import { CRITERIA, DEV_AWARD_MIN, ENTRIES, HONORABLE, JURY, SOTD, SOTM, VOTE_SEED, YEAR_AWARDS, entryFor, overall, projectOf, standings, type Entry, type YearAward } from "@/data/awards";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip, Reveal, SectionHead } from "@/components/ui/Misc";
import { useApp } from "@/lib/store";

const SECTIONS = [["today", "Site of the Day"], ["year", "Awards of the Year"], ["archive", "This week"], ["rankings", "Rankings"], ["vote", "People’s Choice"], ["jury", "Jury"]] as const;
const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Bars({ e, dark }: { e: Entry; dark?: boolean }) {
  return (
    <div className="space-y-3">
      {CRITERIA.map((c) => (
        <div key={c.key}>
          <div className="flex justify-between text-small"><span>{c.label} <span className={dark ? "text-paper/50" : "text-faint"}>{c.weight}%</span></span><span className="font-medium tabular-nums">{e[c.key].toFixed(1)}</span></div>
          <div className={`mt-1.5 h-1 ${dark ? "bg-paper/15" : "bg-sunk"}`}><motion.div initial={{ width: 0 }} whileInView={{ width: `${e[c.key] * 10}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }} className="h-full grad-spring" /></div>
        </div>
      ))}
    </div>
  );
}

function Crew({ projectId, light }: { projectId: string; light?: boolean }) {
  return (
    <div className="space-y-2.5">
      {projectOf(projectId).creators.map((c) => { const p = personById(c.id); return (
        <Link key={c.id} href={`/people/${p.id}`} className="group/p flex items-center gap-3">
          <Avatar name={p.name} tone={p.tone} size={32} />
          <div className="text-small"><div className="font-medium group-hover/p:underline">{p.name}</div><div className={light ? "text-paper/60" : "text-mute"}>{c.as}</div></div>
        </Link>
      ); })}
    </div>
  );
}

function Today() {
  const d = SOTD[0]; const p = projectOf(d.projectId); const e = entryFor(p.id)!;
  return (
    <section id="today" className="scroll-mt-32">
      <div className="grid overflow-hidden rounded-lg grad-midnight text-praxeti lg:grid-cols-12">
        <Link href={`/work/${p.id}`} data-cursor="View" className="group relative block lg:col-span-7">
          <div className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[520px]"><div className="h-full w-full transition-transform duration-[1000ms] group-hover:scale-[1.03]"><ProjectArt art={p.art} palette={p.palette} /></div></div>
          <div className="absolute left-4 top-4 flex gap-2"><Badge tone="accent" className="!bg-accent !text-accent-ink"><Trophy className="h-3 w-3" />Site of the Day</Badge>{e.dev >= DEV_AWARD_MIN && <Badge tone="ink" className="!bg-paper !text-ink">Developer Award</Badge>}</div>
        </Link>
        <div className="flex flex-col justify-between gap-8 p-6 lg:col-span-5 md:p-9">
          <div>
            <div className="t-caption !text-paper/60">{d.date} 2026 · {p.kind}</div>
            <Link href={`/work/${p.id}`}><h2 className="t-h1 mt-4 hover:text-spring">{p.name}</h2></Link>
            <p className="mt-3 text-body text-paper/70">{p.tagline}. {p.desc}</p>
          </div>
          <div className="flex items-end justify-between gap-4 border-y border-paper/15 py-5">
            <div><div className="t-caption !text-paper/60">Overall score</div><div className="mt-1 text-[3.5rem] font-medium leading-none tracking-[-0.04em] tabular-nums">{overall(e).toFixed(2)}</div></div>
            <div className="text-right"><div className="t-caption !text-paper/60">Developer</div><div className="mt-1 text-h2 tabular-nums">{e.dev.toFixed(1)}</div></div>
          </div>
          <Bars e={e} dark />
          <Crew projectId={p.id} light />
          <Button href={`/work/${p.id}`} variant="accent" iconRight={<ArrowUpRight className="h-4 w-4" />}>Read case study</Button>
        </div>
      </div>
    </section>
  );
}

function YearCard({ a, i }: { a: YearAward; i: number }) {
  const team = a.kind === "team";
  const w = team ? teamById(a.winner) : personById(a.winner);
  const href = team ? `/teams/${a.winner}` : `/people/${a.winner}`;
  const sub = team ? (w as ReturnType<typeof teamById>).tagline : (w as ReturnType<typeof personById>).role;
  return (
    <Reveal delay={(i % 2) * 0.08}>
      <article className="flex h-full flex-col rounded-md border border-line bg-surface p-6 md:p-8">
        <div className="flex items-center justify-between"><span className="t-caption">{a.title}</span><span className="t-caption !text-hi">2026</span></div>
        <Link href={href} className="group mt-6 flex items-center gap-4">
          <Avatar name={w.name} tone={w.tone} size={64} square={team} />
          <div><h3 className="t-h2 group-hover:text-hi transition-colors">{w.name}</h3><div className="text-small text-mute">{sub}</div></div>
        </Link>
        <p className="mt-5 text-body text-mute">{a.citation}</p>
        <div className="mt-6 grid grid-cols-2 gap-px bg-line">{a.stat.map((s) => <div key={s.l} className="bg-surface py-3 pr-3"><div className="text-h3 tabular-nums">{s.v}</div><div className="text-small text-mute">{s.l}</div></div>)}</div>
        <div className="mt-auto flex items-center gap-3 pt-6">
          <span className="t-caption">Finalists</span>
          <div className="flex flex-wrap gap-x-4 gap-y-1">{a.finalists.map((id) => { const f = team ? teamById(id) : personById(id); return <Link key={id} href={team ? `/teams/${id}` : `/people/${id}`} className="text-small underline-link">{f.name}</Link>; })}</div>
        </div>
      </article>
    </Reveal>
  );
}

function Archive() {
  return (
    <div className="border-t border-line">
      {SOTD.map((d, i) => {
        const p = projectOf(d.projectId); const e = entryFor(p.id)!;
        const month = SOTM.projectId === p.id;
        return (
          <Reveal key={d.date} delay={i * 0.03} y={10}>
            <Link href={`/work/${p.id}`} data-cursor="View" className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b border-line py-4 transition-colors hover:bg-surface md:grid-cols-[110px_120px_1fr_1fr_auto] md:gap-6 md:px-2">
              <span className="font-mono text-small text-mute">{d.date}</span>
              <div className="hidden aspect-[4/3] overflow-hidden rounded-xs md:block"><ProjectArt art={p.art} palette={p.palette} /></div>
              <div className="min-w-0"><div className="t-h3 truncate group-hover:text-hi transition-colors">{p.name}</div><div className="truncate text-small text-mute">{p.kind}</div></div>
              <div className="hidden items-center gap-1.5 md:flex">{projectOf(p.id).creators.map((c) => { const pe = personById(c.id); return <span key={c.id} title={pe.name}><Avatar name={pe.name} tone={pe.tone} size={28} /></span>; })}</div>
              <div className="flex items-center gap-3">
                <div className="hidden gap-1.5 sm:flex">{month && <Badge tone="ink">Site of the Month</Badge>}{e.dev >= DEV_AWARD_MIN && <Badge tone="accent">Dev Award</Badge>}{HONORABLE.includes(p.id) && <Badge tone="outline">Honorable</Badge>}</div>
                <span className="w-12 text-right text-h3 tabular-nums">{overall(e).toFixed(2)}</span>
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}

function Board({ title, side }: { title: string; side: "design" | "dev" }) {
  const rows = standings(side); const top = rows[0]?.points || 1;
  return (
    <div>
      <div className="t-caption mb-4">{title}</div>
      <ol className="border-t border-line">
        {rows.map((r, i) => { const p = personById(r.id); return (
          <li key={r.id} className="border-b border-line">
            <Link href={`/people/${p.id}`} className="group flex items-center gap-4 py-3.5">
              <span className="w-5 font-mono text-small text-faint">{i + 1}</span>
              <Avatar name={p.name} tone={p.tone} size={36} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3"><span className="truncate font-medium group-hover:underline">{p.name}</span><span className="tabular-nums text-small">{r.points} pts</span></div>
                <div className="mt-1.5 h-0.5 bg-sunk"><div className="h-full bg-ink" style={{ width: `${(r.points / top) * 100}%` }} /></div>
                <div className="mt-1.5 truncate text-small text-mute">{p.role} · {r.wins.length} {r.wins.length === 1 ? "award" : "awards"}</div>
              </div>
            </Link>
          </li>
        ); })}
      </ol>
    </div>
  );
}

function Vote() {
  const { toast } = useApp();
  const [mine, setMine] = useState<string | null>(null);
  const counts = Object.fromEntries(Object.entries(VOTE_SEED).map(([k, v]) => [k, v + (mine === k ? 1 : 0)]));
  const ranked = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  const top = counts[ranked[0]];
  const cast = (id: string) => { setMine(id === mine ? null : id); toast(id === mine ? "Vote removed" : `Voted for ${projectOf(id).name}`, id === mine ? "default" : "ok"); };
  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
      {ranked.map((id, i) => { const p = projectOf(id); const on = mine === id; return (
        <div key={id}>
          <Link href={`/work/${id}`} data-cursor="View" className="group relative block overflow-hidden rounded-sm bg-sunk">
            <div className="aspect-[4/3]"><div className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.04]"><ProjectArt art={p.art} palette={p.palette} /></div></div>
            <span className="absolute left-3 top-3 rounded-xs bg-paper px-2 py-1 font-mono text-[11px]">#{i + 1}</span>
          </Link>
          <div className="mt-3 flex items-baseline justify-between"><h3 className="text-h3">{p.name}</h3><span className="text-small tabular-nums text-mute">{counts[id].toLocaleString()} votes</span></div>
          <div className="mt-2 h-1 bg-sunk"><div className="h-full grad-spring transition-[width] duration-500" style={{ width: `${(counts[id] / top) * 100}%` }} /></div>
          <Button size="sm" variant={on ? "primary" : "outline"} full className="mt-3" onClick={() => cast(id)} icon={on ? <Check className="h-3.5 w-3.5" /> : undefined}>{on ? "Your vote" : mine ? "Switch vote" : "Vote"}</Button>
        </div>
      ); })}
    </div>
  );
}

export default function Awards() {
  const { toast } = useApp();
  const [active, setActive] = useState<string>("today");
  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="t-caption mb-5">The 2026 Awards</div>
          <h1 className="t-h1 max-w-[16ch]">The best work, scored by people who build.</h1>
          <p className="mt-4 max-w-xl text-body text-mute">Every day the jury picks one finished project. Each is scored on design, usability, creativity and content, with a separate score for the build. The year ends with awards for designers, developers and studios.</p>
        </div>
        <Button variant="outline" onClick={() => toast("Submissions for the 2027 awards open on 1 Nov")}>Submit your work</Button>
      </div>

      <div className="sticky top-14 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{SECTIONS.map(([id, label]) => <Chip key={id} active={active === id} onClick={() => { setActive(id); go(id); }}>{label}</Chip>)}</div>
      </div>

      <div className="mt-8 space-y-24 md:mt-10 md:space-y-32">
        <Today />

        <section id="year" className="scroll-mt-32">
          <SectionHead eyebrow="Awards of the Year" title="Designer, developer and studio" className="mb-8" />
          <div className="grid gap-5 md:grid-cols-2">{YEAR_AWARDS.map((a, i) => <YearCard key={a.id} a={a} i={i} />)}</div>
        </section>

        <section id="archive" className="scroll-mt-32">
          <SectionHead eyebrow="Site of the Day" title="This week’s winners" className="mb-8" />
          <Archive />
        </section>

        <section id="rankings" className="scroll-mt-32">
          <SectionHead eyebrow="Rankings" title="Most awarded this season" className="mb-3" />
          <p className="mb-8 max-w-xl text-small text-mute">Points: Site of the Month 25, Site of the Day 10, Developer Award 8, Honorable Mention 3. Creators share the points of every project they worked on. The Awards of the Year are chosen by the jury, so the winners are not always the top scorers here.</p>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16"><Board title="Designers" side="design" /><Board title="Developers" side="dev" /></div>
        </section>

        <section id="vote" className="scroll-mt-32">
          <SectionHead eyebrow="People’s Choice" title="Cast your vote" className="mb-3" />
          <p className="mb-8 max-w-xl text-small text-mute">One vote each, and you can change it until voting closes on 31 Oct. The public vote is separate from the jury score.</p>
          <Vote />
        </section>

        <section id="jury" className="scroll-mt-32">
          <SectionHead eyebrow="The jury" title="How work is judged" className="mb-8" />
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="border-t border-line">{CRITERIA.map((c) => (
                <div key={c.key} className="flex items-start justify-between gap-6 border-b border-line py-4"><div><div className="font-medium">{c.label}</div><div className="text-small text-mute">{c.blurb}</div></div><div className="text-h2 tabular-nums">{c.weight}<span className="text-small text-mute">%</span></div></div>
              ))}</div>
              <p className="mt-4 text-small text-mute">A project scoring {DEV_AWARD_MIN.toFixed(1)} or more for its build earns the Developer Award.</p>
            </div>
            <div className="grid content-start gap-x-6 gap-y-6 sm:grid-cols-2 lg:col-span-7">
              {JURY.map((j) => <div key={j.name} className="flex items-center gap-3"><Avatar name={j.name} tone={j.tone} size={48} /><div><div className="font-medium">{j.name}</div><div className="text-small text-mute">{j.role}, {j.org}</div></div></div>)}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
