import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

/**
 * PaperArtwork — a cut-paper collage that comes apart as you scroll.
 *
 * The sheets are stacked into a rosette while the section enters, then drift
 * outward — each piece on its own little window of the scroll — until the
 * composition is scattered across the frame. Because the scatter is bound to
 * the section's scroll position (not a one-shot animation), scrolling back up
 * pulls every piece home again. Reduced motion holds the assembled collage.
 *
 * Purely decorative: the copy carries the meaning.
 */

const PIECES = [
    { type: "blob", color: "#f0e7ff", size: 92, left: 50, top: 52, dx: -70, dy: 120, rot: -18, start: 0.04 },
    { type: "circle", color: "#fde68a", size: 66, left: 50, top: 46, dx: 150, dy: -150, rot: 0, start: 0.1 },
    { type: "blob", color: "#ec4899", size: 56, left: 53, top: 54, dx: -175, dy: 135, rot: 40, start: 0.16 },
    { type: "circle", color: "#be185d", size: 20, left: 50, top: 50, dx: 30, dy: -70, rot: 0, start: 0.05 },
    { type: "square", color: "#8b5cf6", size: 15, left: 67, top: 38, dx: 215, dy: -40, rot: 120, start: 0.24 },
    { type: "circle", color: "#ff6b6b", size: 12, left: 33, top: 62, dx: -215, dy: 60, rot: 0, start: 0.3 },
    { type: "triangle", color: "#fbbf24", size: 15, left: 66, top: 63, dx: 185, dy: 175, rot: 160, start: 0.22 },
    { type: "squiggle", color: "#ec4899", size: 16, left: 38, top: 34, dx: -120, dy: -175, rot: 30, start: 0.28 },
    { type: "ring", color: "#8b5cf6", size: 12, left: 60, top: 68, dx: 120, dy: 205, rot: 0, start: 0.34 },
    { type: "circle", color: "#be185d", size: 7, left: 40, top: 44, dx: -185, dy: -120, rot: 0, start: 0.38 },
    { type: "halfmoon", color: "#fde68a", size: 14, left: 50, top: 70, dx: 20, dy: 215, rot: -40, start: 0.26 },
];

function Shape({ type, color, className }) {
    const svg = {
        className,
        viewBox: "0 0 100 100",
        "aria-hidden": "true",
        focusable: "false",
    };
    switch (type) {
        case "circle":
            return (
                <svg {...svg}>
                    <circle cx="50" cy="50" r="48" fill={color} />
                </svg>
            );
        case "ring":
            return (
                <svg {...svg}>
                    <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="14" />
                </svg>
            );
        case "square":
            return (
                <svg {...svg}>
                    <rect x="8" y="8" width="84" height="84" rx="18" fill={color} />
                </svg>
            );
        case "triangle":
            return (
                <svg {...svg}>
                    <path d="M50 8 92 84 8 84Z" fill={color} />
                </svg>
            );
        case "squiggle":
            return (
                <svg {...svg} fill="none">
                    <path
                        d="M10 62c9-26 19 26 28 0s19 26 28 0 12 12 24-8"
                        stroke={color}
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                </svg>
            );
        case "halfmoon":
            return (
                <svg {...svg}>
                    <path d="M52 4a46 46 0 0 0 0 92 34 34 0 0 1 0-92Z" fill={color} />
                </svg>
            );
        case "blob":
        default:
            return (
                <svg {...svg}>
                    <path
                        d="M50 4c17 6 31 15 38 29 7 14 5 30-3 42-8 13-22 21-39 24-5 1-10 1-15 0-17-3-31-11-39-24-8-12-10-28-3-42C19 19 33 10 50 4Z"
                        fill={color}
                    />
                </svg>
            );
    }
}

function ScatterPiece({ piece, progress, reduce }) {
    const { type, color, size, left, top, dx, dy, rot, start } = piece;
    const end = Math.min(1, start + 0.5);

    const x = useTransform(progress, [start, end], [0, dx]);
    const y = useTransform(progress, [start, end], [0, dy]);
    const rotate = useTransform(progress, [start, end], [0, rot]);
    const scale = useTransform(progress, [start, end], [1, 0.92]);

    return (
        <div
            className="absolute"
            style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${size}%`,
                transform: "translate(-50%, -50%)",
            }}
        >
            <motion.div
                className="aspect-square w-full"
                style={reduce ? undefined : { x, y, rotate, scale }}
            >
                <Shape
                    type={type}
                    color={color}
                    className="h-full w-full drop-shadow-[0_12px_22px_rgba(41,33,43,0.14)]"
                />
            </motion.div>
        </div>
    );
}

export default function PaperArtwork() {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    return (
        <section
            id="paper"
            data-tone="light"
            aria-labelledby="paper-title"
            ref={ref}
            className="section relative overflow-hidden bg-blossom"
        >
            {/* Soft paper wash behind everything */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.5] [background:radial-gradient(60%_50%_at_20%_10%,#fff_0%,transparent_60%),radial-gradient(55%_45%_at_90%_90%,#f0e7ff_0%,transparent_60%)]"
            />

            <div className="shell relative">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-x-14">
                    {/* Copy */}
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="paper-title"
                            eyebrow="Cut & layered"
                            title={
                                <>
                                    Colour, trimmed by{" "}
                                    <span className="italic text-pink">hand</span>.
                                </>
                            }
                            standfirst="Before a brush is lifted, paper is folded, cut and stacked. It is where the youngest students learn shape, overlap and contrast — and where every class quietly begins."
                        />
                        <Reveal delay={0.1}>
                            <p className="mt-6 max-w-[32rem] text-[1.02rem] leading-[1.72] text-muted">
                                The collage is built from the same palette the studio
                                works in. Scroll past it and the sheets drift apart;
                                scroll back and they settle into place again.
                            </p>
                        </Reveal>
                    </div>

                    {/* The scatter collage */}
                    <div className="lg:col-span-7">
                        <Reveal>
                            <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
                                {PIECES.map((piece, i) => (
                                    <ScatterPiece
                                        key={i}
                                        piece={piece}
                                        progress={scrollYProgress}
                                        reduce={reduce}
                                    />
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
