export const WORKSPACE = {
  id: "finora-website", name: "Finora Website", status: "In progress", progress: 68, deadline: "24 Oct", client: "Daniel Roth",
  members: [
    { id: "varun-sharma", role: "Design lead" },
    { id: "rahul-mehta", role: "Development lead" },
    { id: "daniel-roth", role: "Client" },
  ],
  tasks: [
    { id: "t1", title: "Research", state: "done", owner: "varun-sharma", due: "12 Sep" },
    { id: "t2", title: "Wireframes", state: "done", owner: "varun-sharma", due: "22 Sep" },
    { id: "t3", title: "UI Design", state: "done", owner: "varun-sharma", due: "4 Oct" },
    { id: "t4", title: "Development", state: "progress", owner: "rahul-mehta", due: "18 Oct" },
    { id: "t5", title: "Testing", state: "upcoming", owner: "rahul-mehta", due: "22 Oct" },
  ] as { id: string; title: string; state: "done" | "progress" | "upcoming"; owner: string; due: string }[],
  files: [
    { name: "Figma", sub: "Finora Website — Final", kind: "figma", size: "Updated 2h ago", by: "Varun" },
    { name: "Design System", sub: "Tokens, components, docs", kind: "system", size: "Updated yesterday", by: "Varun" },
    { name: "Brand Assets", sub: "Logos, type, imagery", kind: "folder", size: "42 files", by: "Daniel" },
    { name: "Development Repository", sub: "finora/website · main", kind: "repo", size: "12 commits this week", by: "Rahul" },
  ],
  milestones: [
    { name: "Discovery", pct: 100, state: "Completed", amount: 1200 },
    { name: "Design", pct: 100, state: "Completed", amount: 2400 },
    { name: "Development", pct: 60, state: "In progress", amount: 3200 },
    { name: "Launch", pct: 0, state: "Upcoming", amount: 800 },
  ],
  meetings: [
    { title: "Weekly sync", when: "Thu 8 Oct · 16:00", length: "30 min", with: "Daniel, Varun, Rahul" },
    { title: "Staging walkthrough", when: "Mon 12 Oct · 11:00", length: "45 min", with: "Daniel, Rahul" },
    { title: "Launch readiness", when: "Fri 23 Oct · 15:00", length: "30 min", with: "Everyone" },
  ],
  activity: [
    { who: "rahul-mehta", what: "pushed 4 commits to main", when: "25 min ago" },
    { who: "varun-sharma", what: "updated the pricing page designs", when: "2 hours ago" },
    { who: "daniel-roth", what: "approved the homepage", when: "Yesterday" },
    { who: "varun-sharma", what: "completed UI Design", when: "Sunday" },
  ],
  messages: [
    { from: "rahul-mehta", text: "Staging is up. Auth and dashboard shell are working.", at: "09:41" },
    { from: "daniel-roth", text: "Looks great. Can we make the CTA a bit calmer?", at: "10:02" },
    { from: "varun-sharma", text: "Done. Changed to the secondary style, pushed to Figma.", at: "10:11" },
  ],
};
