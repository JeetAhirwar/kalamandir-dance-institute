import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import LoopVideo from "@/components/LoopVideo";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { instituteVideo } from "@/data/videos";
import { revealKinetic } from "@/lib/motion";
import { useIsDesktop } from "@/hooks";

/**
 * StudioReel (D.1) — the palette, moving.
 *
 * The second placement of the studio's promotional film, cropped to the one
 * passage that is pure colour: a flat brush carrying magenta across white
 * canvas, dissolving into the easel room. It is framed the way the gallery
 * frames a painting — mat board, corner brackets, a caption — so the film
 * reads as a piece in the collection rather than an advertisement.
 *
 * Nothing here claims the clip is footage of this studio or of named students;
 * the caption says what it is.
 */

/* Mat-board gradient — the studio palette end to end, with the cobalt and
   vermilion the institute's own paintings keep returning to. */
const MAT =
    "bg-[conic-gradient(from_200deg_at_50%_50%,var(--color-pink)_0deg,var(--color-flame)_60deg,#e2401f_120deg,var(--color-gold)_180deg,#2f5fe0_250deg,var(--color-violet)_310deg,var(--color-pink)_360deg)]";

const BRACKETS = [
    "left-0 top-0 border-l-2 border-t-2 border-pink rounded-tl-[10px]",
    "right-0 top-0 border-r-2 border-t-2 border-gold rounded-tr-[10px]",
    "left-0 bottom-0 border-l-2 border-b-2 border-[#2f5fe0] rounded-bl-[10px]",
    "right-0 bottom-0 border-r-2 border-b-2 border-flame rounded-br-[10px]",
];

export default function StudioReel() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();
    const parallax = isDesktop && !reduce;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const glowY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

    const { studio } = instituteVideo;

    return (
        <section
            id="film"
            data-tone="light"
            ref={ref}
            aria-labelledby="film-title"
            className="section relative overflow-hidden bg-paper"
        >
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
                    <div className="lg:col-span-7">
                        <SectionHeading
                            id="film-title"
                            number="03"
                            eyebrow="Colour study"
                            title={
                                <>
                                    One brush, loaded{" "}
                                    <span className="italic text-pink">magenta</span>.
                                </>
                            }
                            standfirst="The studio's whole palette arrives in a single gesture — paint taken to a white canvas and drawn across it until it becomes a picture."
                        />
                    </div>

                    <Reveal delay={0.12} variants={revealKinetic} className="lg:col-span-4 lg:col-start-9 lg:self-end">
                        <p className="border-l border-rule pl-5 text-[0.975rem] leading-[1.7] text-muted">
                            Drawing, painting and movement are practised in the same
                            room here. The film keeps cutting between them — a hand at
                            an easel, then a body holding a count.
                        </p>
                    </Reveal>
                </div>

                {/* ── Framed panel ─────────────────────────────────────────── */}
                <div className="relative mt-14 lg:mt-20">
                    {/* Magenta bloom behind the frame */}
                    <motion.div
                        style={parallax ? { y: glowY } : undefined}
                        aria-hidden="true"
                        className="pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 bg-[radial-gradient(58%_58%_at_50%_50%,rgba(236,72,153,0.34)_0%,rgba(139,92,246,0.18)_45%,transparent_72%)] blur-2xl"
                    />

                    <div className={`relative rounded-[28px] p-[3px] shadow-[0_44px_96px_-56px_rgba(53,21,54,0.8)] ${MAT}`}>
                        <div className="rounded-[25px] bg-charcoal p-2.5 sm:p-3.5">
                            <div className="relative overflow-hidden rounded-[18px]">
                                <LoopVideo
                                    src={instituteVideo.src}
                                    start={studio.start}
                                    end={studio.end}
                                    stillAt={studio.stillAt}
                                    poster={studio.poster}
                                    rate={0.9}
                                    className="aspect-[16/9] w-full object-cover"
                                />

                                {/* Scrims keep the caption legible over white canvas.
                                    The brush passage peaks at luma ~220 in the lower
                                    half, so the plate under the caption has to stay
                                    near-opaque rather than tailing off early. */}
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(28,15,30,0.95)_0%,rgba(28,15,30,0.9)_30%,rgba(28,15,30,0.4)_56%,transparent_76%)]"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_28%,rgba(236,72,153,0.22)_0%,transparent_66%)]"
                                />

                                <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 p-4 sm:p-6">
                                    <div>
                                        <p className="eyebrow text-gold">On the easel</p>
                                        <p className="mt-1.5 max-w-[24rem] font-display text-[clamp(1.15rem,2.4vw,1.7rem)] leading-[1.15] text-cream">
                                            Magenta, drawn across white.
                                        </p>
                                    </div>
                                    <p className="text-[11.5px] leading-[1.5] text-cream/55">
                                        From the studio&rsquo;s promotional film
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Corner brackets — the framing detail a print gets. */}
                        {BRACKETS.map((cls) => (
                            <span
                                key={cls}
                                aria-hidden="true"
                                className={`pointer-events-none absolute h-7 w-7 sm:h-9 sm:w-9 ${cls}`}
                                style={{ margin: "-7px" }}
                            />
                        ))}
                    </div>

                    {/* Palette strip + links */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
                        <ul className="flex items-center gap-2" aria-hidden="true">
                            {[
                                "bg-pink",
                                "bg-flame",
                                "bg-[#e2401f]",
                                "bg-gold",
                                "bg-[#2f5fe0]",
                                "bg-violet",
                            ].map((dot) => (
                                <li key={dot} className={`h-2 w-8 rounded-full ${dot}`} />
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-x-7 gap-y-3">
                            <a href="#gallery" className="rule-link text-[15px] text-rose">
                                See the artwork
                                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </a>
                            <a href="#dance" className="rule-link text-[15px] text-text hover:text-rose">
                                Watch the dance floor
                                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
