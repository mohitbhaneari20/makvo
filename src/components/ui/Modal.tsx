"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ open, onClose, children, title, width = "max-w-2xl", sheet = true }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string; width?: string; sheet?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = prev; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-midnight/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-paper shadow-pop ${width} ${sheet ? "rounded-t-lg md:rounded-lg" : "rounded-lg"}`}
            initial={{ opacity: 0, y: 28, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-mute transition hover:bg-sunk hover:text-ink">
              <X className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
