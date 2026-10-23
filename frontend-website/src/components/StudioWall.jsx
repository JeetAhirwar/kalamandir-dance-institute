import { useState } from "react";
import { useReducedMotion } from "motion/react";
import SmartImage from "@/components/SmartImage";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { studioLife } from "@/data/gallery";
import { useHoverCapable } from "@/hooks";

/**
 * StudioWall — an "Around the studio" photo wall hung directly below the
 * poster. Real, institute-supplied class photography is shown as framed
 * pieces pinned to a dark plum wall: each hangs at a slight angle and
 * straightens and lifts on hover. Nothing is invented — every caption and tag
 * describes only what is visible, and no student is named.
 */

// A deterministic, gentle scatter — the wall reads pinned, not aligned.
const TILT = [-2.4, 1.7, -1.3, 2.1, -1.7, 1.4, -2.0];
const EASE = "cubic-bezier(0.22,0.61,0.36,1)";

function Tile({ photo, tilt, offsetClass, spanClass, reduce, canHover }) {
    const [hover, setHover] = useState(false);
    // The pinned-angle + straighten-on-hover only makes sense where a cursor
    // can hover. On touch (and reduced motion) tiles hang straight.
    const useTilt = canHover && !reduce;
    const transform = useTilt
        ? `rotate(${hover ? 0 : tilt}deg) scale(${hover ? 1.035 : 1})`
        : undefined;

    return (
        <RevealItem className={`${spanClass} ${offsetClass}`}>
            <figure
                onMouseEnter={() => useTilt && setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ transform, transition: useTilt ? `transform 0.5s ${EASE}` : undefined }}
                className={`relative rounded-[10px] bg-white p-2.5 shadow-[0_28px_60px_-34px_rgba(0,0,0,0.75)] focus-within:z-20 sm:p-3${useTilt ? " will-change-transform" : ""}`}
            >
                <SmartImage
                    image={photo}
                    sizes="(max-width: 639px) 88vw, (max-width: 1023px) 46vw, 30vw"
                    className="rounded-[4px]"
                    imgClassName="transition-transform duration-[650ms] ease-out"
                />
                <figcaption className="flex items-baseline justify-between gap-3 px-0.5 pb-0.5 pt-2.5">
                    <span className="font-display text-[15px] leading-tight text-text sm:text-[16px]">
                        {photo.caption}
                    </span>
                    <span className="eyebrow shrink-0 text-[#b0a0aa]">
                        {photo.tag}
                    </span>
                </figcaption>
            </figure>
        </RevealItem>
    );
}

export default function StudioWall() {
    const reduce = useReducedMotion();
    const canHover = useHoverCapable();
    const tiltActive = canHover && !reduce;

    return (
        <section
            id="studio"
            data-tone="dark"
            aria-labelledby="studio-title"
            className="section relative overflow-hidden bg-gradient-to-b from-charcoal via-plum to-plum-2"
        >
            {/* warm spotlight over the wall */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -top-24 h-[26rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(251,191,36,0.16),transparent_70%)]"
            />

            <div className="shell relative">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="studio-title"
                        eyebrow="Around the studio"
                        tone="dark"
                        title={
                            <>
                                Everyday, at the easel{" "}
                                <span className="italic text-gold">
                                    and on the floor
                                </span>
                                .
                            </>
                        }
                        standfirst="A wall of real moments from Kala Mandir — classes in progress, work drying, warm-ups between routines."
                        className="max-w-[36rem]"
                    />
                    <Reveal delay={0.1} className="lg:pb-2">
                        <p className="max-w-[16rem] text-[14px] leading-relaxed text-cream/55">
                            Photographs from the studio's own archive.
                            {tiltActive && (
                                <> Hover a piece to bring it straight.</>
                            )}
                        </p>
                    </Reveal>
                </div>

                <RevealGroup className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:mt-16 lg:grid-cols-3 lg:gap-8">
                    {studioLife.map((photo, i) => (
                        <Tile
                            key={photo.id}
                            photo={photo}
                            tilt={TILT[i % TILT.length]}
                            reduce={reduce}
                            canHover={canHover}
                            spanClass={i === 0 ? "col-span-2 lg:col-span-2" : "col-span-1"}
                            offsetClass={
                                i % 2 === 1 ? "lg:mt-10" : "lg:mt-0"
                            }
                        />
                    ))}
                </RevealGroup>
            </div>
        </section>
    );
}
