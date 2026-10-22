import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Music4, Users, HeartHandshake } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { editorialImages } from "@/data/gallery";
import { contactLinks } from "@/data/siteConfig";
import { useIsDesktop } from "@/hooks";

const HIGHLIGHTS = [
    {
        icon: Users,
        title: "Dance for different age groups",
        body: "Classes are grouped so beginners, children and adults each work at a pace that suits them.",
    },
    {
        icon: Music4,
        title: "Zumba",
        body: "Music-led sessions where fitness arrives as a side effect of moving well.",
    },
    {
        icon: HeartHandshake,
        title: "Wedding & event choreography",
        body: "Routines built around your song, your people and your stage — practised until they feel natural.",
    },
];

/**
 * DanceShowcase (E) — the energetic half of the institute.
 *
 * One full-width image band on a bold cobalt field, with the studio's palette
 * for accents. Practice/performance videos live on the institute's official
 * Instagram (linked honestly below) — nothing is embedded that doesn't exist.
 */
export default function DanceShowcase() {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();
    const parallax = isDesktop && !reduce;

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const bandY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

    const { danceShowcase } = editorialImages;

    return (
        <section
            id="dance"
            data-tone="dark"
            ref={ref}
            aria-labelledby="dance-title"
            className="relative isolate overflow-hidden bg-blue py-24 sm:py-28 lg:py-36"
        >
            <div className="relative">
                <div className="shell">
                    {/* Heading */}
                    <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-12">
                        <div className="lg:col-span-7">
                            <SectionHeading
                                id="dance-title"
                                tone="dark"
                                number="04"
                                eyebrow="Dance experience"
                                title={
                                    <>
                                        A more energetic{" "}
                                        <span className="italic text-yellow">rhythm</span>.
                                    </>
                                }
                                standfirst="Wider frames, longer lines, and the moment a rehearsal becomes a performance."
                            />
                        </div>

                        <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9 lg:self-end">
                            <p className="border-l border-white/25 pl-5 text-[0.975rem] leading-[1.7] text-white/75">
                                Dance is taught as a craft: posture, timing, control
                                and then freedom — practised in front of mirrors and
                                finished on stage.
                            </p>
                        </Reveal>
                    </div>

                    {/* Full-bleed image band with restrained parallax */}
                    <div className="relative mt-14 overflow-hidden rounded-[18px] lg:mt-20 lg:rounded-[22px]">
                        <motion.div
                            style={parallax ? { y: bandY } : undefined}
                            className="scale-110"
                        >
                            <SmartImage
                                image={danceShowcase.wide}
                                sizes="92vw"
                                className="aspect-[16/10] w-full sm:aspect-[16/9] lg:aspect-[21/9]"
                                position="50% 34%"
                            />
                        </motion.div>

                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(56,91,232,0.9)_0%,rgba(56,91,232,0.2)_45%,transparent_70%)]"
                        />

                        {/* Overlaid pull-quote — readable, low-contrast-safe */}
                        <Reveal
                            className="absolute inset-x-0 bottom-0 flex flex-col justify-end gap-2 p-5 sm:p-8 lg:p-12"
                        >
                            <p className="eyebrow text-yellow">On the floor</p>
                            <p className="max-w-[26rem] font-display text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.1] text-white sm:max-w-[34rem]">
                                “Practice until the count disappears.”
                            </p>
                        </Reveal>
                    </div>

                    {/* Supporting trio of images — varied proportions */}
                    <div className="mt-6 grid grid-cols-12 gap-4 sm:gap-5">
                        <Reveal className="col-span-7 sm:col-span-4">
                            <SmartImage
                                image={danceShowcase.group}
                                sizes="(max-width: 639px) 60vw, 30vw"
                                className="aspect-[4/3] w-full rounded-[14px]"
                            />
                        </Reveal>
                        <Reveal delay={0.08} className="col-span-5 sm:col-span-4">
                            <SmartImage
                                image={danceShowcase.zumba}
                                sizes="(max-width: 639px) 40vw, 30vw"
                                className="aspect-[3/4] w-full rounded-[14px]"
                                position="50% 30%"
                            />
                        </Reveal>
                        <Reveal delay={0.16} className="col-span-12 sm:col-span-4">
                            <SmartImage
                                image={danceShowcase.wedding}
                                sizes="(max-width: 639px) 92vw, 30vw"
                                className="aspect-[16/10] w-full rounded-[14px] sm:aspect-[4/3]"
                            />
                        </Reveal>
                    </div>

                    {/* Highlights as editorial rows, not cards */}
                    <RevealGroup className="mt-16 grid grid-cols-1 gap-x-10 gap-y-0 lg:mt-24 lg:grid-cols-3">
                        {HIGHLIGHTS.map(({ icon: Icon, title, body }, i) => (
                            <RevealItem
                                key={title}
                                className="border-t border-white/20 py-7 lg:py-8"
                            >
                                <div className="flex items-start gap-4">
                                    <span className="eyebrow mt-1 tabular-nums text-white/45">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3">
                                            <Icon
                                                className="h-4 w-4 shrink-0 text-yellow"
                                                aria-hidden="true"
                                            />
                                            <h3 className="font-display text-[1.4rem] leading-tight text-white sm:text-[1.55rem]">
                                                {title}
                                            </h3>
                                        </div>
                                        <p className="mt-2.5 text-[0.95rem] leading-[1.65] text-white/70">
                                            {body}
                                        </p>
                                    </div>
                                </div>
                            </RevealItem>
                        ))}
                    </RevealGroup>

                    {/* CTA */}
                    <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-white/20 pt-8">
                        <a
                            href="#enquiry"
                            className="group inline-flex items-center gap-2 rounded-[11px] bg-white px-6 py-3.5 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-paper"
                        >
                            Enquire about choreography
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <a
                            href="#gallery"
                            className="rule-link text-[15px] text-white/70 hover:text-white"
                        >
                            See the students in the gallery
                        </a>
                        <a
                            href={contactLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rule-link text-[15px] text-white/70 hover:text-white"
                        >
                            Watch class videos on Instagram
                        </a>
                        <a
                            href={contactLinks.googleMapsPlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rule-link text-[15px] text-white/70 hover:text-white"
                        >
                            More videos on Google Maps
                        </a>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
