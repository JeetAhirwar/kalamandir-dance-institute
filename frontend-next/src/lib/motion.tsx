"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * lib/motion — shared motion presets.
 * Every animation respects `prefers-reduced-motion`.
 */

export const EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

/* Fade + rise — the standard entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Clip-reveal word line (for text reveals). */
export const lineClip: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

/* Stagger container. */
export function stagger(delayChildren = 0.08, staggerChildren = 0.09): Variants {
  return {
    hidden: {},
    show: {
      transition: { delayChildren, staggerChildren },
    },
  };
}

/* ------------------------------------------------------------------ */

/** whileInView wrapper — fades and rises when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Staggered group of children each wrapped in a motion element. */
export function RevealGroup({
  children,
  className,
  delayChildren = 0.05,
  staggerChildren = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={
        reduce
          ? undefined
          : {
              hidden: {},
              show: { transition: { delayChildren, staggerChildren } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

/** Single item inside a RevealGroup. */
export function RevealItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={
        reduce
          ? undefined
          : {
              hidden: { opacity: 0, y },
              show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word clip reveal for headlines. */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text} role="text">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: "112%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Vertical parallax on scroll — subtle, desktop + motion-safe only. */
export function Parallax({
  children,
  distance = 40,
  className,
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${distance}px`, `${distance}px`]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
