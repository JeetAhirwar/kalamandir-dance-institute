"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TextReveal } from "@/lib/motion";
import { Paisley, ArchLine } from "@/components/Motifs";
import { Mandala, Petals } from "@/components/Flair";

/**
 * PageHero — the opening band for every inner page.
 *
 * `pillar` chooses identity: "art" → pink bloom on blossomed light,
 * "dance" → deep plum stage with gold; "neutral" → warm cream.
 * The whole band animates in with staged, restrained motion.
 */
export default function PageHero({
  eyebrow,
  title,
  standfirst,
  pillar = "neutral",
  children,
}: {
  eyebrow: string;
  title: string;
  standfirst?: string;
  pillar?: "art" | "dance" | "neutral";
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();

  const palette =
    pillar === "dance"
      ? {
          section: "grain relative isolate overflow-hidden bg-plum text-white",
          eyebrow: "text-gold",
          standfirst: "text-white/70",
          rule: "bg-gold",
          accent: "text-gold",
          flourish: "text-gold/35",
          bloom: "rgba(251,191,36,0.14)",
        }
      : pillar === "art"
        ? {
            section: "relative isolate overflow-hidden bg-blossom text-ink",
            eyebrow: "text-rose",
            standfirst: "text-muted",
            rule: "bg-pink",
            accent: "text-pink",
            flourish: "text-pink/35",
            bloom: "rgba(236,72,153,0.14)",
          }
        : {
            section: "relative isolate overflow-hidden bg-cream text-ink",
            eyebrow: "text-muted",
            standfirst: "text-muted",
            rule: "bg-rose/60",
            accent: "text-rose",
            flourish: "text-rose/30",
            bloom: "rgba(190,24,93,0.10)",
          };

  return (
    <section aria-labelledby="page-title" className={palette.section}>
      {/* Soft colour bloom + rotating mandala flourish */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span
          className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${palette.bloom}, transparent 65%)` }}
        />
        <span
          className="absolute -right-40 bottom-[-10rem] h-[26rem] w-[26rem] rounded-full"
          style={{ background: `radial-gradient(circle, ${palette.bloom}, transparent 65%)` }}
        />
        <Mandala
          reverse={pillar === "dance"}
          className={`absolute -right-16 -top-16 h-64 w-64 opacity-30 sm:h-80 sm:w-80 ${pillar === "dance" ? "text-gold/60" : "text-pink/60"}`}
        />
      </div>

      {/* Petals wash — only on the two pillar heroes */}
      {pillar === "dance" && <Petals count={10} className="[&>span]:hidden sm:[&>span]:block" colors={["bg-gold", "bg-violet", "bg-flame", "bg-pink"]} />}
      {pillar === "art" && <Petals count={10} colors={["bg-pink", "bg-rose", "bg-butter", "bg-violet"]} />}

      {/* Floating paisley */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-16 hidden lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Paisley className={`h-24 w-16 ${palette.flourish}`} />
        </motion.div>
      </motion.div>

      <div className="shell relative pb-16 pt-32 sm:pb-20 lg:pb-28 lg:pt-40">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          className="eyebrow flex items-center gap-3"
        >
          <span className={`h-px w-8 ${palette.rule}`} aria-hidden="true" />
          <span className={palette.eyebrow}>{eyebrow}</span>
        </motion.p>

        <h1
          id="page-title"
          className="mt-5 max-w-[16ch] font-display text-[clamp(2.6rem,7.5vw,5.2rem)] leading-[1.02] tracking-[-0.015em]"
        >
          <span className={pillar === "dance" ? "text-white" : undefined}>
            <TextReveal text={title} delay={0.25} stagger={0.05} />
          </span>
        </h1>

        {standfirst && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
            className={`mt-6 max-w-[34rem] text-[1.02rem] leading-[1.7] sm:text-[1.1rem] ${palette.standfirst}`}
          >
            {standfirst}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}

        <motion.div
          aria-hidden="true"
          initial={reduce ? false : { opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-10 origin-left"
        >
          <ArchLine className={`h-8 w-56 ${palette.flourish}`} />
        </motion.div>
      </div>
    </section>
  );
}
