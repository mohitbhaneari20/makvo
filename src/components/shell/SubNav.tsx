"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function SubNav({ items, id }: { items: { label: string; href: string }[]; id: string }) {
  const path = usePathname();
  return (
    <div className="inline-flex rounded-full bg-sunk p-1" role="tablist">
      {items.map((i) => {
        const on = path === i.href || (i.href !== "/" && path.startsWith(i.href + "/"));
        return (
          <Link key={i.href} href={i.href} role="tab" aria-selected={on} className={`relative rounded-full px-4 py-1.5 text-small font-medium transition-colors ${on ? "text-paper" : "text-mute hover:text-ink"}`}>
            {on && <motion.span layoutId={`sub-${id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
            <span className="relative">{i.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export const DISCOVER_NAV = [{ label: "Work", href: "/discover" }, { label: "Feed", href: "/feed" }];
export const PEOPLE_NAV = [{ label: "People", href: "/people" }, { label: "Teams", href: "/teams" }, { label: "Your network", href: "/network" }];
export const OPP_NAV = [{ label: "Opportunities", href: "/opportunities" }, { label: "Find talent", href: "/talent" }];
