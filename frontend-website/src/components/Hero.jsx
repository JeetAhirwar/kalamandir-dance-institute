import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { LineReveal, Reveal } from "@/components/Reveal";
import { editorialImages } from "@/data/gallery";
import { siteConfig } from "@/data/siteConfig";
import { useIsDesktop } from "@/hooks";

/**
 * Hero — the opening viewport, bright and welcoming.
 *
 * Warm ivory ground with soft paint-wash colour. Left: oversized serif
 * headline, a short statement and two CTAs with clearly different weight.
 * Right: authentic Kala Mandir photography — students dancing in front of a
 * backdrop they painted, with a student painting overlapped below.
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

    /* Palette pulled from the students' artwork — the art pinks and the dance
       plums/violets — used as a recurring brand motif. */
    const palette = [
        { bg: "bg-pink", delay: 0.55 },
        { bg: "bg-rose", delay: 0.62 },
        { bg: "bg-flame", delay: 0.69 },
        { bg: "bg-violet", delay: 0.76 },
        { bg: "bg-gold", delay: 0.83 },
        { bg: "bg-lavender", delay: 0.9 },
    ];

    return (
        <section
            id="home"
            data-tone="light"
            ref={ref}
            aria-labelledby="hero-title"
            className="relative isolate overflow-hidden bg-paper"
        >
            {/* Soft paint washes — pink & lavender, with a violet nod to dance.
                Very restrained so type contrast stays high. */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
            >
                <span className="absolute -left-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.16),transparent_65%)]" />
                <span className="absolute -right-40 top-10 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.13),transparent_65%)]" />
                <span className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.16),transparent_65%)]" />
            </div>

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
                        className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-muted"
                    >
                        <span className="h-px w-7 bg-rule" aria-hidden="true" />
                        <span>{siteConfig.tagline}</span>
                        <span className="text-muted/50" aria-hidden="true">
                            ·
                        </span>
                        <span>Sector 52, Noida</span>
                    </motion.p>

                    {/* Headline */}
                    <h1
                        id="hero-title"
                        className="mt-6 font-display text-[clamp(2.9rem,9.5vw,4.6rem)] leading-[0.94] tracking-[-0.02em] text-text lg:text-[clamp(4.2rem,6.6vw,6.9rem)]"
                    >
                        <LineReveal delay={0.35}>Where Art</LineReveal>
                        <LineReveal delay={0.47}>
                            Comes{" "}
                            <span className="italic text-pink">Alive</span>
                            <span className="text-text/35">.</span>
                        </LineReveal>
                    </h1>

                    {/* Palette motif — the studio's colours, from student work */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="mt-5 flex items-center gap-2"
                        aria-hidden="true"
                    >
                        {palette.map(({ bg, delay }, i) => (
                            <motion.span
                                key={i}
                                initial={reduce ? false : { scale: 0 }}
                                animate={reduce ? undefined : { scale: 1 }}
                                transition={{ duration: 0.35, delay, ease: "backOut" }}
                                className={`h-2.5 w-2.5 rounded-full ${bg} motion-reduce:hidden`}
                            />
                        ))}
                    </motion.div>

                    {/* Statement — kept to roughly two lines on desktop */}
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                        className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-muted sm:text-[1.125rem]"
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
                            className="group inline-flex items-center justify-center gap-2 rounded-[11px] bg-rose px-7 py-4 text-[15px] font-medium tracking-[0.01em] text-white transition-colors duration-200 hover:bg-pink"
                        >
                            Explore Classes
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>

                        <a
                            href="#gallery"
                            className="group inline-flex items-center justify-center gap-2 rounded-[11px] border border-rose/25 px-7 py-4 text-[15px] tracking-[0.01em] text-rose transition-colors duration-200 hover:border-rose hover:bg-blossom"
                        >
                            See Student Artwork
                        </a>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.25 }}
                        className="mt-12 hidden items-center gap-3 text-muted/70 lg:flex"
                        aria-hidden="true"
                    >
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-rule">
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
                        className="pointer-events-none absolute -right-6 -top-10 hidden h-40 w-40 text-violet/55 lg:block"
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

                    {/* Dominant image — student dancers + painted backdrop */}
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
                            className="aspect-[4/5] w-full rounded-[18px] border border-white/70 shadow-[0_36px_80px_-46px_rgba(32,33,36,0.5)] sm:aspect-[5/6] lg:aspect-[4/5] lg:rounded-[22px]"
                            position="50% 30%"
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
                            className="aspect-[4/5] w-full rounded-[14px] border-4 border-white shadow-[0_28px_60px_-34px_rgba(32,33,36,0.55)] lg:rounded-[16px]"
                            position="50% 45%"
                        />
                        <span className="eyebrow absolute -top-6 left-1 text-muted">
                            Student work
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom transition rule into the next section */}
            <div className="relative">
                <Reveal
                    className="h-px w-full origin-center bg-rule"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
}
