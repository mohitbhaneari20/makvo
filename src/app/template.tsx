"use client";
import { motion } from "framer-motion";

// Quick, calm fade between pages. No movement, so nothing jumps.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}
