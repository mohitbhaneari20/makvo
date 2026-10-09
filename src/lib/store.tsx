"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CONVERSATIONS } from "@/data/social";
import type { Conversation, Message } from "@/data/types";
import { BRAND } from "@/lib/brand";
import { WORKSPACE } from "@/data/workspace";
import { personById } from "@/data/people";

export type ConnState = "none" | "pending" | "connected";
export type Role = "creator" | "client";
export type Decision = "hire" | "second" | "shortlist" | "reject";
export interface Application { price: string; timeline: string; message: string; work: string[]; at: string; status?: "Under review" | "Viewed" | "Shortlisted" }
export interface Toast { id: number; text: string; tone?: "default" | "ok" }
export interface Interview { personId: string; jobId: string; slot: string; at: string }

interface State {
  role: Role;
  saved: string[]; liked: string[]; savedJobs: string[]; likedPosts: string[]; interestedPosts: string[];
  conn: Record<string, ConnState>; following: string[]; incoming: string[];
  applications: Record<string, Application>;
  interviews: Interview[]; decisions: Record<string, Decision>;
  convos: Conversation[]; hired: boolean; tasks: Record<string, "done" | "progress" | "upcoming">;
  toasts: Toast[]; searchOpen: boolean; invited: string[];
  workspaces: { id: string; name: string; withId: string }[];
}

const initial: State = {
  role: "creator",
  saved: ["lumen"], liked: ["finora"], savedJobs: ["react-saas-application"], likedPosts: [], interestedPosts: [],
  conn: { "rahul-mehta": "connected", "sarah-lindqvist": "connected", "aiko-tanaka": "connected", "leo-marchetti": "connected", "priya-nair": "connected", "zara-hussain": "pending" },
  following: ["diego-ramos", "owen-callahan", "tomas-vidal", "kai-brennan"],
  incoming: ["elena-petrova", "kai-brennan", "maya-okafor"],
  applications: {
    "mobile-banking-app": { price: "$11,500", timeline: "9 weeks", message: "I read the brief twice. Here is how I would approach it.", work: ["finora", "forma"], at: "2 days ago", status: "Shortlisted" },
    "design-system-build": { price: "$8,200", timeline: "6 weeks", message: "Happy to unify the three kits into one system.", work: ["finora"], at: "5 days ago", status: "Viewed" },
  },
  interviews: [{ personId: "varun-sharma", jobId: "mobile-banking-app", slot: "Thu 8 Oct · 16:00", at: "Yesterday" }], decisions: {}, convos: CONVERSATIONS, hired: false,
  tasks: Object.fromEntries(WORKSPACE.tasks.map((t) => [t.id, t.state])),
  toasts: [], searchOpen: false, invited: [], workspaces: [],
};

interface Ctx extends State {
  setRole(r: Role): void;
  toggleSave(id: string): void; toggleLike(id: string): void; toggleSaveJob(id: string): void;
  togglePostLike(id: string): void; toggleInterested(id: string): void;
  connect(id: string): void; disconnect(id: string): void; accept(id: string): void; decline(id: string): void;
  toggleFollow(id: string): void;
  apply(jobId: string, a: Omit<Application, "at">): void;
  scheduleInterview(i: Omit<Interview, "at">): void;
  decide(personId: string, d: Decision): void;
  send(convoId: string, m: Omit<Message, "from" | "at">): void;
  markRead(convoId: string): void;
  startConversation(withId: string, topic: string): string;
  hire(name: string, withId: string): string; createProject(name: string, withId: string): string; receive(convoId: string, m: Omit<Message, "from" | "at">): void;
  cycleTask(id: string): void; invite(personId: string): void;
  toast(text: string, tone?: Toast["tone"]): void;
  setSearchOpen(b: boolean): void;
}

const C = createContext<Ctx | null>(null);
export const useApp = () => {
  const c = useContext(C);
  if (!c) throw new Error("AppProvider missing");
  return c;
};

const toggle = (arr: string[], id: string) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function AppProvider({ children, initialRole = "creator" }: { children: React.ReactNode; initialRole?: Role }) {
  const [s, setS] = useState<State>(() => ({ ...initial, role: initialRole }));
  const patch = useCallback((f: (s: State) => Partial<State>) => setS((p) => ({ ...p, ...f(p) })), []);

  const toast = useCallback((text: string, tone: Toast["tone"] = "default") => {
    const id = Date.now() + Math.random();
    setS((p) => ({ ...p, toasts: [...p.toasts.slice(-2), { id, text, tone }] }));
    setTimeout(() => setS((p) => ({ ...p, toasts: p.toasts.filter((t) => t.id !== id) })), 3400);
  }, []);

  const api = useMemo<Ctx>(
    () => ({
      ...s,
      setRole: (role) => patch(() => ({ role })),
      toggleSave: (id) => { patch((p) => ({ saved: toggle(p.saved, id) })); },
      toggleLike: (id) => patch((p) => ({ liked: toggle(p.liked, id) })),
      toggleSaveJob: (id) => patch((p) => ({ savedJobs: toggle(p.savedJobs, id) })),
      togglePostLike: (id) => patch((p) => ({ likedPosts: toggle(p.likedPosts, id) })),
      toggleInterested: (id) => patch((p) => ({ interestedPosts: toggle(p.interestedPosts, id) })),
      connect: (id) => {
        patch((p) => ({ conn: { ...p.conn, [id]: "pending" } }));
        // Prototype: simulate the other person accepting.
        setTimeout(() => {
          setS((p) => (p.conn[id] === "pending" ? { ...p, conn: { ...p.conn, [id]: "connected" } } : p));
          const who = (() => { try { return personById(id).name; } catch { return "They"; } })();
          toast(`${who} accepted your request`);
        }, 3200);
      },
      disconnect: (id) => patch((p) => ({ conn: { ...p.conn, [id]: "none" } })),
      accept: (id) => patch((p) => ({ conn: { ...p.conn, [id]: "connected" }, incoming: p.incoming.filter((x) => x !== id) })),
      decline: (id) => patch((p) => ({ incoming: p.incoming.filter((x) => x !== id) })),
      toggleFollow: (id) => patch((p) => ({ following: toggle(p.following, id) })),
      apply: (jobId, a) => patch((p) => ({ applications: { ...p.applications, [jobId]: { ...a, at: "Just now", status: "Under review" } } })),
      scheduleInterview: (i) => patch((p) => ({ interviews: [...p.interviews, { ...i, at: "Just now" }] })),
      decide: (personId, d) => patch((p) => ({ decisions: { ...p.decisions, [personId]: d } })),
      send: (convoId, m) =>
        patch((p) => ({
          convos: p.convos.map((c) =>
            c.id === convoId ? { ...c, last: m.text ?? (m.kind === "project" ? "Shared a project" : "Sent an attachment"), at: "Now", thread: [...c.thread, { ...m, from: "me", at: now() }] } : c,
          ),
        })),
      markRead: (convoId) => patch((p) => ({ convos: p.convos.map((c) => (c.id === convoId ? { ...c, unread: 0 } : c)) })),
      startConversation: (withId, topic) => {
        const existing = s.convos.find((c) => c.with === withId);
        if (existing) return existing.id;
        const id = `c-${withId}`;
        patch((p) => ({ convos: [{ id, with: withId, topic, unread: 0, last: "Say hello", at: "Now", thread: [{ from: "me", kind: "system", text: `You connected on ${BRAND.name}. Say hello.`, at: now() }] }, ...p.convos] }));
        return id;
      },
      hire: (name, withId) => {
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        patch((p) => ({ hired: true, workspaces: p.workspaces.some((w) => w.id === id) ? p.workspaces : [...p.workspaces, { id, name, withId }] }));
        return id;
      },
      createProject: (name, withId) => {
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        patch((p) => ({ workspaces: p.workspaces.some((w) => w.id === id) ? p.workspaces : [...p.workspaces, { id, name, withId }] }));
        return id;
      },
      receive: (convoId, m) => patch((p) => ({ convos: p.convos.map((c) => (c.id === convoId ? { ...c, last: m.text ?? "Sent an attachment", at: "Now", thread: [...c.thread, { ...m, from: "them", at: now() }] } : c)) })),
      cycleTask: (id) => patch((p) => {
        const cur = p.tasks[id]; const nxt = cur === "upcoming" ? "progress" : cur === "progress" ? "done" : "upcoming";
        return { tasks: { ...p.tasks, [id]: nxt } };
      }),
      invite: (personId) => patch((p) => ({ invited: p.invited.includes(personId) ? p.invited : [...p.invited, personId] })),
      toast,
      setSearchOpen: (searchOpen) => patch(() => ({ searchOpen })),
    }),
    [s, patch, toast],
  );

  return <C.Provider value={api}>{children}</C.Provider>;
}
