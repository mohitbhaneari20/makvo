"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";
import { personById } from "@/data/people";
import type { Project } from "@/data/types";
import { ProjectArt } from "@/components/art/ProjectArt";
import { AvatarStack } from "@/components/ui/Avatar";
import { Verified } from "@/components/ui/Badge";
import { LikeButton, SaveButton } from "@/components/ui/Actions";

export function ProjectCard({ project: p, size = "md", showSkills = true, index = 0 }: { project: Project; size?: "md" | "lg" | "sm"; showSkills?: boolean; index?: number }) {
  const people = p.creators.map((c) => personById(c.id));
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -24px 0px", amount: 0.01 }} transition={{ duration: 0.35, delay: (index % 3) * 0.03 }} className="group">
      <Link href={`/work/${p.id}`} className="block" data-cursor="View">
        <div className={`relative overflow-hidden rounded-sm bg-sunk ${size === "lg" ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
          <div className="h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045]">
            <ProjectArt art={p.art} palette={p.palette} />
          </div>
          <div className="absolute left-3 top-3">{p.verified && <Verified compact />}</div>
          <div className="absolute right-3 top-3"><SaveButton id={p.id} overlay /></div>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className={`${size === "sm" ? "text-body font-medium" : "t-h3"} truncate`}>{p.name} <span className="font-normal text-mute">— {p.kind}</span></h3>
            <p className="mt-1 line-clamp-2 text-small text-mute">{p.desc}</p>
          </div>
          <LikeButton id={p.id} count={p.likes} className="mt-1 shrink-0" />
        </div>
        <div className="mt-3 flex items-center gap-2.5">
          <AvatarStack people={people.slice(0, 3)} size={24} />
          <span className="truncate text-small text-ink">{people.map((x) => x.name.split(" ")[0]).join(", ")}</span>
        </div>
        {showSkills && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[...p.categories.slice(0, 2), ...p.tech.slice(0, 1)].map((s) => (<span key={s} className="rounded-xs border border-line px-2 py-0.5 text-[11px] text-mute">{s}</span>))}
          </div>
        )}
      </Link>
    </motion.article>
  );
}

export function ProjectThumb({ id }: { id: string }) {
  const p = PROJECTS.find((x) => x.id === id)!;
  return (
    <Link href={`/work/${p.id}`} className="group block" data-cursor="View">
      <div className="aspect-[4/3] overflow-hidden rounded-sm bg-sunk">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-105"><ProjectArt art={p.art} palette={p.palette} /></div>
      </div>
      <div className="mt-2 flex items-center justify-between"><span className="text-small font-medium">{p.name}</span><span className="text-[11px] text-mute">{p.kind}</span></div>
    </Link>
  );
}
