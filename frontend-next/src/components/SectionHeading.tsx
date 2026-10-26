"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * SectionHeading — numbered eyebrow, serif title (with an italic accent
 * supplied by the caller), generous standfirst. Colour tones adapt per
 * section surface.
 */
export default function SectionHeading({
  id,
  number,
  eyebrow,
  title,
  standfirst,
  tone = "light",
  align = "start",
  children,
  className = "",
}: {
  id: string;
  number?: string;
  eyebrow: string;
  title: React.ReactNode;
  standfirst?: string;
  tone?: "light" | "dark";
  align?: "start" | "center";
  children?: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-white/50" : "text-muted"}`}
      >
        {number && <span className={`tabular-nums ${dark ? "text-gold" : "text-pink/80"}`}>{number}</span>}
        <span className={`h-px w-7 ${dark ? "bg-white/25" : "bg-rule"}`} aria-hidden="true" />
        <span>{eyebrow}</span>
      </motion.p>

      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 0.61, 0.36, 1] }}
        className={`mt-4 max-w-[24ch] font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.06] tracking-[-0.01em] ${
          dark ? "text-white" : "text-ink"
        } ${align === "center" ? "mx-auto" : ""}`}
      >
        {title}
      </motion.h2>

      {standfirst && (
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.18 }}
          className={`mt-5 max-w-[36rem] text-[0.98rem] leading-[1.7] sm:text-[1.05rem] ${dark ? "text-white/65" : "text-muted"} ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {standfirst}
        </motion.p>
      )}

      {children}
    </div>
  );
}
