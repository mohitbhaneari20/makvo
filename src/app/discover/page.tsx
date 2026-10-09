"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { CATEGORIES, PROJECTS } from "@/data/projects";
import { personById } from "@/data/people";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ProjectArt } from "@/components/art/ProjectArt";
import { Chip, Empty, Skeleton, useFakeLoad } from "@/components/ui/Misc";
import { Select } from "@/components/ui/Dropdown";
import { SubNav, DISCOVER_NAV } from "@/components/shell/SubNav";
import { Verified } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { LikeButton, SaveButton } from "@/components/ui/Actions";

const uniq = (f: (p: (typeof PROJECTS)[number]) => string | string[]) => Array.from(new Set(PROJECTS.flatMap((p) => [f(p)].flat()))).sort();
const TECH = uniq((p) => p.tech), INDUSTRY = uniq((p) => p.industry), STYLE = uniq((p) => p.style);

export default function Discover() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [tech, setTech] = useState(""); const [ind, setInd] = useState(""); const [style, setStyle] = useState("");
  const loading = useFakeLoad([cat, tech, ind, style], 520);

  const list = useMemo(() => PROJECTS.filter((p) => (cat === "All" || p.categories.includes(cat as never)) && (!tech || p.tech.includes(tech)) && (!ind || p.industry === ind) && (!style || p.style === style)), [cat, tech, ind, style]);
  const filtered = cat !== "All" || tech || ind || style;
  const feature = !filtered && list[0];
  const rest = feature ? list.slice(1) : list;
  const clear = () => { setCat("All"); setTech(""); setInd(""); setStyle(""); };

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-5"><SubNav items={DISCOVER_NAV} id="discover" /></div>
          <h1 className="t-h1">Discover great work</h1>
          <p className="mt-3 max-w-lg text-body text-mute">Finished projects from people you can actually hire. Every piece links back to the team who made it.</p>
        </div>
        <div className="text-small text-mute tabular-nums">{list.length} {list.length === 1 ? "project" : "projects"}</div>
      </div>

      <div className="sticky top-14 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5">
          <Select label="Technology" value={tech} options={TECH} onChange={setTech} />
          <Select label="Industry" value={ind} options={INDUSTRY} onChange={setInd} />
          <Select label="Style" value={style} options={STYLE} onChange={setStyle} />
          {filtered && <button onClick={clear} className="inline-flex h-9 shrink-0 items-center gap-1 px-2 text-small text-mute hover:text-ink"><X className="h-3.5 w-3.5" />Clear</button>}
        </div>
      </div>

      <div className="mt-8 md:mt-10">
        {loading ? (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (<div key={i}><Skeleton className="aspect-[4/3] w-full !rounded-sm" /><Skeleton className="mt-4 h-5 w-2/3" /><Skeleton className="mt-2 h-4 w-full" /><Skeleton className="mt-4 h-6 w-1/3" /></div>))}
          </div>
        ) : list.length === 0 ? (
          <Empty title="No projects match yet" sub="Try a different mix of filters, or clear them to see everything." action={<Button variant="outline" onClick={clear}>Clear filters</Button>} />
        ) : (
          <AnimatePresence mode="popLayout">
            {feature && (
              <motion.div key="feature" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-14 grid gap-6 lg:grid-cols-12 md:gap-8">
                <Link href={`/work/${feature.id}`} data-cursor="View" className="group relative block overflow-hidden rounded-sm bg-sunk lg:col-span-8">
                  <div className="aspect-[4/3] md:aspect-[16/10]"><div className="h-full w-full transition-transform duration-[1000ms] group-hover:scale-[1.04]"><ProjectArt art={feature.art} palette={feature.palette} /></div></div>
                  <div className="absolute left-3 top-3"><Verified compact /></div>
                </Link>
                <div className="flex flex-col justify-between lg:col-span-4">
                  <div>
                    <div className="t-caption mb-4">Featured · {feature.kind}</div>
                    <Link href={`/work/${feature.id}`}><h2 className="t-h1 hover:text-hi transition-colors">{feature.name}</h2></Link>
                    <p className="mt-2 text-h3 font-normal text-mute">{feature.tagline}</p>
                    <p className="mt-5 text-body text-mute">{feature.desc}</p>
                  </div>
                  <div className="mt-8">
                    <div className="space-y-3">
                      {feature.creators.slice(0, 3).map((c) => { const p = personById(c.id); return (
                        <Link key={c.id} href={`/people/${p.id}`} className="flex items-center gap-3 group/p"><Avatar name={p.name} tone={p.tone} size={34} /><div className="text-small"><div className="font-medium group-hover/p:underline">{p.name}</div><div className="text-mute">{c.as}</div></div></Link>
                      ); })}
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-4"><Button href={`/work/${feature.id}`} iconRight={<ArrowUpRight className="h-4 w-4" />}>Read case study</Button><LikeButton id={feature.id} count={feature.likes} /><SaveButton id={feature.id} /></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3" key={`${cat}${tech}${ind}${style}`}>
              {rest.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
