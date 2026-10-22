import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { LineReveal, Reveal } from "@/components/Reveal";
import { editorialImages } from "@/data/gallery";
import { siteConfig } from "@/data/siteConfig";
import { useIsDesktop } from "@/hooks";

/**
 * Hero — the opening viewport, art-directed like a magazine cover.
 *
 * Left: oversized serif headline with an intentional two-line break, a short
 * two-line statement, two CTAs with clearly different weight, and a location
 * label. Right: one dominant photograph with a single smaller overlap.
 *
 * No floating panels, no neon, no invented statistics.
 */
export default function Hero() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();
    const parallaxEnabled = isDesktop && !reduce;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const primaryY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
    const secondaryY = useTransform(scrollYProgress, [0, 1], ["0%", "-9%"]);
    const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
    const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

    const { hero } = editorialImages;

    return (
        <section
            id="home"
            data-tone="dark"
            ref={ref}
            aria-labelledby="hero-title"
            className="grain relative isolate overflow-hidden bg-charcoal"
        >
            {/* Warm gradient wash so type stays readable over photography */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(23,24,27,0.97)_0%,rgba(23,24,27,0.92)_38%,rgba(23,24,27,0.55)_62%,rgba(23,24,27,0.72)_100%)]"
            />

            <div className="relative mx-auto grid min-h-[100svh] w-full max-w-[85rem] grid-cols-1 items-center gap-y-10 px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:grid-cols-12 lg:gap-x-10 lg:px-10 lg:pb-20 lg:pt-32 xl:px-14">
                {/* ── Copy column ─────────────────────────────────────────── */}
                <motion.div
                    style={parallaxEnabled ? { y: copyY, opacity: fade } : undefined}
                    className="relative z-10 order-1 lg:col-span-6 xl:col-span-6"
                >
                    {/* Studio descriptor */}
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-white/50"
                    >
                        <span className="h-px w-7 bg-white/30" aria-hidden="true" />
                        <span>{siteConfig.tagline}</span>
                        <span className="text-white/25" aria-hidden="true">
                            ·
                        </span>
                        <span>Sector 52, Noida</span>
                    </motion.p>

                    {/* Headline */}
                    <h1
                        id="hero-title"
                        className="mt-6 font-display text-[clamp(3rem,10.5vw,7rem)] leading-[0.94] tracking-[-0.02em] text-white"
                    >
                        <LineReveal delay={0.35}>Where Art</LineReveal>
                        <LineReveal delay={0.47}>
                            Comes{" "}
                            <span className="italic text-coral">Alive</span>
                            <span className="text-white/40">.</span>
                        </LineReveal>
                    </h1>

                    {/* Statement — kept to roughly two lines on desktop */}
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                        className="mt-7 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-white/65 sm:text-[1.125rem]"
                    >
                        Discover your creativity through art, dance and movement at
                        Kala Mandir.
                    </motion.p>

                    {/* CTAs — primary has visual priority */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.85, ease: [0.22, 0.61, 0.36, 1] }}
                        className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
                    >
                        <a
                            href="#classes"
                            className="group inline-flex items-center justify-center gap-2 rounded-[11px] bg-paper px-7 py-4 text-[15px] font-medium tracking-[0.01em] text-ink transition-colors duration-200 hover:bg-white"
                        >
                            Explore Classes
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>

                        <a
                            href="#art"
                            className="group inline-flex items-center justify-center gap-2 rounded-[11px] border border-white/22 px-7 py-4 text-[15px] tracking-[0.01em] text-white/85 transition-colors duration-200 hover:border-white/50 hover:text-white"
                        >
                            Discover Our Art
                        </a>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.25 }}
                        className="mt-12 hidden items-center gap-3 text-white/40 lg:flex"
                        aria-hidden="true"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-white/20">
                            <motion.span
                                animate={reduce ? undefined : { y: [0, 4, 0] }}
                                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowDown className="h-3.5 w-3.5" />
                            </motion.span>
                        </span>
                        <span className="eyebrow">Scroll</span>
                    </motion.div>
                </motion.div>

                {/* ── Photography column ──────────────────────────────────── */}
                <div className="relative order-2 lg:col-span-6 xl:col-span-6">
                    {/* Decorative stroke behind the image */}
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 200 200"
                        className="pointer-events-none absolute -right-6 -top-10 hidden h-40 w-40 text-coral/45 lg:block"
                        fill="none"
                    >
                        <motion.path
                            d="M20 150C60 60 130 30 180 46"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            initial={reduce ? undefined : { pathLength: 0 }}
                            animate={reduce ? undefined : { pathLength: 1 }}
                            transition={{ duration: 1.6, delay: 1.1, ease: "easeInOut" }}
                        />
                        <motion.circle
                            cx="180"
                            cy="46"
                            r="4"
                            fill="currentColor"
                            initial={reduce ? undefined : { scale: 0 }}
                            animate={reduce ? undefined : { scale: 1 }}
                            transition={{ duration: 0.4, delay: 2.5 }}
                        />
                    </svg>

                    {/* Dominant image */}
                    <motion.div
                        initial={reduce ? false : { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.5 }}
                        animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
                        transition={{ duration: 1.15, delay: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
                        style={parallaxEnabled ? { y: primaryY } : undefined}
                        className="relative ml-auto w-full max-w-[30rem] lg:max-w-none"
                    >
                        <SmartImage
                            image={hero.primary}
                            priority
                            sizes="(max-width: 1023px) 92vw, 46vw"
                            className="aspect-[4/5] w-full rounded-[18px] sm:aspect-[5/6] lg:aspect-[4/5] lg:rounded-[22px]"
                            position="50% 32%"
                        />
                        {/* subtle inner shadow so the photo sits in the dark scene */}
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-[18px] shadow-[inset_0_0_70px_-24px_rgba(0,0,0,0.75)] lg:rounded-[22px]"
                        />
                    </motion.div>

                    {/* Smaller overlapping image */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.95, ease: [0.22, 0.61, 0.36, 1] }}
                        style={parallaxEnabled ? { y: secondaryY } : undefined}
                        className="absolute -bottom-8 -left-1 w-[38%] max-w-[11rem] sm:w-[32%] sm:max-w-[13rem] lg:-left-14 lg:-bottom-10 lg:max-w-[15.5rem]"
                    >
                        <SmartImage
                            image={hero.secondary}
                            priority
                            sizes="(max-width: 1023px) 40vw, 20vw"
                            className="aspect-[4/5] w-full rounded-[14px] border border-white/12 shadow-[0_28px_60px_-30px_rgba(0,0,0,0.95)] lg:rounded-[16px]"
                            position="50% 30%"
                        />
                        <span className="eyebrow absolute -top-6 left-1 text-white/40">
                            Studio
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom transition rule into the next section */}
            <div className="relative">
                <Reveal
                    className="h-px w-full origin-center bg-white/10"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
}
