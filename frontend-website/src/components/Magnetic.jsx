import { useRef } from "react";
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Magnetic — a small pointer-follow wrapper for buttons and links.
 *
 * The child drifts a few pixels toward the cursor while hovered and springs
 * back on leave. It is a tactile accent, not a behaviour change: the wrapped
 * element stays a normal, focusable link/button and keyboard users are
 * unaffected. With reduced motion (or on touch, where there is no hover) it
 * simply renders the child untouched.
 */
export default function Magnetic({
    children,
    className,
    strength = 0.32,
    ...rest
}) {
    const ref = useRef(null);
    const reduce = useReducedMotion();

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const spring = { stiffness: 260, damping: 18, mass: 0.4 };
    const sx = useSpring(x, spring);
    const sy = useSpring(y, spring);

    if (reduce) {
        return (
            <span className={cn("inline-block", className)} {...rest}>
                {children}
            </span>
        );
    }

    const onMove = (event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const reset = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.span
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={reset}
            style={{ x: sx, y: sy }}
            className={cn("inline-block", className)}
            {...rest}
        >
            {children}
        </motion.span>
    );
}
