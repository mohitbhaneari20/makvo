import { WORKSPACE } from "@/data/workspace";
import { contact } from "@/data/social";

export type WS = typeof WORKSPACE;

/** The seeded Finora workspace, or a fresh one for a project created via hire / Create Project. */
export function getWorkspace(id: string, created: { id: string; name: string; withId: string }[]): WS | null {
  if (id === WORKSPACE.id) return WORKSPACE;
  const c = created.find((w) => w.id === id);
  if (!c) return null;
  const who = contact(c.withId);
  return {
    ...WORKSPACE, id: c.id, name: c.name, status: "Just started", progress: 4, deadline: "In 4 weeks", client: who.name,
    members: [{ id: "varun-sharma", role: "Design lead" }, { id: c.withId, role: "Collaborator" }, { id: "daniel-roth", role: "Client" }],
    tasks: [
      { id: "t1", title: "Research", state: "progress", owner: "varun-sharma", due: "This week" },
      { id: "t2", title: "Wireframes", state: "upcoming", owner: "varun-sharma", due: "Next week" },
      { id: "t3", title: "UI Design", state: "upcoming", owner: "varun-sharma", due: "Week 3" },
      { id: "t4", title: "Development", state: "upcoming", owner: c.withId, due: "Week 4" },
      { id: "t5", title: "Testing", state: "upcoming", owner: c.withId, due: "Week 5" },
    ],
    files: [{ name: "Brief", sub: "Project brief and references", kind: "folder", size: "Added today", by: "You" }, { name: "Figma", sub: "Empty file, ready for wireframes", kind: "figma", size: "Created now", by: "You" }],
    milestones: [{ name: "Discovery", pct: 20, state: "In progress", amount: 800 }, { name: "Design", pct: 0, state: "Upcoming", amount: 1800 }, { name: "Development", pct: 0, state: "Upcoming", amount: 2400 }, { name: "Launch", pct: 0, state: "Upcoming", amount: 500 }],
    meetings: [{ title: "Kick-off call", when: "Mon · 10:00", length: "30 min", with: "Everyone" }],
    activity: [{ who: "varun-sharma", what: "created the project workspace", when: "Just now" }],
    messages: [{ from: "varun-sharma", text: "Workspace is ready. Let’s start with research.", at: "Now" }],
  } as WS;
}
