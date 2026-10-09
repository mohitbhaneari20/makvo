"use client";
import { motion } from "framer-motion";
import { Spark } from "@/components/ui/Badge";

/** The MAKVO arch motif: rising arches with the spark above. Colours follow the palette order. */
export function Arches({ colors, spark = "rgb(var(--hi))", sparkAt = 1, className = "", heights, images }: { colors: string[]; spark?: string; sparkAt?: number; className?: string; heights?: number[]; images?: (string | null)[] }) {
  const hs = heights ?? colors.map((_, i) => 62 + i * (38 / Math.max(1, colors.length - 1)));
  return (
    <div className={`relative flex h-full items-end gap-[3%] ${className}`} aria-hidden="true">
      {colors.map((c, i) => (
        <motion.div key={i} className="relative flex-1 rounded-t-full" style={{ backgroundColor: c, backgroundImage: images?.[i] ? `url(${images[i]})` : undefined, backgroundSize: "cover", backgroundPosition: "center top", height: `${hs[i]}%` }}
          initial={{ y: "35%", opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}>
          {i === sparkAt && (
            <motion.span className="absolute -left-[22%] -top-[16%] block w-[44%]" initial={{ scale: 0, rotate: -45 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.7 }}>
              <Spark className="h-auto w-full" color={spark} />
            </motion.span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
