import { PEOPLE } from "@/data/people";
import type { JobPost, Person } from "@/data/types";

const tok = (s: string) => s.toLowerCase().replace(/[^a-z0-9/+# ]/g, " ").split(/\s+/).filter((w) => w.length > 1);

export function scorePerson(p: Person, terms: string[]): number {
  const hay = new Set([...p.skills, ...p.dna.industries, ...p.dna.strengths, ...p.dna.style, p.role, ...p.group, ...p.projects].flatMap(tok));
  const want = Array.from(new Set(terms.flatMap(tok))).filter((t) => !["the", "and", "for", "need", "build", "with", "modern", "looking", "designer", "developer"].includes(t) || hay.has(t));
  const hits = want.filter((t) => hay.has(t)).length;
  const avail = p.availability === "Available" ? 5 : p.availability === "Limited" ? 2 : -9;
  return Math.max(58, Math.min(97, Math.round(60 + hits * 8 + avail + p.rating)));
}

export function recommendFor(job: JobPost, n = 3) {
  const terms = [...job.skills, job.category, ...job.title.split(" ")];
  return PEOPLE.map((p) => ({ p, score: scorePerson(p, terms) })).sort((a, b) => b.score - a.score).slice(0, n);
}
