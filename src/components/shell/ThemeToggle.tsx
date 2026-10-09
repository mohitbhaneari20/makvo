"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";

export type ThemePref = "light" | "dark" | "system";
const KEY = "makvo-theme";
const listeners = new Set<(p: ThemePref) => void>();

function apply(pref: ThemePref) {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

/** Theme preference shared by every toggle on the page. Light = Praxeti White, dark = Midnight Mirage. */
export function useTheme() {
  const [pref, setPrefState] = useState<ThemePref>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");
  useEffect(() => {
    let p: ThemePref = "system";
    try { p = (localStorage.getItem(KEY) as ThemePref) || "system"; } catch {}
    setPrefState(p);
    setResolved(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
    const onPref = (np: ThemePref) => { setPrefState(np); setResolved(document.documentElement.dataset.theme === "dark" ? "dark" : "light"); };
    listeners.add(onPref);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSys = () => { let cur: ThemePref = "system"; try { cur = (localStorage.getItem(KEY) as ThemePref) || "system"; } catch {} if (cur === "system") { apply("system"); onPref("system"); } };
    mq.addEventListener("change", onSys);
    return () => { listeners.delete(onPref); mq.removeEventListener("change", onSys); };
  }, []);
  const setPref = useCallback((p: ThemePref) => {
    try { localStorage.setItem(KEY, p); } catch {}
    apply(p);
    listeners.forEach((l) => l(p));
  }, []);
  return { pref, resolved, setPref };
}

/** Icon button that flips between light and dark. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolved, setPref } = useTheme();
  const dark = resolved === "dark";
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setPref(dark ? "light" : "dark")} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} title={dark ? "Light mode" : "Dark mode"}
      className={`relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-ink transition hover:bg-sunk ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={resolved} initial={{ y: 14, opacity: 0, rotate: -40 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -14, opacity: 0, rotate: 40 }} transition={{ duration: 0.2 }} className="flex">
          {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/** Light / Dark / System segmented switch (profile menu). */
export function ThemeSwitch() {
  const { pref, setPref } = useTheme();
  const opts: [ThemePref, typeof Sun, string][] = [["light", Sun, "Light"], ["dark", Moon, "Dark"], ["system", Monitor, "Auto"]];
  return (
    <div className="grid grid-cols-3 gap-1 rounded-full bg-sunk p-1" role="radiogroup" aria-label="Appearance">
      {opts.map(([v, I, l]) => (
        <button key={v} role="radio" aria-checked={pref === v} onClick={() => setPref(v)}
          className={`flex items-center justify-center gap-1.5 rounded-full py-1.5 text-small font-medium transition ${pref === v ? "bg-ink text-paper" : "text-mute hover:text-ink"}`}>
          <I className="h-3.5 w-3.5" />{l}
        </button>
      ))}
    </div>
  );
}
