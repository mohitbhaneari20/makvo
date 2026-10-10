"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { PEOPLE } from "@/data/people";
import type { Person, PeopleGroup } from "@/data/types";
import { PersonCard } from "@/components/cards/PersonCard";
import { Chip, Empty, Skeleton, useFakeLoad } from "@/components/ui/Misc";
import { MultiFilter, RangeFilter, type Range } from "@/components/ui/Filters";
import { SubNav, PEOPLE_NAV } from "@/components/shell/SubNav";
import { Button } from "@/components/ui/Button";

const GROUPS: ("All" | PeopleGroup)[] = ["All", "Design", "Development", "Branding", "Product", "Motion", "3D", "AI", "No-Code"];
const AVAIL = ["Available", "Limited", "Booked"] as const;
// Ranges: the top of each scale means "or more".
const EXP_SCALE: Range = [0, 15];
const EXP_PRESETS = [{ label: "Up to 3 yrs", range: [0, 3] as Range }, { label: "4–7 yrs", range: [4, 7] as Range }, { label: "8–12 yrs", range: [8, 12] as Range }, { label: "12+ yrs", range: [12, 15] as Range }];
const BUDGET_SCALE: Range = [0, 15]; // project budget, $K
const BUDGET_PRESETS = [{ label: "Under $2K", range: [0, 2] as Range }, { label: "$2K–$5K", range: [2, 5] as Range }, { label: "$5K–$10K", range: [5, 10] as Range }, { label: "$10K+", range: [10, 15] as Range }];
const LOC = ["Asia", "Europe", "North America", "Latin America", "Africa"] as const;
const SKILLS = Array.from(new Set(PEOPLE.flatMap((p) => p.skills))).sort() as string[];

const region = (p: Person) => {
  const l = p.location;
  if (/India|Japan/.test(l)) return "Asia";
  if (/Sweden|Italy|Germany|Switzerland|Portugal|UK|Ireland/.test(l)) return "Europe";
  if (/USA|Canada/.test(l)) return "North America";
  if (/Mexico/.test(l)) return "Latin America";
  return "Africa";
};

function Inner() {
  const sp = useSearchParams();
  const initial = (GROUPS.find((g) => g === sp.get("group")) ?? "All") as (typeof GROUPS)[number];
  const [group, setGroup] = useState(initial);
  const [avail, setAvail] = useState<string[]>([]); const [exp, setExp] = useState<Range>(EXP_SCALE); const [budget, setBudget] = useState<Range>(BUDGET_SCALE);
  const [loc, setLoc] = useState<string[]>([]); const [skills, setSkills] = useState<string[]>([]); const [remote, setRemote] = useState(false);
  const loading = useFakeLoad([group, avail.join(), exp.join(), budget.join(), loc.join(), skills.join(), remote], 450);

  const list = useMemo(() => PEOPLE.filter((p) => {
    if (group !== "All" && !p.group.includes(group)) return false;
    if (avail.length && !avail.includes(p.availability)) return false;
    // Top of the scale is open-ended ("15+ yrs", "$15K+").
    if (p.years < exp[0] || (exp[1] < EXP_SCALE[1] && p.years > exp[1])) return false;
    const [lo, hi] = p.rate; // the person's typical project range overlaps the budget
    if (hi < budget[0] || (budget[1] < BUDGET_SCALE[1] && lo > budget[1])) return false;
    if (loc.length && !loc.includes(region(p))) return false;
    if (skills.length && !skills.some((s) => p.skills.includes(s))) return false;
    if (remote && !p.remote) return false;
    return true;
  }), [group, avail, exp, budget, loc, skills, remote]);
  const expSet = exp[0] !== EXP_SCALE[0] || exp[1] !== EXP_SCALE[1];
  const budgetSet = budget[0] !== BUDGET_SCALE[0] || budget[1] !== BUDGET_SCALE[1];
  const active = group !== "All" || avail.length > 0 || expSet || budgetSet || loc.length > 0 || skills.length > 0 || remote;
  const clear = () => { setGroup("All"); setAvail([]); setExp(EXP_SCALE); setBudget(BUDGET_SCALE); setLoc([]); setSkills([]); setRemote(false); };

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><div className="mb-5"><SubNav items={PEOPLE_NAV} id="people" /></div>
        <h1 className="t-h1 max-w-2xl">Find people worth working with.</h1>
        <p className="mt-3 max-w-lg text-body text-mute">Every profile is built from finished, verified work. No résumés to decode.</p></div>

      <div className="sticky top-14 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{GROUPS.map((g) => <Chip key={g} active={group === g} onClick={() => setGroup(g)}>{g}</Chip>)}</div>
        <div className="mt-3 flex items-center gap-4">
        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5">
          <MultiFilter label="Availability" options={AVAIL} value={avail} onChange={setAvail} count={(o) => PEOPLE.filter((p) => p.availability === o).length} />
          <RangeFilter label="Experience" unit="years" min={EXP_SCALE[0]} max={EXP_SCALE[1]} value={exp} onChange={setExp} presets={EXP_PRESETS} format={(n, plus) => `${n}${plus ? "+" : ""} yrs`} bare={(n) => `${n}`} />
          <RangeFilter label="Budget" unit="per project" min={BUDGET_SCALE[0]} max={BUDGET_SCALE[1]} value={budget} onChange={setBudget} presets={BUDGET_PRESETS} format={(n, plus) => `$${n}K${plus ? "+" : ""}`} />
          <MultiFilter label="Location" options={LOC} value={loc} onChange={setLoc} count={(o) => PEOPLE.filter((p) => region(p) === o).length} />
          <MultiFilter label="Skills" options={SKILLS} value={skills} onChange={setSkills} searchable count={(o) => PEOPLE.filter((p) => p.skills.includes(o)).length} />
          <button onClick={() => setRemote((r) => !r)} aria-pressed={remote} className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-sm border px-3 text-small transition ${remote ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink"}`}>Remote only</button>
          {active && <button onClick={clear} className="inline-flex h-9 shrink-0 items-center gap-1 px-2 text-small text-mute hover:text-ink"><X className="h-3.5 w-3.5" />Clear</button>}
        </div>
          <span className="hidden shrink-0 whitespace-nowrap text-small tabular-nums text-mute sm:block" aria-live="polite">{list.length} {list.length === 1 ? "person" : "people"}</span>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded-sm border border-line p-0"><Skeleton className="h-36 w-full" /><div className="p-5"><Skeleton className="-mt-12 h-16 w-16 !rounded-full ring-4 ring-paper" /><Skeleton className="mt-4 h-5 w-1/2" /><Skeleton className="mt-2 h-4 w-2/3" /><Skeleton className="mt-6 h-9 w-full" /></div></div>)}</div>
        ) : list.length === 0 ? (
          <Empty title="No one matches all of that" sub="Loosen a filter or two. Someone great is probably one setting away." action={<Button variant="outline" onClick={clear}>Clear filters</Button>} />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{list.map((p, i) => <PersonCard key={p.id} person={p} index={i} />)}</div>
        )}
      </div>
    </div>
  );
}
export default function People() { return <Suspense><Inner /></Suspense>; }
