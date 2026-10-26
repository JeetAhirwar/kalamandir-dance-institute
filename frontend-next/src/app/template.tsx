"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * template.tsx — remounts on every route change, so each navigated page
 * fades and rises in as one unit: the App Router's page-transition slot
 * (exit animations are not native here; the enter choreography carries the
 * feel together with the sticky header's hairline progress cue).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? undefined : { opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
