import { BRAND } from "@/lib/brand";
import type { Availability } from "@/data/types";

/** The MAKVO spark: a four-point star taken from the logo. */
export function Spark({ className = "h-3 w-3", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill={color} d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

type Tone = "neutral" | "accent" | "ink" | "ok" | "outline" | "success" | "info";
export function Badge({ children, tone = "neutral", className = "" }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  const t = {
    neutral: "bg-sunk text-ink",
    accent: "bg-spring text-midnight", // the spark
    ink: "bg-ink text-paper",
    ok: "bg-mantis text-midnight", // growth · open to work
    success: "bg-forest text-praxeti", // hired · success
    info: "bg-nuit text-praxeti", // links · information
    outline: "border border-line text-mute",
  }[tone];
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-medium leading-none ${t} ${className}`}>{children}</span>;
}

/** Mantis always means "open to work". */
export function AvailabilityBadge({ a, className = "" }: { a: Availability; className?: string }) {
  if (a === "Available") return <Badge tone="ok" className={className}><span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-midnight" />Open to work</Badge>;
  if (a === "Limited") return <Badge tone="accent" className={className}>Limited availability</Badge>;
  return <Badge tone="neutral" className={`!text-mute ${className}`}>Booked until Jan</Badge>;
}

export function Verified({ label = "Verified project", compact }: { label?: string; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-midnight px-2 py-1 text-[11px] font-medium leading-none text-praxeti" title={`Completed through ${BRAND.name} and confirmed by the client`}>
      <Spark className="h-3 w-3" color="#DBE64C" />
      {!compact && label}
    </span>
  );
}
