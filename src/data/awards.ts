import { PROJECTS } from "./projects";
import { personById } from "./people";

/** Jury weighting, same four criteria used across the awards. Developer score is judged separately. */
export const CRITERIA = [
  { key: "design", label: "Design", weight: 40, blurb: "Visual craft, typography, layout and consistency." },
  { key: "usability", label: "Usability", weight: 30, blurb: "Clarity, navigation, accessibility and speed." },
  { key: "creativity", label: "Creativity", weight: 20, blurb: "Original ideas and memorable moments." },
  { key: "content", label: "Content", weight: 10, blurb: "Writing, imagery and how well it serves the audience." },
] as const;

export interface Entry { projectId: string; design: number; usability: number; creativity: number; content: number; dev: number }

export const ENTRIES: Entry[] = [
  { projectId: "lumen", design: 8.9, usability: 7.8, creativity: 9.4, content: 8.1, dev: 8.6 },
  { projectId: "finora", design: 8.6, usability: 8.9, creativity: 7.6, content: 8.4, dev: 8.7 },
  { projectId: "orbit", design: 8.4, usability: 8.2, creativity: 8.8, content: 8.0, dev: 8.3 },
  { projectId: "noma", design: 8.7, usability: 7.9, creativity: 8.5, content: 8.8, dev: 7.4 },
  { projectId: "arc", design: 8.2, usability: 8.8, creativity: 7.7, content: 8.2, dev: 8.1 },
  { projectId: "mono", design: 8.0, usability: 7.3, creativity: 8.9, content: 7.9, dev: 7.2 },
  { projectId: "forma", design: 8.3, usability: 8.1, creativity: 7.9, content: 8.0, dev: 8.4 },
  { projectId: "atlas", design: 7.8, usability: 8.7, creativity: 7.2, content: 8.3, dev: 8.8 },
];

export const overall = (e: Entry) => Math.round((e.design * 0.4 + e.usability * 0.3 + e.creativity * 0.2 + e.content * 0.1) * 100) / 100;
export const entryFor = (id: string) => ENTRIES.find((e) => e.projectId === id);
export const projectOf = (id: string) => PROJECTS.find((p) => p.id === id)!;

/** Site of the Day, most recent first. */
export const SOTD: { date: string; projectId: string }[] = [
  { date: "6 Oct", projectId: "lumen" },
  { date: "5 Oct", projectId: "finora" },
  { date: "4 Oct", projectId: "orbit" },
  { date: "3 Oct", projectId: "noma" },
  { date: "2 Oct", projectId: "arc" },
  { date: "1 Oct", projectId: "forma" },
  { date: "30 Sep", projectId: "mono" },
];
export const SOTM = { month: "September 2026", projectId: "orbit" };
export const HONORABLE = ["atlas", "mono", "forma"];
export const DEV_AWARD_MIN = 8.0;

export interface YearAward {
  id: string; title: string; kind: "person" | "team"; winner: string; citation: string; stat: { v: string; l: string }[]; finalists: string[];
}

export const YEAR_AWARDS: YearAward[] = [
  { id: "designer", title: "Designer of the Year", kind: "person", winner: "aiko-tanaka", finalists: ["priya-nair", "sarah-lindqvist", "varun-sharma"],
    citation: "Aiko made an AI product feel calm. Orbit shows its reasoning at every step, and the jury called it the clearest interface of the year for a hard problem.",
    stat: [{ v: "8.38", l: "Orbit overall score" }, { v: "1", l: "Site of the Month" }] },
  { id: "developer", title: "Developer of the Year", kind: "person", winner: "owen-callahan", finalists: ["tomas-vidal", "rahul-mehta", "kai-brennan"],
    citation: "Owen shipped the Lumen launch site with real-time 3D that stays smooth on a mid-range phone. The jury scored its build 8.6 and named it the benchmark for interactive work.",
    stat: [{ v: "8.6", l: "Developer score" }, { v: "60 fps", l: "On mid-range mobile" }] },
  { id: "studio", title: "Studio of the Year", kind: "team", winner: "halftone", finalists: ["studio-north", "loop-labs", "bureau-nine"],
    citation: "Halftone took one idea, a lamp that feels alive, from film to 3D to interactive site without a seam. Direction, motion and engineering worked as one team.",
    stat: [{ v: "8.59", l: "Lumen overall score" }, { v: "9 wks", l: "Brief to launch" }] },
  { id: "rising", title: "Rising Talent", kind: "person", winner: "maya-okafor", finalists: ["leo-marchetti", "nadia-rahman", "zara-hussain"],
    citation: "Maya built Pebble in three weeks with no-code tools and an eye for the people using it. It proves that craft does not depend on the toolchain.",
    stat: [{ v: "3 wks", l: "Brief to launch" }, { v: "No-code", l: "Built with Bubble" }] },
];

/** Public vote seed. Counts are mock. */
export const VOTE_SEED: Record<string, number> = { lumen: 1842, finora: 1630, noma: 1411, orbit: 1297, arc: 986, mono: 742, forma: 655, atlas: 538 };

export const JURY = [
  { name: "Ingrid Solheim", role: "Design Director", org: "Fjord & Field", tone: "#E4DED2" },
  { name: "Marcus Adeyemi", role: "Principal Engineer", org: "Northwind", tone: "#D6E3E8" },
  { name: "Hana Kobayashi", role: "Creative Technologist", org: "Parallax", tone: "#E8DDD0" },
  { name: "Tobias Reiner", role: "Head of Brand", org: "Cobalt Labs", tone: "#DCD7EE" },
  { name: "Lucía Ferrer", role: "UX Researcher", org: "Mercado", tone: "#D8E6D6" },
  { name: "Samir Qureshi", role: "Motion Lead", org: "Reel Society", tone: "#EBD9D3" },
];

export interface Standing { id: string; points: number; wins: string[] }

/** Points: Site of the Day 10, Site of the Month 25, Developer Award 8 (developers), Honorable Mention 3. */
export function standings(side: "design" | "dev"): Standing[] {
  const map = new Map<string, Standing>();
  const give = (id: string, pts: number, label: string) => {
    const p = personById(id);
    if (side === "design" ? p.kind === "developer" : p.kind === "designer") return;
    const s = map.get(id) ?? { id, points: 0, wins: [] };
    s.points += pts; s.wins.push(label); map.set(id, s);
  };
  const credit = (projectId: string, pts: number, label: string) => projectOf(projectId).creators.forEach((c) => give(c.id, pts, label));
  SOTD.forEach((d) => credit(d.projectId, 10, "Site of the Day"));
  credit(SOTM.projectId, 25, "Site of the Month");
  HONORABLE.forEach((id) => credit(id, 3, "Honorable Mention"));
  if (side === "dev") ENTRIES.filter((e) => e.dev >= DEV_AWARD_MIN).forEach((e) => credit(e.projectId, 8, "Developer Award"));
  return Array.from(map.values()).sort((a, b) => b.points - a.points).slice(0, 6);
}
