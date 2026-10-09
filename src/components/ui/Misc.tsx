"use client";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView } from "framer-motion";
import { Star } from "lucide-react";

export function Skeleton({ className = "" }: { className?: string }) { return <div className={`skeleton rounded-xs ${className}`} />; }

export function Counter({ to, prefix = "", suffix = "", decimals = 0, className = "" }: { to: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (n) => setV(n) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={`tabular-nums ${className}`}>{prefix}{v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export function Stars({ value, size = 14, onChange }: { value: number; size?: number; onChange?: (n: number) => void }) {
  return (
    <span className="inline-flex gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const I = (
          <Star width={size} height={size} className={n <= Math.round(value) ? "fill-forest text-forest" : "text-line"} strokeWidth={1.5} />
        );
        return onChange ? (
          <motion.button key={n} whileTap={{ scale: 0.8 }} onClick={() => onChange(n)} aria-label={`${n} stars`}>{I}</motion.button>
        ) : <span key={n}>{I}</span>;
      })}
    </span>
  );
}

export function Reveal({ children, delay = 0, className = "", y = 10 }: { children: React.ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -40px 0px", amount: 0.01 }} transition={{ duration: 0.45, delay: Math.min(delay, 0.15), ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-small font-medium transition-colors ${active ? "border-ink bg-ink text-paper" : "border-ink/15 bg-transparent text-ink hover:border-ink"}`}>
      {children}
    </motion.button>
  );
}

export function SectionHead({ eyebrow, title, action, className = "" }: { eyebrow?: string; title: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-end justify-between gap-6 ${className}`}>
      <div>
        {eyebrow && <div className="t-eyebrow mb-3">{eyebrow}</div>}
        <h2 className="t-h2">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function useFakeLoad(deps: unknown[] = [], ms = 550) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return loading;
}

export function Empty({ title, sub, action }: { title: string; sub: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-md border border-dashed border-ink/20 py-20 text-center">
      <div className="t-h3">{title}</div>
      <p className="mt-2 max-w-sm text-small text-mute">{sub}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
