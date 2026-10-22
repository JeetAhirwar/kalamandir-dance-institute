import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * BrushStroke — a hand-painted underline that sweeps in from the left.
 *
 * A tapered brush shape revealed with a clip-path wipe on scroll, so it reads
 * as a single confident stroke of paint. Purely decorative (aria-hidden); the
 * colour comes from `currentColor`, so set it with a text-* utility. With
 * reduced motion it simply appears at full length.
 */
export default function BrushStroke({
    className,
    duration = 1.05,
    delay = 0.15,
    ...rest
}) {
    const reduce = useReducedMotion();

    const variants = {
        hidden: { clipPath: "inset(0 100% 0 0)" },
        visible: {
            clipPath: "inset(0 0% 0 0)",
            transition: { duration, ease, delay },
        },
    };

    return (
        <motion.span
            aria-hidden="true"
            className={cn("block", className)}
            initial={reduce ? false : "hidden"}
            whileInView={reduce ? undefined : "visible"}
            viewport={{ once: true, amount: 0.6 }}
            variants={variants}
            {...rest}
        >
            <svg
                viewBox="0 0 300 22"
                preserveAspectRatio="none"
                className="h-full w-full"
                fill="none"
            >
                <path
                    d="M3 12 C 42 5, 96 4, 152 7 C 210 10, 262 13, 297 8 C 262 19, 206 20, 150 17 C 94 14, 44 15, 3 12 Z"
                    fill="currentColor"
                />
            </svg>
        </motion.span>
    );
}
