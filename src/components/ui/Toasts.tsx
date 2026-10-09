"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useApp } from "@/lib/store";

export function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-8">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} layout initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-midnight ring-1 ring-praxeti/15 py-2.5 pl-2.5 pr-5 text-small text-praxeti shadow-pop">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-spring"><Check className="h-3 w-3 text-midnight" strokeWidth={3.5} /></span>
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
