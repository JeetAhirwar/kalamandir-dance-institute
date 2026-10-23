import { useRef, useState } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import Magnetic from "@/components/Magnetic";
import LoopVideo from "@/components/LoopVideo";
import { LineReveal, Reveal } from "@/components/Reveal";
import { instituteVideo } from "@/data/videos";
import { siteConfig } from "@/data/siteConfig";
import { useHoverCapable } from "@/hooks";

/**
 * Hero — the opening viewport, built on the studio's own film.
 *
 * The clip runs edge to edge under a plum scrim so the art pinks and the dance
 * plums both read through it, and the headline sits on the darker left half of
 * the frame. Pointer parallax moves the video layer only — the copy, the nav
 * and the buttons stay put, which is what keeps the effect subtle rather than
 * seasick-making. Touch devices and reduced-motion visitors get a still frame.
 */

/* The backdrop is drawn larger than the viewport so a few pixels of drift
   never exposes an edge. */
const DRIFT_X = 9; // px at the extremes of the pointer travel
const DRIFT_Y = 7;

export default function Hero() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const hoverCapable = useHoverCapable();
    const parallax = hoverCapable && !reduce;

    const [playing, setPlaying] = useState(true);

    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const springX = useSpring(pointerX, { stiffness: 52, damping: 17, mass: 0.7 });
    const springY = useSpring(pointerY, { stiffness: 52, damping: 17, mass: 0.7 });
    const videoX = useTransform(springX, (v) => v * DRIFT_X);
    const videoY = useTransform(springY, (v) => v * DRIFT_Y);

    const { hero } = instituteVideo;

    const handlePointerMove = (event) => {
        if (!parallax) return;
        const rect = event.currentTarget.getBoundingClientRect();
        /* Clamped because a pointer event can arrive while the page is still
           scrolling under the cursor, which puts clientY outside the section. */
        const clamp = (n) => Math.min(1, Math.max(-1, n));
        pointerX.set(clamp(((event.clientX - rect.left) / rect.width) * 2 - 1));
        pointerY.set(clamp(((event.clientY - rect.top) / rect.height) * 2 - 1));
    };

    const handlePointerLeave = () => {
        pointerX.set(0);
        pointerY.set(0);
    };

    /* Palette pulled from the students' artwork — the art pinks and the dance
       plums — used as a recurring brand motif. */
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
            data-tone="dark"
            ref={ref}
            aria-labelledby="hero-title"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-charcoal"
        >
            {/* ── Backdrop: the only layer the pointer moves ───────────────── */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    style={
                        parallax && playing
                            ? { x: videoX, y: videoY, scale: 1.05 }
                            : { scale: 1.04 }
                    }
                    className="absolute -inset-[5%]"
                >
                    <LoopVideo
                        src={instituteVideo.src}
                        start={hero.start}
                        end={hero.end}
                        stillAt={hero.stillAt}
                        rate={0.9}
                        eager
                        playing={playing}
                        className="h-full w-full object-cover object-[62%_35%] lg:object-[58%_30%]"
                    />
                </motion.div>

                {/* Scrims — plum over the whole frame, heavier where type sits. */}
                <span className="absolute inset-0 bg-charcoal/58" />
                <span className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(28,15,30,0.88)_0%,rgba(28,15,30,0.44)_54%,rgba(28,15,30,0.7)_100%)] lg:block" />
                <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_top,rgba(28,15,30,0.92)_0%,transparent_100%)]" />
                {/* Magenta bloom, echoing the light trails in the clip. */}
                <span className="absolute inset-0 bg-[radial-gradient(58%_52%_at_74%_34%,rgba(236,72,153,0.3)_0%,transparent_68%)]" />
            </div>

            {/* ── Copy ─────────────────────────────────────────────────────── */}
            <div className="relative mx-auto flex w-full max-w-[85rem] flex-1 items-center px-5 pb-28 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pb-32 lg:pt-36 xl:px-14">
                <div className="w-full max-w-[40rem]">
                    {/* Studio descriptor */}
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
                        className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2 text-cream/65"
                    >
                        <span className="h-px w-7 bg-white/30" aria-hidden="true" />
                        <span>{siteConfig.tagline}</span>
                        <span className="text-cream/35" aria-hidden="true">
                            ·
                        </span>
                        <span>Sector 52, Noida</span>
                    </motion.p>

                    {/* Headline */}
                    <h1
                        id="hero-title"
                        className="mt-6 font-display text-[clamp(2.9rem,9.5vw,4.6rem)] leading-[0.94] tracking-[-0.02em] text-cream lg:text-[clamp(4.2rem,6.6vw,6.9rem)]"
                    >
                        <LineReveal delay={0.35}>Where Art</LineReveal>
                        <LineReveal delay={0.47}>
                            Comes{" "}
                            <span className="italic text-pink">Alive</span>
                            <span className="text-cream/35">.</span>
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

                    {/* Statement */}
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
                        className="mt-6 max-w-[30rem] text-[1.0625rem] leading-[1.6] text-cream/80 sm:text-[1.125rem]"
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
                        <Magnetic>
                            <a
                                href="#classes"
                                className="btn-wipe group inline-flex items-center justify-center gap-2 rounded-[11px] bg-pink px-7 py-4 text-[15px] font-medium tracking-[0.01em] text-white"
                                style={{ "--wipe-fill": "var(--color-rose)" }}
                            >
                                <span className="btn-wipe__label" data-text="Explore Classes">
                                    <span className="btn-wipe__text">Explore Classes</span>
                                </span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </Magnetic>

                        <Magnetic strength={0.25}>
                            <a
                                href="#gallery"
                                className="group inline-flex items-center justify-center gap-2 rounded-[11px] border border-white/30 px-7 py-4 text-[15px] tracking-[0.01em] text-cream transition-colors duration-200 hover:border-white/70 hover:bg-white/10"
                            >
                                See Student Artwork
                            </a>
                        </Magnetic>
                    </motion.div>
                </div>
            </div>

            {/* ── Footer row: scroll cue + a real control for the backdrop ─── */}
            <div className="relative mx-auto flex w-full max-w-[85rem] items-end justify-between gap-6 px-5 pb-8 sm:px-8 lg:px-10 xl:px-14">
                <motion.div
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.25 }}
                    className="hidden items-center gap-3 text-cream/55 lg:flex"
                    aria-hidden="true"
                >
                    <span className="grid h-8 w-8 place-items-center rounded-full border border-white/25">
                        <motion.span
                            animate={reduce ? undefined : { y: [0, 4, 0] }}
                            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <ArrowDown className="h-3.5 w-3.5" />
                        </motion.span>
                    </span>
                    <span className="eyebrow">Scroll</span>
                </motion.div>

                <button
                    type="button"
                    onClick={() => setPlaying((v) => !v)}
                    aria-label={playing ? "Pause the background film" : "Play the background film"}
                    className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 py-2 text-cream/75 backdrop-blur-sm transition-colors duration-200 hover:border-white/45 hover:bg-white/[0.14] hover:text-cream"
                >
                    {playing ? (
                        <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                    ) : (
                        <Play aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    <span className="eyebrow">{playing ? "Pause film" : "Play film"}</span>
                </button>
            </div>

            {/* Bottom transition rule into the next section */}
            <div className="relative">
                <Reveal
                    className="h-px w-full origin-center bg-white/15"
                    aria-hidden="true"
                />
            </div>
        </section>
    );
}
