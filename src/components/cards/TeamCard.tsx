"use client";
import Link from "next/link";
import { PROJECTS } from "@/data/projects";
import { personById } from "@/data/people";
import type { Team } from "@/data/types";
import { AvatarStack } from "@/components/ui/Avatar";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { ProjectArt } from "@/components/art/ProjectArt";

export function TeamCard({ team: t }: { team: Team }) {
  const works = t.projects.map((id) => PROJECTS.find((p) => p.id === id)!).slice(0, 2);
  return (
    <Link href={`/teams/${t.id}`} data-cursor="View" className="group block rounded-md border border-line bg-surface p-5 transition hover:border-ink/40 hover:shadow-soft">
      <div className={`grid gap-px overflow-hidden rounded-xs bg-line ${works.length > 1 ? "grid-cols-2" : ""}`}>
        {works.map((w) => <div key={w.id} className="aspect-[4/3] overflow-hidden bg-sunk"><div className="h-full w-full transition-transform duration-700 group-hover:scale-105"><ProjectArt art={w.art} palette={w.palette} /></div></div>)}
      </div>
      <div className="mt-5 flex items-start justify-between">
        <div><h3 className="t-h3">{t.name}</h3><p className="text-small text-mute">{t.tagline}</p></div>
        <AvatarStack people={t.members.map((m) => personById(m.id))} size={30} />
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <div><AvailabilityBadge a={t.availability} /><div className="mt-1 text-small text-mute">${t.rate[0]}K–${t.rate[1]}K · {t.members.length} members</div></div>
        <span className="text-small font-medium underline-link">View team →</span>
      </div>
    </Link>
  );
}
