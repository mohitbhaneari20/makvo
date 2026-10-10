"use client";
import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Popover } from "./Dropdown";

/* ---------- Shared trigger pill ---------- */
function Pill({ label, value, active, open, onClick }: { label: string; value: string; active: boolean; open: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-expanded={open} className={`inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-small transition ${active ? "border-ink bg-ink text-paper" : "border-ink/15 bg-transparent text-ink hover:border-ink"}`}>
      <span className={active ? "text-paper/60" : "text-mute"}>{label}</span>
      <span className="font-medium">{value}</span>
      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
  );
}

function Footer({ onReset, onDone, resetDisabled }: { onReset: () => void; onDone: () => void; resetDisabled: boolean }) {
  return (
    <div className="flex items-center justify-between border-t border-line px-4 py-3">
      <button type="button" onClick={onReset} disabled={resetDisabled} className="text-small text-mute transition hover:text-ink disabled:opacity-40">Reset</button>
      <button type="button" onClick={onDone} className="inline-flex h-8 items-center rounded-full bg-btn px-4 text-small font-medium text-btn-fg transition hover:opacity-90">Done</button>
    </div>
  );
}

/* ---------- Range: two-thumb slider with presets ---------- */
export type Range = [number, number];

export function RangeFilter({ label, min, max, step = 1, value, onChange, format, bare = format, presets, unit }: {
  label: string; min: number; max: number; step?: number; value: Range; onChange: (v: Range) => void;
  /** Formats one end of the range. `plus` is set for the top of the scale, which means "or more". */
  format: (n: number, plus?: boolean) => string;
  /** Start of a range in the compact summary, e.g. "8" in "8–12 yrs". Defaults to `format`. */
  bare?: (n: number) => string; presets?: { label: string; range: Range }[]; unit?: string;
}) {
  const [lo, hi] = value;
  const isAll = lo === min && hi === max;
  const end = (n: number) => format(n, n >= max);
  const summary = isAll ? "Any" : lo === min ? `Up to ${end(hi)}` : hi === max ? format(lo, true) : `${bare(lo)}–${end(hi)}`;
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <Popover floating width="w-[300px]" trigger={({ open, toggle }) => <Pill label={label} value={summary} active={!isAll} open={open} onClick={toggle} />}>
      {(close) => (
        <div>
          <div className="px-4 pb-4 pt-4">
            <div className="flex items-baseline justify-between">
              <span className="t-caption">{label}{unit ? ` · ${unit}` : ""}</span>
              <span className="text-small font-medium tabular-nums">{isAll ? "Any" : `${format(lo)} – ${end(hi)}`}</span>
            </div>
            <div className="relative mt-5 h-5">
              <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-sunk" />
              <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
              <input type="range" aria-label={`Minimum ${label.toLowerCase()}`} min={min} max={max} step={step} value={lo}
                onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])} className="range-thumb absolute inset-0 w-full" />
              <input type="range" aria-label={`Maximum ${label.toLowerCase()}`} min={min} max={max} step={step} value={hi}
                onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])} className="range-thumb absolute inset-0 w-full" />
            </div>
            <div className="mt-2 flex justify-between text-[11px] tabular-nums text-faint"><span>{format(min)}</span><span>{format(max, true)}</span></div>
            {presets && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {presets.map((p) => {
                  const on = p.range[0] === lo && p.range[1] === hi;
                  return <button key={p.label} type="button" onClick={() => onChange(p.range)} className={`rounded-full border px-3 py-1 text-[12.5px] transition ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>{p.label}</button>;
                })}
              </div>
            )}
          </div>
          <Footer resetDisabled={isAll} onReset={() => onChange([min, max])} onDone={close} />
        </div>
      )}
    </Popover>
  );
}

/* ---------- Multi-select with counts and optional search ---------- */
export function MultiFilter({ label, options, value, onChange, count, searchable }: {
  label: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void;
  /** How many results each option has, shown beside it. */
  count?: (option: string) => number; searchable?: boolean;
}) {
  const [q, setQ] = useState("");
  const shown = useMemo(() => options.filter((o) => !q || o.toLowerCase().includes(q.toLowerCase())), [options, q]);
  const summary = value.length === 0 ? "Any" : value.length === 1 ? value[0] : `${value[0]} +${value.length - 1}`;
  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);

  return (
    <Popover floating width="w-64" trigger={({ open, toggle: t }) => <Pill label={label} value={summary} active={value.length > 0} open={open} onClick={t} />}>
      {(close) => (
        <div>
          {searchable && (
            <div className="border-b border-line p-2">
              <label className="flex h-9 items-center gap-2 rounded-full bg-sunk px-3"><Search className="h-3.5 w-3.5 text-mute" aria-hidden="true" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${label.toLowerCase()}`} aria-label={`Search ${label.toLowerCase()}`} className="min-w-0 flex-1 bg-transparent text-small outline-none placeholder:text-faint" /></label>
            </div>
          )}
          <ul className="max-h-64 overflow-auto p-1" role="group" aria-label={label}>
            {shown.map((o) => {
              const on = value.includes(o); const n = count?.(o);
              return (
                <li key={o}>
                  <button type="button" role="checkbox" aria-checked={on} aria-label={n !== undefined ? `${o}, ${n}` : o} onClick={() => toggle(o)} className="flex w-full items-center gap-3 rounded-xs px-3 py-2 text-left text-small transition hover:bg-sunk">
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition ${on ? "border-ink bg-ink text-paper" : "border-line"}`} aria-hidden="true">{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                    <span className="flex-1">{o}</span>
                    {n !== undefined && <span className="text-[12px] tabular-nums text-faint">{n}</span>}
                  </button>
                </li>
              );
            })}
            {shown.length === 0 && <li className="px-3 py-4 text-center text-small text-mute">No matches</li>}
          </ul>
          <Footer resetDisabled={value.length === 0} onReset={() => onChange([])} onDone={close} />
        </div>
      )}
    </Popover>
  );
}
