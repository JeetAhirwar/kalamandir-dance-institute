"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** ScrollProgress — hairline gold-pink bar tracking page scroll. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-gradient-to-r from-pink via-gold to-violet"
      style={{ scaleX }}
    />
  );
}
