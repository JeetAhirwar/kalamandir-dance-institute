import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * ScrollWordReveal — a headline that "inks in" word by word as it scrolls.
 *
 * Each word is a colour tween driven by one shared scroll progress value,
 * staggered so the fill travels left-to-right / top-to-bottom across the
 * line. Words listed in `accent` settle on the accent colour and set in
 * italic, preserving the editorial voice of the original heading.
 *
 * Honours prefers-reduced-motion by rendering the plain, fully-inked line.
 */
function Word({ progress, i, count, word, from, to, accentTo, isAccent }) {
    const frac = count > 1 ? i / (count - 1) : 0;
    const start = frac * 0.6;
    const end = start + 0.4;
    const settle = isAccent ? accentTo : to;
    const color = useTransform(progress, [start, end], [from, settle]);
    return (
        <motion.span
            style={{ color }}
            aria-hidden="true"
            className={`inline-block${isAccent ? " italic" : ""}`}
        >
            {word}
        </motion.span>
    );
}

export default function ScrollWordReveal({
    text,
    from = "#e9dbe4",
    to = "#29212b",
    accentTo = "#ec4899",
    accent = [],
    className,
}) {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.95", "start 0.35"],
    });

    const words = text.split(" ").filter(Boolean);
    const isAccentWord = (w) =>
        accent.includes(w.replace(/[^a-zA-Z]/g, "").toLowerCase());

    if (reduce) {
        return (
            <span ref={ref} className={className}>
                {words.map((w, i) => (
                    <span key={i} className="inline-block">
                        <span
                            className={
                                isAccentWord(w) ? "italic text-pink" : undefined
                            }
                        >
                            {w}
                        </span>
                        {i < words.length - 1 ? " " : ""}
                    </span>
                ))}
            </span>
        );
    }

    return (
        <span ref={ref} aria-label={text} className={className}>
            {words.map((w, i) => (
                <span key={i} className="inline-block whitespace-nowrap">
                    <Word
                        progress={scrollYProgress}
                        i={i}
                        count={words.length}
                        word={w}
                        from={from}
                        to={to}
                        accentTo={accentTo}
                        isAccent={isAccentWord(w)}
                    />
                    {i < words.length - 1 ? " " : ""}
                </span>
            ))}
        </span>
    );
}
