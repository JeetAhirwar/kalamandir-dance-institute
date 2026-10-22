import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import SplitText from "@/components/SplitText";
import { useIsDesktop } from "@/hooks";
import { studioWalk } from "@/data/gallery";

/**
 * HorizontalWalk — a pinned, horizontally-scrolling filmstrip of real studio
 * and class photography.
 *
 * On desktop the section pins and vertical scroll is translated into horizontal
 * travel across the strip (the classic "scroll sideways" cue). On touch or with
 * reduced motion it degrades to a normal, swipeable horizontal scroller with
 * snap points — same content, no pinning, no surprise.
 *
 * The number of panels and their widths are measured, so the strip always ends
 * flush with the right edge regardless of how many images are added.
 */
export default function HorizontalWalk() {
    const outerRef = useRef(null);
    const trackRef = useRef(null);
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();
    const pinned = isDesktop && !reduce;

    const [range, setRange] = useState(0);

    const { scrollYProgress } = useScroll({
        target: outerRef,
        offset: ["start start", "end end"],
    });
    const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

    // How far the track must travel horizontally to bring its last panel flush
    // to the right edge of the viewport.
    useEffect(() => {
        if (!pinned) {
            setRange(0);
            return;
        }
        const measure = () => {
            const el = trackRef.current;
            if (!el) return;
            setRange(Math.max(0, el.scrollWidth - window.innerWidth));
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [pinned]);

    const panels = studioWalk.map((item, i) => (
        <figure
            key={item.src + i}
            className="relative w-[78vw] shrink-0 snap-start sm:w-[52vw] lg:w-[30rem]"
        >
            <SmartImage
                image={item}
                width={4}
                height={5}
                sizes="(max-width: 639px) 78vw, (max-width: 1023px) 52vw, 30rem"
                className="aspect-[4/5] w-full rounded-[16px] border border-white/10"
                position="50% 40%"
            />
            <span className="eyebrow absolute left-4 top-4 rounded-full bg-plum/70 px-2.5 py-1 text-cream backdrop-blur-sm">
                {String(i + 1).padStart(2, "0")}
            </span>
        </figure>
    ));

    return (
        <section
            id="walk"
            data-tone="dark"
            aria-labelledby="walk-title"
            className="relative bg-plum-2"
        >
            {/* Intro heading sits above the strip */}
            <div className="shell pt-24 sm:pt-28 lg:pt-36">
                <p className="eyebrow text-gold">Around the studio</p>
                <h2
                    id="walk-title"
                    className="mt-4 max-w-[20ch] font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.04] text-white"
                >
                    <SplitText text="A walk through a" delay={0.05} />{" "}
                    <span className="italic text-flame">
                        <SplitText text="week of classes" delay={0.28} />
                    </span>
                    .
                </h2>
                <p className="mt-5 max-w-[34rem] text-[1.02rem] leading-[1.7] text-white/70">
                    Real moments from the Kala Mandir floor and studio — painting,
                    practice and performance. On a larger screen, keep scrolling to
                    move through them sideways.
                </p>
            </div>

            {pinned ? (
                <div
                    ref={outerRef}
                    className="relative"
                    style={{ height: `calc(100vh + ${range}px)` }}
                >
                    <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                        <motion.div
                            ref={trackRef}
                            style={{ x }}
                            className="flex w-max items-center gap-6 py-10 pl-[clamp(1.5rem,4.5vw,4.5rem)] pr-[clamp(1.5rem,4.5vw,4.5rem)]"
                        >
                            {panels}
                        </motion.div>

                        {/* Thin travel indicator */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-px bg-white/12"
                        >
                            <motion.div
                                className="h-full origin-left bg-gradient-to-r from-gold to-flame"
                                style={{ scaleX: scrollYProgress }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-10">
                    <div className="flex items-center gap-2 px-[clamp(1.5rem,4.5vw,4.5rem)] pb-4 text-[12.5px] text-white/45">
                        <ArrowRight
                            aria-hidden="true"
                            className="h-3.5 w-3.5 motion-safe:animate-pulse"
                        />
                        Swipe to explore
                    </div>
                    <div className="snap-x snap-mandatory overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div
                            ref={trackRef}
                            className="flex w-max items-center gap-5 px-[clamp(1.5rem,4.5vw,4.5rem)]"
                        >
                            {panels}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
