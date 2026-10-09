import { PEOPLE } from "@/data/people";
import { PROJECTS } from "@/data/projects";
import { JOBS, fmtBudget } from "@/data/jobs";
import { TEAMS } from "@/data/teams";

export type Hit = { kind: "Projects" | "People" | "Services" | "Jobs" | "Teams"; id: string; title: string; sub: string; href: string; tone?: string };

const norm = (s: string) => s.toLowerCase();
const hay = (...p: (string | string[])[]) => norm(p.flat().join(" "));

export function services() {
  return [
    ...PEOPLE.flatMap((p) => p.services.map((s) => ({ ...s, owner: p.name, ownerId: p.id, tone: p.tone, tags: p.skills }))),
    ...TEAMS.flatMap((t) => t.services.map((s) => ({ ...s, owner: t.name, ownerId: t.id, tone: t.tone, tags: t.industries, team: true }))),
  ];
}

export function search(q: string): Record<Hit["kind"], Hit[]> {
  const t = norm(q.trim());
  const out: Record<Hit["kind"], Hit[]> = { Projects: [], People: [], Services: [], Jobs: [], Teams: [] };
  if (!t) return out;
  const terms = t.split(/\s+/);
  const ok = (h: string) => terms.every((x) => h.includes(x));
  PROJECTS.forEach((p) => ok(hay(p.name, p.tagline, p.kind, p.desc, p.categories, p.tech, p.industry, p.style, p.client)) && out.Projects.push({ kind: "Projects", id: p.id, title: p.name, sub: `${p.kind} · ${p.industry}`, href: `/work/${p.id}` }));
  PEOPLE.forEach((p) => ok(hay(p.name, p.role, p.headline, p.skills, p.location, p.dna.industries, p.dna.strengths)) && out.People.push({ kind: "People", id: p.id, title: p.name, sub: `${p.role} · ${p.location.split(",")[0]}`, href: `/people/${p.id}`, tone: p.tone }));
  services().forEach((s) => ok(hay(s.name, s.blurb, s.owner, s.tags)) && out.Services.push({ kind: "Services", id: s.name + s.ownerId, title: s.name, sub: `${s.owner} · from $${s.from.toLocaleString()}`, href: (s as { team?: boolean }).team ? `/teams/${s.ownerId}` : `/people/${s.ownerId}`, tone: s.tone }));
  JOBS.forEach((j) => ok(hay(j.title, j.summary, j.client, j.skills, j.category)) && out.Jobs.push({ kind: "Jobs", id: j.id, title: j.title, sub: `${j.client} · ${fmtBudget(j.budget)}`, href: `/opportunities/${j.id}`, tone: j.clientTone }));
  TEAMS.forEach((tm) => ok(hay(tm.name, tm.tagline, tm.blurb, tm.industries)) && out.Teams.push({ kind: "Teams", id: tm.id, title: tm.name, sub: tm.tagline, href: `/teams/${tm.id}`, tone: tm.tone }));
  return out;
}

export const SUGGESTIONS = ["saas", "fintech", "branding", "framer", "ai", "mobile banking", "shopify", "3d"];
