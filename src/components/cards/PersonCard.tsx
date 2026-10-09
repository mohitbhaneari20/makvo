"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import type { Person } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { ProjectArt } from "@/components/art/ProjectArt";
import { ConnectButton } from "@/components/ui/Actions";
import { Button } from "@/components/ui/Button";

export function PersonCard({ person: p, index = 0, match }: { person: Person; index?: number; match?: number }) {
  const works = p.projects.slice(0, 3).map((id) => PROJECTS.find((x) => x.id === id)!).filter(Boolean);
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -24px 0px", amount: 0.01 }} transition={{ duration: 0.35, delay: (index % 3) * 0.03 }}
      className="group flex flex-col rounded-sm border border-line bg-surface transition-[border-color,box-shadow] duration-300 hover:border-ink/40 hover:shadow-soft">
      <Link href={`/people/${p.id}`} data-cursor="View" className="block">
        <div className="grid h-36 grid-cols-3 gap-px overflow-hidden rounded-t-sm bg-line">
          {[0, 1, 2].map((i) => {
            const w = works[i % works.length];
            return (<div key={i} className="overflow-hidden bg-sunk"><div className="h-full w-full transition-transform duration-700 group-hover:scale-110"><ProjectArt art={w.art} palette={w.palette} /></div></div>);
          })}
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="-mt-12 flex items-end justify-between">
          <span className="flex shrink-0 rounded-full ring-4 ring-surface"><Avatar name={p.name} tone={p.tone} size={64} /></span>
          {match !== undefined && <span className="rounded-full bg-spring px-2.5 py-1 text-[11px] font-semibold text-midnight">{match}% match</span>}
        </div>
        <Link href={`/people/${p.id}`} className="mt-3 block">
          <h3 className="t-h3">{p.name}</h3>
          <p className="text-small text-mute">{p.role}</p>
        </Link>
        <p className="mt-3 text-small text-ink">{p.skills.slice(0, 3).join(" · ")}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <div>
            <AvailabilityBadge a={p.availability} />
            <div className="mt-1 text-small text-mute">${p.rate[0]}K–${p.rate[1]}K · {p.location.split(",")[0]}</div>
          </div>
          <span className="flex items-center gap-1 text-small"><Star className="h-3.5 w-3.5 fill-ink" />{p.rating.toFixed(1)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button href={`/people/${p.id}`} size="sm" variant="primary" className="flex-1">View Profile</Button>
          <ConnectButton id={p.id} size="sm" />
        </div>
      </div>
    </motion.article>
  );
}
