"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { heroFallback } from "@/data/media";
import { TextReveal } from "@/lib/motion";
import SmartImage from "@/components/SmartImage";
import { Paisley } from "@/components/Motifs";
import { Petals } from "@/components/Flair";

/**
 * HeroCinematic — full-screen opening.
 *
 * If the client drops a real recording at `public/videos/hero.mp4`, it plays
 * as the background (autoplay, muted, looped). Without a video it falls back
 * to a cinematic treatment of an authentic studio photograph — slow Ken Burns
 * motion, plum-to-transparent overlay, gold grain and parallax flourishes.
 * Either way the headline, a one-line statement and the two CTAs sit above
 * the fold at 1280×800.
 */
export default function HeroCinematic() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 0.8], ["0%", "18%"]);
  const contentFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], ["1.08", "1.18"]);

  /* Probe for a client-supplied hero video. No file → no 404 noise. */
  useEffect(() => {
    let cancelled = false;
    fetch("/videos/hero.mp4", { method: "HEAD" })
      .then((res) => {
        if (!cancelled && res.ok) setHasVideo(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-plum text-white"
    >
      {/* ── Background: video (if present) or cinematic image ─────────── */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 -z-10">
        {hasVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/videos/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster={heroFallback.fallback}
          />
        ) : (
          <div className="h-full w-full">
            <div className="h-full w-full [filter:saturate(1.08)]">
              {!reduce && (
                <motion.div
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1.12 }}
                  transition={{ duration: 22, ease: [0.3, 0, 0.3, 1], repeat: Infinity, repeatType: "mirror" }}
                  className="h-full w-full"
                >
                  <SmartImage
                    image={heroFallback}
                    priority
                    className="h-full w-full"
                  />
                </motion.div>
              )}
              {reduce && (
                <div className="h-full w-full">
                  <SmartImage image={heroFallback} priority className="h-full w-full" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legibility scrims */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,15,30,0.94)_0%,rgba(28,15,30,0.55)_38%,rgba(28,15,30,0.18)_70%,rgba(28,15,30,0.5)_100%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_20%,rgba(236,72,153,0.16),transparent_55%),radial-gradient(90%_80%_at_85%_30%,rgba(139,92,246,0.14),transparent_55%)]" />
      </motion.div>

      {/* Floating paisley + drifting petals */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-8 top-24 -z-10 hidden lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -14, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Paisley className="h-24 w-16 text-gold/40" />
        </motion.div>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-32 -z-10 hidden lg:block"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 12, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          <Paisley className="h-20 w-14 text-pink/40" />
        </motion.div>
      </motion.div>
      <Petals count={14} className="-z-10" />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <motion.div
        style={{ y: reduce ? undefined : contentY, opacity: reduce ? undefined : contentFade }}
        className="shell relative flex flex-1 flex-col justify-center pb-24 pt-32 lg:pb-28"
      >
        {/* Studio descriptor */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-white/70"
        >
          <span className="h-px w-8 bg-gold" aria-hidden="true" />
          <span>Art &amp; Dance Institute</span>
          <span className="text-white/35" aria-hidden="true">·</span>
          <span>Sector 52, Noida</span>
        </motion.p>

        {/* Cinematic headline */}
        <h1
          id="hero-title"
          className="mt-5 max-w-[14ch] font-display text-[clamp(3rem,10vw,7rem)] leading-[0.95] tracking-[-0.02em] text-white"
        >
          <TextReveal text="Where Art" delay={0.35} />
          <br />
          <span className="italic">
            <TextReveal text="Comes Alive" delay={0.5} className="text-gradient-gold" />
          </span>
          <span className="text-white/35">.</span>
        </h1>

        {/* Statement */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-6 max-w-[32rem] text-[1.05rem] leading-[1.65] text-white/80 sm:text-[1.15rem]"
        >
          Two disciplines, one neighbourhood studio — dance for every age,
          art from first pencil line to finished canvas.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.22, 0.61, 0.36, 1] }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Link
            href="/admission"
            className="btn-shine group inline-flex items-center justify-center gap-2 rounded-[11px] bg-gold px-7 py-4 text-[0.95rem] font-semibold text-plum transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--color-gold)_82%,white)]"
          >
            Book a visit
            <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
          <Link
            href="/dance"
            className="inline-flex items-center justify-center gap-2 rounded-[11px] border border-white/30 px-7 py-4 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
          >
            See the dance studio
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-white/50 lg:flex"
        aria-hidden="true"
      >
        <motion.span
          animate={reduce ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/25"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
