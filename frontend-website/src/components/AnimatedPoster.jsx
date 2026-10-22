import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import Magnetic from "@/components/Magnetic";
import { MaskReveal } from "@/components/Reveal";
import { editorialImages } from "@/data/gallery";
import { ease } from "@/lib/motion";

/**
 * AnimatedPoster — an original, kinetic "event poster" for the studio.
 *
 * In the spirit of animated dance-culture posters (bold stacked type, a word
 * that rolls through the disciplines, crop marks, a rotating ring) but built
 * entirely with the site's own motion stack and its real assets — no third-
 * party animation files and nothing invented: the featured image is authentic
 * Kala Mandir studio photography and the words are the classes actually
 * taught. Purely decorative motion; with reduced motion the poster simply
 * holds a still composition.
 */

const ROLLING = ["DANCE", "CRAFT", "MOVEMENT", "COLOUR"];
const DISCIPLINES = ["Drawing", "Painting", "Art & Craft", "Dance", "Zumba", "Choreography"];

export default function AnimatedPoster() {
    const reduce = useReducedMotion();
    const [wi, setWi] = useState(0);
    const { danceShowcase } = editorialImages;

    useEffect(() => {
        if (reduce) return;
        const id = setInterval(() => setWi((v) => (v + 1) % ROLLING.length), 2400);
        return () => clearInterval(id);
    }, [reduce]);

    return (
        <section
            id="poster"
            data-tone="light"
            aria-labelledby="poster-title"
            className="relative bg-paper py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                <div className="mx-auto max-w-[46rem]">
                    <p className="eyebrow mb-6 text-center text-muted">
                        The studio, as a poster
                    </p>

                    <MaskReveal>
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-gradient-to-br from-plum via-plum-2 to-charcoal shadow-[0_40px_90px_-50px_rgba(53,21,54,0.7)]">
                            {/* Featured real studio photograph, gently breathing */}
                            <motion.div
                                className="absolute inset-0"
                                animate={
                                    reduce ? undefined : { scale: [1, 1.08, 1], y: [0, -10, 0] }
                                }
                                transition={{
                                    duration: 16,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            >
                                <SmartImage
                                    image={danceShowcase.zumba}
                                    fit="cover"
                                    position="50% 26%"
                                    className="absolute inset-0 h-full w-full"
                                    imgClassName="opacity-90"
                                />
                            </motion.div>

                            {/* Legibility wash */}
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,15,30,0.94)_2%,rgba(53,21,54,0.55)_42%,rgba(53,21,54,0.15)_70%,rgba(53,21,54,0.35)_100%)]"
                            />

                            {/* Rotating dotted ring accent */}
                            <motion.svg
                                aria-hidden="true"
                                viewBox="0 0 120 120"
                                className="absolute -right-10 top-16 h-40 w-40 text-gold/70"
                                animate={reduce ? undefined : { rotate: 360 }}
                                transition={{ duration: 28, ease: "linear", repeat: Infinity }}
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="52"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    strokeDasharray="2 9"
                                    strokeLinecap="round"
                                />
                            </motion.svg>

                            {/* Crop marks */}
                            {[
                                "left-4 top-4 border-l border-t",
                                "right-4 top-4 border-r border-t",
                                "left-4 bottom-4 border-l border-b",
                                "right-4 bottom-4 border-r border-b",
                            ].map((pos) => (
                                <span
                                    key={pos}
                                    aria-hidden="true"
                                    className={`absolute h-5 w-5 border-cream/40 ${pos}`}
                                />
                            ))}

                            {/* Poster content */}
                            <div className="relative z-10 flex h-full flex-col justify-between p-6 sm:p-9">
                                <header className="flex items-start justify-between gap-4">
                                    <span className="eyebrow text-cream/85">
                                        Kala Mandir
                                    </span>
                                    <span className="eyebrow text-right text-cream/60">
                                        Sector 52
                                        <br />
                                        Noida
                                    </span>
                                </header>

                                <div id="poster-title">
                                    <p className="font-display text-[clamp(3rem,13vw,5.5rem)] leading-[0.86] text-transparent [-webkit-text-stroke:1.4px_rgba(255,248,240,0.92)]">
                                        ART
                                    </p>
                                    <div className="relative mt-1 h-[1.05em] overflow-hidden font-display text-[clamp(3rem,13vw,5.5rem)] leading-[1.05] text-flame">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={wi}
                                                initial={{ y: "115%" }}
                                                animate={{ y: 0 }}
                                                exit={{ y: "-115%" }}
                                                transition={{ duration: 0.55, ease }}
                                                className="block"
                                            >
                                                {ROLLING[wi]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <footer className="space-y-5">
                                    <p className="text-[13px] leading-relaxed text-cream/70">
                                        {DISCIPLINES.join("  ·  ")}
                                    </p>
                                    <div className="flex items-center justify-between gap-4">
                                        <Magnetic strength={0.25}>
                                            <a
                                                href="#enquiry"
                                                className="group inline-flex items-center gap-2 rounded-[11px] bg-cream px-5 py-3 text-[14px] font-medium text-plum transition-colors duration-200 hover:bg-white"
                                            >
                                                Enquire
                                                <ArrowUpRight
                                                    aria-hidden="true"
                                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                />
                                            </a>
                                        </Magnetic>
                                        <span className="eyebrow text-cream/55">
                                            Est. in the studio
                                        </span>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </MaskReveal>

                    <p className="mx-auto mt-6 max-w-[34rem] text-center text-[14px] leading-relaxed text-muted">
                        A kinetic poster built from the studio's own photography and
                        the classes it actually teaches — nothing here is stock.
                    </p>
                </div>
            </div>
        </section>
    );
}
