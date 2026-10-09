"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Briefcase, CornerDownLeft, FolderOpen, Layers, Search, Sparkles, Users, X } from "lucide-react";
import { SUGGESTIONS, search, type Hit } from "@/lib/search";
import { useApp } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";

const ICON = { Projects: FolderOpen, People: Users, Services: Sparkles, Jobs: Briefcase, Teams: Layers } as const;

export function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useApp();
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(!searchOpen); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [searchOpen, setSearchOpen]);
  useEffect(() => { if (searchOpen) { setQ(""); setCursor(0); setTimeout(() => input.current?.focus(), 60); document.body.style.overflow = "hidden"; } else document.body.style.overflow = ""; }, [searchOpen]);

  const results = useMemo(() => search(q), [q]);
  const flat: Hit[] = (Object.keys(results) as Hit["kind"][]).flatMap((k) => results[k].slice(0, 3));
  const total = Object.values(results).reduce((a, b) => a + b.length, 0);
  const go = (h: Hit) => { setSearchOpen(false); router.push(h.href); };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[8vh] md:pt-[12vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-[3px]" onClick={() => setSearchOpen(false)} />
          <motion.div initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -8, scale: 0.99 }} transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className="relative flex max-h-[78dvh] w-full max-w-2xl flex-col overflow-hidden rounded-md bg-paper shadow-pop" role="dialog" aria-label="Search">
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-mute" />
              <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setCursor(0); }} placeholder="Search people, projects, services, jobs, teams"
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(flat.length - 1, c + 1)); }
                  if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
                  if (e.key === "Enter" && flat[cursor]) go(flat[cursor]);
                }}
                className="h-14 flex-1 bg-transparent text-body outline-none placeholder:text-faint" />
              <button onClick={() => setSearchOpen(false)} className="rounded-full p-1.5 text-mute hover:bg-sunk" aria-label="Close search"><X className="h-4 w-4" /></button>
            </div>
            <div className="overflow-y-auto">
              {!q.trim() ? (
                <div className="p-5">
                  <div className="t-caption mb-3">Try searching for</div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="rounded-md border border-line bg-surface px-3 py-1.5 text-small transition hover:border-ink">{s}</button>
                    ))}
                  </div>
                  <div className="t-caption mb-3 mt-7">Jump to</div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    {[["Find talent", "/talent"], ["Your network", "/network"], ["Open opportunities", "/opportunities"], ["Your dashboard", "/dashboard"]].map(([l, h]) => (
                      <button key={h} onClick={() => { setSearchOpen(false); router.push(h); }} className="flex items-center justify-between rounded-sm px-3 py-2.5 text-left text-body transition hover:bg-sunk">{l}<ArrowUpRight className="h-4 w-4 text-mute" /></button>
                    ))}
                  </div>
                </div>
              ) : total === 0 ? (
                <div className="px-5 py-14 text-center"><div className="t-h3">Nothing for “{q}”</div><p className="mt-2 text-small text-mute">Try a skill like “react”, an industry like “fintech”, or a city.</p></div>
              ) : (
                <div className="py-2">
                  {(Object.keys(results) as Hit["kind"][]).map((k) => {
                    const list = results[k].slice(0, 3); if (!list.length) return null;
                    const Icon = ICON[k];
                    return (
                      <div key={k} className="px-2 py-1">
                        <div className="flex items-center gap-2 px-3 py-2 text-caption font-medium uppercase tracking-wider text-mute"><Icon className="h-3.5 w-3.5" />{k}<span className="text-faint">{results[k].length}</span></div>
                        {list.map((h) => {
                          const idx = flat.indexOf(h);
                          return (
                            <button key={h.id} onMouseEnter={() => setCursor(idx)} onClick={() => go(h)}
                              className={`flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left transition-colors ${cursor === idx ? "bg-sunk" : ""}`}>
                              {h.tone ? <Avatar name={h.title} tone={h.tone} size={30} square={k !== "People"} /> : <span className="flex h-[30px] w-[30px] items-center justify-center rounded-sm bg-ink text-paper"><Icon className="h-3.5 w-3.5" /></span>}
                              <span className="min-w-0 flex-1"><span className="block truncate text-body font-medium">{h.title}</span><span className="block truncate text-small text-mute">{h.sub}</span></span>
                              {cursor === idx && <CornerDownLeft className="h-3.5 w-3.5 text-mute" />}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="hidden items-center gap-4 border-t border-line bg-surface px-4 py-2.5 text-[11px] text-mute md:flex"><span>↑↓ navigate</span><span>↵ open</span><span>esc close</span></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
