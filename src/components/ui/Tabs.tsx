"use client";
import { motion } from "framer-motion";

/** Segmented pill tabs: active tab is a Midnight pill (brand product page). */
export function Tabs<T extends string>({ tabs, value, onChange, id, className = "", counts }: { tabs: readonly T[]; value: T; onChange: (t: T) => void; id: string; className?: string; counts?: Partial<Record<T, number>> }) {
  return (
    <div className={`no-scrollbar -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0 ${className}`}>
      <div role="tablist" className="inline-flex gap-1 rounded-full bg-sunk p-1">
        {tabs.map((t) => {
          const on = value === t;
          return (
            <button key={t} role="tab" aria-selected={on} onClick={() => onChange(t)}
              className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-small font-medium transition-colors ${on ? "text-paper" : "text-mute hover:text-ink"}`}>
              {on && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
              <span className="relative">{t}</span>
              {counts?.[t] !== undefined && <span className={`relative ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] ${on ? "bg-spring text-midnight" : "bg-paper text-mute"}`}>{counts[t]}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
