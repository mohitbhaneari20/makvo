"use client";
import Link from "next/link";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "accent" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

const base = "group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nuit focus-visible:ring-offset-2 focus-visible:ring-offset-paper";
const variants: Record<Variant, string> = {
  primary: "bg-btn text-btn-fg hover:opacity-90",
  accent: "bg-spring text-midnight hover:brightness-95",
  outline: "border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink/[0.03]",
  ghost: "text-ink hover:bg-sunk",
  soft: "bg-sunk text-ink hover:bg-line/70",
};
const sizes: Record<Size, string> = {
  sm: "h-8 rounded-full px-3.5 text-small",
  md: "h-10 rounded-full px-5 text-body",
  lg: "h-12 rounded-full px-7 text-body",
};

export interface ButtonProps {
  variant?: Variant; size?: Size; href?: string; magnetic?: boolean; loading?: boolean;
  className?: string; children?: React.ReactNode; onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean; type?: "button" | "submit"; icon?: React.ReactNode; iconRight?: React.ReactNode; full?: boolean; title?: string; "aria-label"?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", href, magnetic, loading, className = "", children, icon, iconRight, full, ...rest }, ref,
) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;
  const content = (
    <>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {iconRight && <span className="transition-transform duration-300 group-hover:translate-x-0.5">{iconRight}</span>}
    </>
  );
  const el = href ? (
    <Link href={href} className={cls} onClick={rest.onClick as never}>{content}</Link>
  ) : (
    <motion.button ref={ref} whileTap={{ scale: 0.97 }} className={cls} {...(rest as object)} disabled={rest.disabled || loading}>
      {content}
    </motion.button>
  );
  return magnetic ? <Magnetic className={full ? "!block w-full" : ""}>{el}</Magnetic> : el;
});

export function IconButton({ children, className = "", label, onClick, active }: { children: React.ReactNode; className?: string; label: string; onClick?: (e: React.MouseEvent) => void; active?: boolean }) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} aria-label={label} title={label} onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-sunk ${active ? "bg-sunk" : ""} ${className}`}>
      {children}
    </motion.button>
  );
}
