export type Category =
  | "UI/UX" | "Web Design" | "Branding" | "Development" | "Mobile Apps"
  | "Motion" | "3D" | "AI" | "No-Code" | "E-commerce";

export type PeopleGroup = "Design" | "Development" | "Branding" | "Product" | "Motion" | "3D" | "AI" | "No-Code";
export type Availability = "Available" | "Limited" | "Booked";

export interface Review { by: string; role: string; text: string; rating: number; project: string; when: string }
export interface Service { name: string; from: number; blurb: string; days: string }
export interface Job { role: string; org: string; years: string; note: string }

export interface Person {
  id: string; name: string; role: string; headline: string; bio: string;
  group: PeopleGroup[]; skills: string[]; availability: Availability;
  rate: [number, number]; // in $K per project
  hourly: number; years: number; location: string; remote: boolean; tz: string;
  tone: string; // avatar color
  links: { website?: string; linkedin?: string; dribbble?: string; github?: string };
  services: Service[];
  dna: { style: string[]; industries: string[]; strengths: string[] };
  stack?: string[];
  experience: Job[]; reviews: Review[];
  projects: string[]; team?: string; connections: number; views: number; rating: number; jobsDone: number;
  responds: string; kind: "designer" | "developer" | "creative";
}

export interface Project {
  id: string; name: string; tagline: string; kind: string; desc: string;
  categories: Category[]; tech: string[]; industry: string; style: string;
  creators: { id: string; as: string }[]; client: string; year: number; duration: string;
  art: "fintech" | "fashion" | "ai" | "portfolio" | "mobile" | "commerce" | "brand" | "three" | "docs" | "learn";
  palette: [string, string, string];
  verified: boolean; likes: number; views: number; team?: string;
  challenge: string; process: string[]; design: string; development: string; results: { v: string; l: string }[];
}

export interface JobPost {
  id: string; title: string; client: string; clientTone: string; summary: string; desc: string;
  budget: [number, number]; timeline: string; weeks: number; skills: string[]; category: Category;
  posted: string; match: number; applicants: number; remote: boolean; location: string;
  requirements: string[]; deliverables: string[]; references: { name: string; note: string; art: Project["art"]; palette: [string,string,string] }[];
  verifiedClient: boolean; spent: string;
}

export interface Team {
  id: string; name: string; tagline: string; members: { id: string; role: string }[];
  services: Service[]; industries: string[]; rate: [number, number]; availability: Availability;
  projects: string[]; blurb: string; tone: string; founded: string; rating: number; jobs: number;
}

export interface Post {
  id: string; type: "shared" | "seeking" | "published" | "milestone" | "hired";
  by: { kind: "person" | "team"; id: string }; text: string; when: string;
  projectId?: string; tags?: string[]; likes: number; comments: number; interested?: number;
  budget?: string;
}

export interface Message { from: "me" | "them"; text?: string; at: string; kind?: "text" | "project" | "interview" | "file" | "system"; projectId?: string; file?: { name: string; size: string }; }
export interface Conversation { id: string; with: string; topic: string; unread: number; last: string; at: string; thread: Message[]; context?: string }
