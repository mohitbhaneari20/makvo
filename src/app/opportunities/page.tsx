"use client";
import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { JOBS } from "@/data/jobs";
import { JobCard } from "@/components/cards/JobCard";
import { Chip, Empty, Skeleton, useFakeLoad, Counter } from "@/components/ui/Misc";
import { Select } from "@/components/ui/Dropdown";
import { SubNav, OPP_NAV } from "@/components/shell/SubNav";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/lib/store";

const BUDGET = ["Under $3K", "$3K–$8K", "$8K–$15K", "$15K+"] as const;
const TIME = ["Up to 3 weeks", "4–6 weeks", "7+ weeks"] as const;
const CATS = Array.from(new Set(JOBS.map((j) => j.category))).sort() as string[];
const SKILLS = Array.from(new Set(JOBS.flatMap((j) => j.skills))).sort() as string[];

export default function Opportunities() {
  const { savedJobs, applications } = useApp();
  const [budget, setBudget] = useState(""); const [time, setTime] = useState(""); const [cat, setCat] = useState(""); const [skill, setSkill] = useState("");
  const [savedOnly, setSavedOnly] = useState(false); const [sort, setSort] = useState<"match" | "new">("match");
  const loading = useFakeLoad([budget, time, cat, skill, savedOnly, sort], 480);

  const list = useMemo(() => JOBS.filter((j) => {
    const [lo, hi] = j.budget;
    if (budget === "Under $3K" && lo > 3000) return false;
    if (budget === "$3K–$8K" && !(lo <= 8000 && hi >= 3000)) return false;
    if (budget === "$8K–$15K" && !(lo <= 15000 && hi >= 8000)) return false;
    if (budget === "$15K+" && hi < 15000) return false;
    if (time === "Up to 3 weeks" && j.weeks > 3) return false;
    if (time === "4–6 weeks" && (j.weeks < 4 || j.weeks > 6)) return false;
    if (time === "7+ weeks" && j.weeks < 7) return false;
    if (cat && j.category !== cat) return false;
    if (skill && !j.skills.includes(skill)) return false;
    if (savedOnly && !savedJobs.includes(j.id)) return false;
    return true;
  }).sort((a, b) => (sort === "match" ? b.match - a.match : 0)), [budget, time, cat, skill, savedOnly, savedJobs, sort]);
  const active = budget || time || cat || skill || savedOnly;
  const clear = () => { setBudget(""); setTime(""); setCat(""); setSkill(""); setSavedOnly(false); };

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-10 grid gap-8 lg:grid-cols-12 md:items-end">
        <div className="lg:col-span-8"><div className="mb-5"><SubNav items={OPP_NAV} id="opps" /></div><h1 className="t-h1">Find your next project.</h1><p className="mt-3 max-w-lg text-body text-mute">Real briefs from teams who’ve read your work. Matches are based on your portfolio, not keywords.</p></div>
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-line bg-line lg:col-span-4">
          {[[JOBS.length, "Open"], [Object.keys(applications).length, "Applied"], [savedJobs.length, "Saved"]].map(([v, l]) => <div key={l as string} className="bg-paper p-4"><div className="t-h2"><Counter to={v as number} /></div><div className="text-small text-mute">{l}</div></div>)}
        </div>
      </div>

      <div className="sticky top-14 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          <Select label="Budget" value={budget as never} options={BUDGET} onChange={setBudget} />
          <Select label="Timeline" value={time as never} options={TIME} onChange={setTime} />
          <Select label="Category" value={cat} options={CATS} onChange={setCat} />
          <Select label="Skills" value={skill} options={SKILLS} onChange={setSkill} />
          <Chip active={savedOnly} onClick={() => setSavedOnly((s) => !s)}>Saved</Chip>
          {active && <button onClick={clear} className="inline-flex h-9 shrink-0 items-center gap-1 px-2 text-small text-mute hover:text-ink"><X className="h-3.5 w-3.5" />Clear</button>}
          <div className="ml-auto flex shrink-0 items-center gap-2 pl-4 text-small text-mute"><span>Sort</span><button onClick={() => setSort((s) => (s === "match" ? "new" : "match"))} className="font-medium text-ink underline-link">{sort === "match" ? "Best match" : "Newest"}</button></div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="divide-y divide-line">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="grid gap-4 py-8 lg:grid-cols-12"><div className="lg:col-span-5"><Skeleton className="h-4 w-1/3" /><Skeleton className="mt-4 h-8 w-4/5" /><Skeleton className="mt-3 h-4 w-3/5" /></div><div className="lg:col-span-4"><Skeleton className="h-10 w-2/3" /></div><div className="lg:col-span-3"><Skeleton className="ml-auto h-8 w-1/2" /></div></div>)}</div>
        ) : list.length === 0 ? (
          <div className="mt-6"><Empty title="Nothing open with those filters" sub="Briefs are posted daily. Widen the budget or timeline to see more." action={<Button variant="outline" onClick={clear}>Clear filters</Button>} /></div>
        ) : (
          <div className="border-b border-line">{list.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}</div>
        )}
      </div>
    </div>
  );
}
