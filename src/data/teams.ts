import type { Team } from "./types";

export const TEAMS: Team[] = [
  {
    id: "studio-north", name: "Studio North", tagline: "Design + Development", tone: "#E5D3C2", founded: "2022",
    blurb: "A three-person studio for product teams who want design and engineering in the same room. We take fewer projects so each one gets all of us.",
    members: [{ id: "varun-sharma", role: "Product Designer" }, { id: "rahul-mehta", role: "Developer" }, { id: "sarah-lindqvist", role: "Brand Designer" }],
    services: [
      { name: "Website, designed and built", from: 6000, blurb: "Strategy, design and Next.js build, one team.", days: "5–7 weeks" },
      { name: "Product design + build", from: 14000, blurb: "From first flow to production release.", days: "10–14 weeks" },
      { name: "Brand + site launch", from: 9000, blurb: "Identity and a launch website together.", days: "6–8 weeks" },
    ],
    industries: ["SaaS", "Fintech", "Fashion"], rate: [6, 20], availability: "Available", projects: ["finora", "noma", "forma", "kiln"], rating: 4.9, jobs: 29,
  },
  {
    id: "pixel-pine", name: "Pixel & Pine", tagline: "Web, Framer and design systems", tone: "#D6DFCF", founded: "2020",
    blurb: "A small collective that builds quick, beautiful websites and the systems behind them.",
    members: [{ id: "leo-marchetti", role: "Web Designer" }, { id: "tomas-vidal", role: "Frontend Engineer" }, { id: "maya-okafor", role: "No-Code Developer" }],
    services: [
      { name: "Framer or Webflow site", from: 2400, blurb: "Design and build in 2–3 weeks.", days: "2–3 weeks" },
      { name: "Design system build", from: 5000, blurb: "Tokens, components and documentation.", days: "4–6 weeks" },
    ],
    industries: ["Creative", "Developer Tools", "Education"], rate: [2, 10], availability: "Available", projects: ["mono", "atlas", "pebble"], rating: 4.9, jobs: 48,
  },
  {
    id: "halftone", name: "Halftone", tagline: "Motion, 3D and interactive", tone: "#E8D3CB", founded: "2021",
    blurb: "A motion and 3D collective for launches that need to be felt. Film, 3D, and the interactive site to match.",
    members: [{ id: "diego-ramos", role: "Director & 3D" }, { id: "zara-hussain", role: "Motion Designer" }, { id: "owen-callahan", role: "Creative Developer" }],
    services: [
      { name: "Launch film + site", from: 12000, blurb: "Film, 3D scenes and WebGL site.", days: "8–10 weeks" },
      { name: "3D + motion kit", from: 4500, blurb: "Hero loops, product renders, brand motion.", days: "3–4 weeks" },
    ],
    industries: ["Hardware", "Beauty", "Entertainment"], rate: [5, 30], availability: "Limited", projects: ["lumen"], rating: 5.0, jobs: 17,
  },
  {
    id: "loop-labs", name: "Loop Labs", tagline: "AI product studio", tone: "#DCD7EE", founded: "2023",
    blurb: "A product studio for AI-native software: design, ML engineering and mobile under one roof.",
    members: [{ id: "aiko-tanaka", role: "Head of Design" }, { id: "kai-brennan", role: "AI Lead" }, { id: "jonas-weber", role: "Mobile Engineer" }],
    services: [
      { name: "AI feature sprint", from: 9000, blurb: "Design, build and eval one AI feature.", days: "5–6 weeks" },
      { name: "AI product MVP", from: 25000, blurb: "Web + mobile MVP with retrieval and evals.", days: "10–14 weeks" },
    ],
    industries: ["AI", "SaaS", "Legal Tech"], rate: [9, 40], availability: "Available", projects: ["orbit"], rating: 4.9, jobs: 12,
  },
  {
    id: "bureau-nine", name: "Bureau Nine", tagline: "Research, mobile and commerce", tone: "#E7D8D3", founded: "2019",
    blurb: "A product studio for fintech, health and commerce, led by research and shipped with care.",
    members: [{ id: "elena-petrova", role: "Principal Designer" }, { id: "priya-nair", role: "Mobile Design Lead" }, { id: "nadia-rahman", role: "Commerce Developer" }],
    services: [
      { name: "Discovery + design", from: 7000, blurb: "Research sprint and design sprint, then roadmap.", days: "4–6 weeks" },
      { name: "Mobile app design", from: 12000, blurb: "iOS/Android design system and prototype.", days: "8–10 weeks" },
    ],
    industries: ["Fintech", "Health", "Commerce"], rate: [7, 25], availability: "Available", projects: ["arc", "forma"], rating: 4.9, jobs: 34,
  },
];
export const teamById = (id: string) => TEAMS.find((t) => t.id === id)!;
