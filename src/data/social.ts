import { BRAND } from "@/lib/brand";
import type { Conversation, Post } from "./types";

export const POSTS: Post[] = [
  { id: "p1", type: "shared", by: { kind: "person", id: "varun-sharma" }, text: "Just finished the redesign of a fintech dashboard. Eleven weeks, one very patient engineer, and 23 navigation items down to six.", when: "2h", projectId: "finora", likes: 312, comments: 28 },
  { id: "p2", type: "seeking", by: { kind: "person", id: "rahul-mehta" }, text: "Building an AI SaaS product for a client and looking for a product designer to collaborate with. Six weeks, decent budget, interesting problem: making retrieval feel trustworthy.", when: "4h", tags: ["React", "Next.js", "AI"], budget: "$6K–$10K", likes: 87, comments: 14, interested: 23 },
  { id: "p3", type: "published", by: { kind: "team", id: "halftone" }, text: "Lumen is live. A launch film, 3D scenes and a WebGL site for a lamp that follows the sun. Nine weeks, very little sleep.", when: "6h", projectId: "lumen", likes: 940, comments: 61 },
  { id: "p4", type: "milestone", by: { kind: "person", id: "priya-nair" }, text: "Arc's onboarding just hit a median of 3m 40s. Five single-question screens did most of the work, the animations did the rest.", when: "9h", projectId: "arc", likes: 428, comments: 33 },
  { id: "p5", type: "hired", by: { kind: "person", id: "leo-marchetti" }, text: `Started a new project with Bellini Architects through ${BRAND.name}. Black, white and one orange accent. Can't wait to show it.`, when: "11h", likes: 156, comments: 12 },
  { id: "p6", type: "seeking", by: { kind: "team", id: "loop-labs" }, text: "We're opening two slots for AI feature sprints in November. Looking for founders with a real problem and some data.", when: "13h", tags: ["AI", "Product", "Evals"], budget: "$9K+", likes: 201, comments: 22, interested: 41 },
  { id: "p7", type: "shared", by: { kind: "person", id: "sarah-lindqvist" }, text: "Kiln & Co. stamp marks, drawn by hand and then rebuilt in vector. Every piece of pottery now carries its own number.", when: "1d", projectId: "kiln", likes: 521, comments: 40 },
  { id: "p8", type: "published", by: { kind: "person", id: "tomas-vidal" }, text: "Published Atlas: a docs platform with runnable examples and 120ms search. Open sourcing the component library soon.", when: "1d", projectId: "atlas", likes: 267, comments: 19 },
  { id: "p9", type: "seeking", by: { kind: "person", id: "maya-okafor" }, text: "Looking for a brand designer who loves playful work to partner on a no-code learning product. Small budget, big fun.", when: "2d", tags: ["Branding", "No-Code", "Education"], budget: "$1K–$3K", likes: 64, comments: 9, interested: 17 },
  { id: "p10", type: "shared", by: { kind: "person", id: "diego-ramos" }, text: "Process shot: the amber diffusion test for the Lumen lamp. Forty versions to get the glow right.", when: "3d", projectId: "lumen", likes: 780, comments: 52 },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1", with: "rahul-mehta", topic: "Finora Website", unread: 2, last: "Pushing the staging link in ten.", at: "9:42", context: "finora",
    thread: [
      { from: "them", text: "Morning! Looked through the final Figma file. Spacing tokens are clean, thanks for that.", at: "9:12" },
      { from: "me", text: "Great. I left notes on the pricing table's empty state, check the comments on frame 14.", at: "9:15" },
      { from: "them", kind: "project", projectId: "finora", text: "Reference for the chart interaction, same approach as the dashboard we shipped.", at: "9:20" },
      { from: "me", text: "Perfect. Do you want me to add the hover states for the line chart?", at: "9:24" },
      { from: "them", kind: "file", file: { name: "chart-interaction.mp4", size: "4.2 MB" }, at: "9:30" },
      { from: "them", text: "Pushing the staging link in ten.", at: "9:42" },
    ],
  },
  {
    id: "c2", with: "ines-carvalho", topic: "Fashion E-commerce Website", unread: 1, last: "Could we talk on Thursday?", at: "Yesterday", context: "fashion-ecommerce-website",
    thread: [
      { from: "them", text: "Hi Varun, I loved the Noma case study. Our label feels similar in tone.", at: "Tue 14:03" },
      { from: "me", text: "Thank you, Ines. Happy to tell you more. Is the brief on the job post up to date?", at: "Tue 14:20" },
      { from: "them", text: "Yes. Could we talk on Thursday?", at: "Tue 14:41" },
    ],
  },
  {
    id: "c3", with: "sarah-lindqvist", topic: "Studio North · Brand", unread: 0, last: "Sending the packaging files tonight.", at: "Mon",
    thread: [
      { from: "me", text: "Sarah, are the Kiln packaging dielines final?", at: "Mon 10:02" },
      { from: "them", text: "Almost. Sending the packaging files tonight.", at: "Mon 10:15" },
    ],
  },
  {
    id: "c4", with: "aiko-tanaka", topic: "Orbit · Collaboration", unread: 0, last: "Let's pair on the marketing site next quarter.", at: "Sun",
    thread: [
      { from: "them", text: "The Orbit marketing site was a joy to work on with you.", at: "Sun 18:00" },
      { from: "me", text: "Likewise. Let's pair on the marketing site next quarter.", at: "Sun 18:12" },
    ],
  },
  {
    id: "c5", with: "daniel-roth", topic: "Finora · Phase 2", unread: 0, last: "Can we scope reporting v2?", at: "Oct 1",
    thread: [
      { from: "them", text: "The new dashboard is performing wonderfully. Can we scope reporting v2?", at: "Oct 1 11:00" },
      { from: "me", text: "Absolutely. I'll share a short outline this week.", at: "Oct 1 11:30" },
    ],
  },
  {
    id: "c6", with: "leo-marchetti", topic: "Intro", unread: 0, last: "Nice to meet you!", at: "Sep 28",
    thread: [
      { from: "them", text: "Hi Varun! Found you through Mono. Fan of your Noma work. Nice to meet you!", at: "Sep 28 09:00" },
    ],
  },
];

// External (client) contacts that are not creators in the network.
export const CLIENT_CONTACTS: Record<string, { name: string; role: string; tone: string }> = {
  "ines-carvalho": { name: "Ines Carvalho", role: "Founder, Atelier Sol", tone: "#EBD6C4" },
  "daniel-roth": { name: "Daniel Roth", role: "CEO, Finora", tone: "#C8D8C0" },
};

export const NOTIFICATIONS = [
  { id: "n1", text: "Ines Carvalho viewed your profile", sub: "Atelier Sol · Fashion E-commerce Website", when: "12m", unread: true, href: "/messages" },
  { id: "n2", text: "Northwind Analytics invited you to apply", sub: "SaaS Website Redesign · 92% match", when: "2h", unread: true, href: "/opportunities/saas-website-redesign" },
  { id: "n3", text: "Rahul Mehta accepted your connection", sub: "Full-Stack Developer", when: "5h", unread: false, href: "/people/rahul-mehta" },
  { id: "n4", text: "Finora verified your project", sub: "Finora Platform Redesign is now a Verified Project", when: "1d", unread: false, href: "/work/finora" },
];

import { PEOPLE } from "./people";
export function contact(id: string): { id: string; name: string; role: string; tone: string; href?: string } {
  const p = PEOPLE.find((x) => x.id === id);
  if (p) return { id, name: p.name, role: p.role, tone: p.tone, href: `/people/${p.id}` };
  const c = CLIENT_CONTACTS[id];
  return { id, name: c?.name ?? id, role: c?.role ?? "", tone: c?.tone ?? "#E4DED2" };
}
