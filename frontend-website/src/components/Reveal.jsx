import { motion, useReducedMotion as useMotionReduced } from "motion/react";
import { cn } from "@/lib/utils";
import {
    inView,
    revealUp,
    frameMask,
    innerSettle,
    maskReveal,
    stagger,
    staggerItem,
} from "@/lib/motion";

/**
 * Reveal — the one entrance primitive used across the site.
 *
 * Content is authored in the DOM immediately; motion only enhances it.
 * With reduced motion (or if the observer never fires) everything is simply
 * visible — nothing is ever permanently hidden behind an animation.
 */
export function Reveal({
    children,
    className,
    as = "div",
    variants = revealUp,
    delay = 0,
    amount = 0.2,
    once = true,
    ...rest
}) {
    const reduce = useMotionReduced();
    const Component = motion[as] ?? motion.div;

    if (reduce) {
        const Static = as === "div" ? "div" : as;
        return (
            <Static className={className} {...rest}>
                {children}
            </Static>
        );
    }

    return (
        <Component
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants}
            transition={delay ? { delay } : undefined}
            {...rest}
        >
            {children}
        </Component>
    );
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({
    children,
    className,
    delay = 0,
    staggerChildren = 0.09,
    amount = 0.2,
    ...rest
}) {
    const reduce = useMotionReduced();
    if (reduce) {
        return (
            <div className={className} {...rest}>
                {children}
            </div>
        );
    }
    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={stagger(delay, staggerChildren)}
            {...rest}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({ children, className, as = "div", variants = staggerItem, ...rest }) {
    const reduce = useMotionReduced();
    const Tag = as;
    if (reduce) {
        return (
            <Tag className={className} {...rest}>
                {children}
            </Tag>
        );
    }
    const Component = motion[as] ?? motion.div;
    return (
        <Component className={className} variants={variants} {...rest}>
            {children}
        </Component>
    );
}

/** Vertical wipe used on a small number of editorial images. */
export function MaskReveal({ children, className, ...rest }) {
    const reduce = useMotionReduced();
    if (reduce) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={cn(className)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={maskReveal}
            {...rest}
        >
            {children}
        </motion.div>
    );
}

/**
 * MediaMask — the two-layer image reveal.
 *
 * The frame opens its own clip-path inset while the wrapped image settles from
 * an over-scaled state on a slower curve, so a large photograph reads as being
 * uncovered rather than faded in. Reduced motion renders the child plainly.
 */
export function MediaMask({ children, className, innerClassName, ...rest }) {
    const reduce = useMotionReduced();
    if (reduce) return <div className={className}>{children}</div>;
    return (
        <motion.div
            className={cn("overflow-hidden", className)}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            variants={frameMask}
            {...rest}
        >
            <motion.div variants={innerSettle} className={cn("origin-center", innerClassName)}>
                {children}
            </motion.div>
        </motion.div>
    );
}

/**
 * Words that rise into place line by line — used for the hero headline so the
 * break stays intentional rather than animated per-character.
 */
export function LineReveal({ children, className, delay = 0 }) {
    const reduce = useMotionReduced();
    if (reduce) return <span className={className}>{children}</span>;
    return (
        <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
                className={cn("block", className)}
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.95, delay, ease: [0.22, 0.61, 0.36, 1] }}
            >
                {children}
            </motion.span>
        </span>
    );
}
