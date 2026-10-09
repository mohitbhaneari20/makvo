"use client";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { PEOPLE } from "@/data/people";
import type { Person, PeopleGroup } from "@/data/types";
import { PersonCard } from "@/components/cards/PersonCard";
import { Chip, Empty, Skeleton, useFakeLoad } from "@/components/ui/Misc";
import { Select } from "@/components/ui/Dropdown";
import { SubNav, PEOPLE_NAV } from "@/components/shell/SubNav";
import { Button } from "@/components/ui/Button";

const GROUPS: ("All" | PeopleGroup)[] = ["All", "Design", "Development", "Branding", "Product", "Motion", "3D", "AI", "No-Code"];
const AVAIL = ["Available", "Limited", "Booked"] as const;
const EXP = ["0–3 years", "4–7 years", "8+ years"] as const;
const BUDGET = ["Under $2K", "$2K–$5K", "$5K–$10K", "$10K+"] as const;
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
  const [avail, setAvail] = useState(""); const [exp, setExp] = useState(""); const [budget, setBudget] = useState("");
  const [loc, setLoc] = useState(""); const [skill, setSkill] = useState(""); const [remote, setRemote] = useState(false);
  const loading = useFakeLoad([group, avail, exp, budget, loc, skill, remote], 450);

  const list = useMemo(() => PEOPLE.filter((p) => {
    if (group !== "All" && !p.group.includes(group)) return false;
    if (avail && p.availability !== avail) return false;
    if (exp === "0–3 years" && p.years > 3) return false;
    if (exp === "4–7 years" && (p.years < 4 || p.years > 7)) return false;
    if (exp === "8+ years" && p.years < 8) return false;
    const [lo, hi] = p.rate;
    if (budget === "Under $2K" && lo > 2) return false;
    if (budget === "$2K–$5K" && !(lo <= 5 && hi >= 2)) return false;
    if (budget === "$5K–$10K" && !(lo <= 10 && hi >= 5)) return false;
    if (budget === "$10K+" && hi < 10) return false;
    if (loc && region(p) !== loc) return false;
    if (skill && !p.skills.includes(skill)) return false;
    if (remote && !p.remote) return false;
    return true;
  }), [group, avail, exp, budget, loc, skill, remote]);
  const active = group !== "All" || avail || exp || budget || loc || skill || remote;
  const clear = () => { setGroup("All"); setAvail(""); setExp(""); setBudget(""); setLoc(""); setSkill(""); setRemote(false); };

  return (
    <div className="container-x pt-10 md:pt-16">
      <div className="mb-8"><div className="mb-5"><SubNav items={PEOPLE_NAV} id="people" /></div>
        <h1 className="t-h1 max-w-2xl">Find people worth working with.</h1>
        <p className="mt-3 max-w-lg text-body text-mute">Every profile is built from finished, verified work. No résumés to decode.</p></div>

      <div className="sticky top-14 z-30 -mx-5 border-b border-line bg-paper/90 px-5 py-3 backdrop-blur-md md:top-16 md:mx-0 md:px-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">{GROUPS.map((g) => <Chip key={g} active={group === g} onClick={() => setGroup(g)}>{g}</Chip>)}</div>
        <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-0.5">
          <Select label="Availability" value={avail as never} options={AVAIL} onChange={setAvail} />
          <Select label="Experience" value={exp as never} options={EXP} onChange={setExp} />
          <Select label="Budget" value={budget as never} options={BUDGET} onChange={setBudget} />
          <Select label="Location" value={loc as never} options={LOC} onChange={setLoc} />
          <Select label="Skills" value={skill} options={SKILLS} onChange={setSkill} />
          <button onClick={() => setRemote((r) => !r)} aria-pressed={remote} className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-sm border px-3 text-small transition ${remote ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink"}`}>Remote only</button>
          {active && <button onClick={clear} className="inline-flex h-9 shrink-0 items-center gap-1 px-2 text-small text-mute hover:text-ink"><X className="h-3.5 w-3.5" />Clear</button>}
          <span className="ml-auto shrink-0 pl-4 text-small tabular-nums text-mute">{list.length} {list.length === 1 ? "person" : "people"}</span>
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
