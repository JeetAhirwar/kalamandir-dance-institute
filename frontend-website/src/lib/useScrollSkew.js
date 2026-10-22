import { useEffect, useRef } from "react";
import {
    useMotionValue,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useSpring,
} from "motion/react";

const clamp = (n, min, max) => (n < min ? min : n > max ? max : n);

/**
 * useScrollSkew — an "elastic scroll" motion value.
 *
 * Returns a spring-smoothed `skewY` value (in degrees) that bends toward the
 * direction of travel while the page is being scrolled and settles back to a
 * flat 0 once scrolling stops. Apply it to a decorative container's style so a
 * wall of images flexes as you pass it — a common premium scroll cue.
 *
 * Reduced motion returns a constant 0 MotionValue, so the element simply never
 * skews.
 */
export function useScrollSkew(max = 2.4) {
    const reduce = useReducedMotion();
    const { scrollY } = useScroll();
    const raw = useMotionValue(0);
    const skew = useSpring(raw, { stiffness: 140, damping: 18, mass: 0.5 });
    const last = useRef(0);
    const idle = useRef(0);

    useEffect(() => {
        last.current = scrollY.get();
    }, [scrollY]);

    useMotionValueEvent(scrollY, "change", (y) => {
        if (reduce) {
            raw.set(0);
            return;
        }
        const delta = y - last.current;
        last.current = y;
        raw.set(clamp(delta * 0.08, -max, max));
        clearTimeout(idle.current);
        idle.current = setTimeout(() => raw.set(0), 120);
    });

    useEffect(() => () => clearTimeout(idle.current), []);

    return skew;
}
