import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";

/**
 * ScrollProgress — a hairline bar pinned to the very top that fills from
 * left to right as the page is read. It is purely decorative (aria-hidden)
 * and never overlaps the navbar's own surface.
 *
 * With reduced motion the spring easing is dropped and the bar tracks scroll
 * directly, so it stays informational without any eased animation.
 */
export default function ScrollProgress() {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const smooth = useSpring(scrollYProgress, {
        stiffness: 140,
        damping: 30,
        restDelta: 0.001,
    });

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-pink via-rose to-violet"
            style={{ scaleX: reduce ? scrollYProgress : smooth }}
        />
    );
}
