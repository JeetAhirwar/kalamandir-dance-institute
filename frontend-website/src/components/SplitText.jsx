import { Fragment } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * SplitText — a word/character stagger reveal.
 *
 * Each token rises out of its own overflow-mask, staggered left-to-right, for
 * the "type assembles itself" effect. The full string is exposed to assistive
 * tech via `aria-label` on the wrapper while the visual pieces are hidden, so
 * a screen reader still reads one clean line.
 *
 * Reduced motion renders the plain string with no splitting at all.
 */
export default function SplitText({
    text,
    as = "span",
    by = "words",
    className,
    delay = 0,
    stagger = 0.055,
    amount = 0.5,
    once = true,
    ...rest
}) {
    const reduce = useReducedMotion();
    const MotionTag = motion[as] ?? motion.span;

    if (reduce) {
        const Static = as;
        return (
            <Static className={className} {...rest}>
                {text}
            </Static>
        );
    }

    const tokens =
        by === "chars" ? Array.from(text) : text.split(" ").filter(Boolean);

    const container = {
        hidden: {},
        visible: {
            transition: { staggerChildren: stagger, delayChildren: delay },
        },
    };
    const child = {
        hidden: { y: "115%" },
        visible: { y: "0%", transition: { duration: 0.62, ease } },
    };

    return (
        <MotionTag
            className={cn("inline", className)}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            aria-label={text}
            {...rest}
        >
            {tokens.map((token, i) => (
                <Fragment key={i}>
                    <span
                        aria-hidden="true"
                        className="inline-block overflow-hidden align-bottom pb-[0.14em]"
                    >
                        <motion.span variants={child} className="inline-block">
                            {token}
                        </motion.span>
                    </span>
                    {by === "words" && i < tokens.length - 1 ? " " : null}
                </Fragment>
            ))}
        </MotionTag>
    );
}
