"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Flair — the colour-forward decoration set: a rotating mandala, floating
 * petals/confetti, slanted ribbon marquees and hand-drawn underline strokes.
 * Everything is aria-hidden decoration with reduced-motion fallbacks.
 */

/* Rotating mandala — line-art sun of petals. */
export function Mandala({
  className,
  reverse = false,
}: {
  className?: string;
  reverse?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      className={cn("select-none", reverse ? "mandala-spin-rev" : "mandala-spin", className)}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <path
          key={i}
          // petal lines fanned around the centre
          d="M100 22 C112 42 112 62 100 84 C88 62 88 42 100 22 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          transform={`rotate(${(360 / 12) * i} 100 100)`}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <circle
          key={`c-${i}`}
          cx="100"
          cy="12"
          r="2.6"
          fill="currentColor"
          transform={`rotate(${(360 / 8) * i + 15} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="10" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="2.6" fill="currentColor" />
    </svg>
  );
}

/* Floating petals / confetti dots — gentle, infinite drift. */
export function Petals({
  count = 12,
  className,
  colors = ["bg-pink", "bg-gold", "bg-violet", "bg-flame", "bg-rose"],
}: {
  count?: number;
  className?: string;
  colors?: string[];
}) {
  const reduce = useReducedMotion();
  const petals = Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: (i * 97) % 100, // pseudo-spread, deterministic
    top: (i * 53) % 90,
    size: 5 + ((i * 7) % 8),
    color: colors[i % colors.length],
    dur: 7 + ((i * 13) % 7),
    delay: (i * 11) % 6,
    round: i % 3 !== 0, // mix of petals & dots
  }));

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className={cn(
            "absolute block",
            p.round ? "rounded-full" : "rounded-[60%_40%_55%_45%/55%_60%_40%_45%]",
            p.color,
          )}
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: 0.5 }}
          animate={reduce ? undefined : { y: [0, -16, 0], x: [0, 6, -4, 0], opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* Slanted ribbon marquee — a colour band of big serif words. */
export function Ribbon({
  items,
  tone = "plum",
  className,
}: {
  items: string[];
  tone?: "plum" | "pink" | "gold";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const styled = {
    plum: "bg-plum text-gold",
    pink: "bg-gradient-to-r from-pink via-rose to-pink text-white",
    gold: "bg-gradient-to-r from-gold via-[#ffd77e] to-gold text-plum",
  }[tone];

  const row = [...items, ...items];
  return (
    <div
      aria-hidden="true"
      className={cn("ribbon select-none", styled, className)}
    >
      <div
        className="ribbon-track items-center gap-10 py-4 sm:py-5"
        style={reduce ? { animation: "none" } : undefined}
      >
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap pl-10 font-display text-[1.5rem] sm:text-[1.9rem]">
            {item}
            <span className={cn("h-2 w-2 rounded-full", tone === "gold" ? "bg-plum/70" : "bg-gold/80")} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* Hand-drawn underline stroke — for an italic word inside a headline. */
export function Scribble({ className }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 220 22"
      fill="none"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      <motion.path
        d="M4 14 C40 6 78 4 118 8 C150 11 178 10 216 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
      />
    </motion.svg>
  );
}
