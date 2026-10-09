"use client";
import { useState } from "react";
import { initials } from "@/data/people";
import { portraitFor } from "@/data/photos";

/** Fallback tiles use the approved brand pairings (see the MAKVO app icon tiles). */
const PAIRS: [string, string][] = [
  ["#DBE64C", "#001F3F"], // Spring · Midnight
  ["#1E488F", "#F6F7ED"], // Nuit Blanche · Praxeti
  ["#74C365", "#001F3F"], // Mantis · Midnight
  ["#00804C", "#F6F7ED"], // Picture Book Green · Praxeti
  ["#E7EAD3", "#001F3F"], // Praxeti (deep) · Midnight
  ["#001F3F", "#DBE64C"], // Midnight · Spring
];
const pairFor = (name: string) => PAIRS[[...name].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7) % PAIRS.length];

// `tone` is accepted for API compatibility; colours come from the brand palette.
export function Avatar({ name, size = 40, status, className = "", square }: { name: string; tone?: string; size?: number; status?: "online" | "away" | "offline"; className?: string; square?: boolean }) {
  const [bg, fg] = pairFor(name);
  const [failed, setFailed] = useState(false);
  const photo = !square && !failed ? portraitFor(name, Math.max(96, Math.min(480, Math.round(size * 2.5)))) : null;
  return (
    <span className={`relative flex aspect-square shrink-0 grow-0 items-center justify-center font-semibold leading-none tracking-tight ${square ? "rounded-[28%]" : "rounded-full"} ${!photo && bg === "#001F3F" ? "ring-1 ring-inset ring-praxeti/20" : ""} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size, background: photo ? "rgb(var(--sunk))" : bg, color: fg, fontSize: Math.max(10, size * 0.36) }} aria-label={name}>
      {photo ? (
        <span className="absolute inset-0 overflow-hidden rounded-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={name} width={size} height={size} loading="lazy" draggable={false} onError={() => setFailed(true)} className="block h-full w-full max-w-none object-cover object-center" />
        </span>
      ) : initials(name)}
      {status && (
        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-paper ${status === "online" ? "bg-mantis" : status === "away" ? "bg-spring" : "bg-faint"}`} />
      )}
    </span>
  );
}

export function AvatarStack({ people, size = 28 }: { people: { name: string; tone?: string }[]; size?: number }) {
  return (
    <span className="flex -space-x-2">
      {people.map((p) => (
        <span key={p.name} className="flex rounded-full ring-2 ring-paper"><Avatar name={p.name} size={size} /></span>
      ))}
    </span>
  );
}

/** A people-at-work photo with a brand overlay, for banners. */
export function PhotoBanner({ src, className = "", tint = "midnight", children }: { src: string; className?: string; tint?: "midnight" | "spring"; children?: React.ReactNode }) {
  return (
    <div className={`relative overflow-hidden bg-sunk ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {tint === "midnight"
        ? <div className="absolute inset-0 bg-gradient-to-r from-midnight/80 via-midnight/30 to-transparent" />
        : <div className="absolute inset-0 grad-spring opacity-45 mix-blend-multiply" />}
      {children}
    </div>
  );
}
