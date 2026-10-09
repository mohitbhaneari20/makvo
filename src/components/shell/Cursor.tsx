"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** A quiet ring that follows the pointer and grows into a label over [data-cursor] elements. Desktop only. */
export function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 38, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 420, damping: 38, mass: 0.35 });
  const [label, setLabel] = useState<string | null>(null);
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const m = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX); y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      const inner = (e.target as HTMLElement)?.closest?.("button, a[href]:not([data-cursor]), input, textarea, select") as HTMLElement | null;
      setLabel(el && !inner ? el.dataset.cursor ?? null : null);
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  if (!fine) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block" style={{ x: sx, y: sy }}>
      <motion.div animate={{ width: label ? 76 : 14, height: label ? 76 : 14, opacity: label ? 1 : 0 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}
        className="-ml-[7px] -mt-[7px] flex items-center justify-center rounded-full bg-spring text-[12px] font-medium text-midnight mix-blend-normal"
        style={{ translateX: label ? -31 : 0, translateY: label ? -31 : 0 }}>
        {label}
      </motion.div>
    </motion.div>
  );
}
