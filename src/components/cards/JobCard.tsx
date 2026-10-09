"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { fmtBudget } from "@/data/jobs";
import type { JobPost } from "@/data/types";
import { Avatar } from "@/components/ui/Avatar";
import { SaveButton } from "@/components/ui/Actions";
import { useApp } from "@/lib/store";

export function JobCard({ job: j, index = 0 }: { job: JobPost; index?: number }) {
  const { applications } = useApp();
  const applied = !!applications[j.id];
  return (
    <motion.article initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -24px 0px", amount: 0.01 }} transition={{ duration: 0.35, delay: (index % 4) * 0.03 }} className="group relative">
      <Link href={`/opportunities/${j.id}`} data-cursor="Open" className="grid gap-5 border-t border-line py-7 transition-colors lg:grid-cols-12 md:gap-8 md:py-8">
        <div className="lg:col-span-5">
          <div className="mb-3 flex items-center gap-2.5">
            <Avatar name={j.client} tone={j.clientTone} size={26} square />
            <span className="text-small font-medium">{j.client}</span>
            {j.verifiedClient && <BadgeCheck className="h-3.5 w-3.5 text-hi" />}
            <span className="text-small text-mute">· {j.posted}</span>
          </div>
          <h3 className="t-h2 transition-transform duration-500 group-hover:translate-x-1.5">{j.title}</h3>
          <p className="mt-2 max-w-md text-body text-mute">{j.summary}</p>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:col-span-4">
          <div><div className="t-caption mb-1">Budget</div><div className="text-h3 tabular-nums">{fmtBudget(j.budget)}</div></div>
          <div><div className="t-caption mb-1">Timeline</div><div className="text-h3">{j.timeline}</div></div>
          <div className="col-span-2 flex flex-wrap gap-1.5">
            {j.skills.slice(0, 4).map((s) => <span key={s} className="rounded-xs border border-line px-2 py-0.5 text-[11px] text-mute">{s}</span>)}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4 lg:col-span-3 lg:justify-end md:gap-6">
          <div className="lg:text-right">
            <div className="text-h3 tabular-nums text-hi">{j.match}% match</div>
            <div className="mt-1 text-small text-mute">{applied ? "You applied" : `${j.applicants} applicants`}</div>
          </div>
          <span className="hidden h-10 w-10 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-paper md:inline-flex"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </Link>
      <div className="absolute right-0 top-5 md:hidden"><SaveButton id={j.id} kind="job" overlay /></div>
    </motion.article>
  );
}
