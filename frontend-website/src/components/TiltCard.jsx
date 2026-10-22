import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * TiltCard — a subtle 3D tilt that tracks the cursor across a tile.
 *
 * Rotates up to `max` degrees on each axis from the pointer position, with a
 * spring so it settles smoothly on leave. Kept small on purpose: the tiles
 * hold real student/class photography, so the effect reads as depth, not a
 * gimmick. Renders as an <a> when `href` is set (gallery tiles must stay
 * real links). Falls back to a plain element under prefers-reduced-motion.
 */
export default function TiltCard({
    children,
    className,
    max = 8,
    href,
    ...rest
}) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const sx = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.5 });
    const sy = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.5 });

    function onMove(e) {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        rotateY.set(px * max * 2);
        rotateX.set(-py * max * 2);
    }

    function onLeave() {
        rotateX.set(0);
        rotateY.set(0);
    }

    const style = reduce
        ? undefined
        : { rotateX: sx, rotateY: sy, transformPerspective: 900 };

    if (href) {
        if (reduce) {
            return (
                <a ref={ref} href={href} className={className} {...rest}>
                    {children}
                </a>
            );
        }
        return (
            <motion.a
                ref={ref}
                href={href}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                style={style}
                className={className}
                {...rest}
            >
                {children}
            </motion.a>
        );
    }

    if (reduce) {
        return (
            <div ref={ref} className={className} {...rest}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={style}
            className={className}
            {...rest}
        >
            {children}
        </motion.div>
    );
}
