"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

export function Popover({ trigger, children, align = "left", width = "w-64", up }: { up?: boolean; trigger: (o: { open: boolean; toggle: () => void }) => React.ReactNode; children: (close: () => void) => React.ReactNode; align?: "left" | "right"; width?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", d); document.addEventListener("keydown", k);
    return () => { document.removeEventListener("mousedown", d); document.removeEventListener("keydown", k); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }} transition={{ duration: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
            className={`absolute z-50 ${up ? "bottom-full mb-2 origin-bottom" : "mt-2 origin-top"} ${width} overflow-hidden rounded-md border border-line bg-surface shadow-pop ${align === "right" ? "right-0" : "left-0"}`}>
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Select<T extends string>({ label, value, options, onChange, all = "Any" }: { label: string; value: T | ""; options: readonly T[]; onChange: (v: T | "") => void; all?: string }) {
  return (
    <Popover width="w-56" trigger={({ open, toggle }) => (
      <button onClick={toggle} className={`inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-4 text-small transition ${value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-transparent text-ink hover:border-ink"}`}>
        <span className={value ? "text-paper/60" : "text-mute"}>{label}</span>
        <span className="font-medium">{value || all}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
    )}>
      {(close) => (
        <ul className="max-h-72 overflow-auto p-1">
          {[["", all] as const, ...options.map((o) => [o, o] as const)].map(([v, l]) => (
            <li key={v || "all"}>
              <button onClick={() => { onChange(v as T | ""); close(); }} className="flex w-full items-center justify-between rounded-xs px-3 py-2 text-left text-small transition hover:bg-sunk">
                {l}{value === v && <Check className="h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Popover>
  );
}
