import { motion, useReducedMotion } from "motion/react";
import { Reveal, RevealItem, RevealGroup } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * SectionHeading — the editorial header used by every section.
 *
 * eyebrow (small caps) → oversized serif title → optional standfirst.
 * `rule` draws a hairline underneath, echoing print layout.
 */
export default function SectionHeading({
    eyebrow,
    title,
    standfirst,
    align = "left",
    tone = "light",
    number,
    className,
    children,
}) {
    const reduce = useReducedMotion();
    const isDark = tone === "dark";

    return (
        <RevealGroup
            className={cn(
                "max-w-[46rem]",
                align === "center" && "mx-auto text-center",
                className,
            )}
        >
            <RevealItem
                className={cn(
                    "eyebrow flex items-center gap-3",
                    isDark ? "text-white/55" : "text-muted",
                    align === "center" && "justify-center",
                )}
            >
                {number && (
                    <span className={cn("tabular-nums", isDark ? "text-white/35" : "text-[#a9a49c]")}>
                        {number}
                    </span>
                )}
                <span
                    aria-hidden="true"
                    className={cn(
                        "h-px w-8",
                        isDark ? "bg-white/25" : "bg-rule",
                    )}
                />
                <span>{eyebrow}</span>
            </RevealItem>

            <RevealItem>
                <h2
                    className={cn(
                        "mt-5 font-display text-[clamp(2.15rem,5vw,3.75rem)] leading-[1.04] tracking-[-0.01em]",
                        isDark ? "text-white" : "text-text",
                        align === "center" && "mx-auto",
                    )}
                >
                    {title}
                </h2>
            </RevealItem>

            {standfirst && (
                <RevealItem
                    className={cn(
                        "mt-5 max-w-[38rem] text-[1.0625rem] leading-[1.65]",
                        isDark ? "text-white/65" : "text-muted",
                        align === "center" && "mx-auto",
                    )}
                >
                    {standfirst}
                </RevealItem>
            )}

            {children}

            <motion.div
                aria-hidden="true"
                className={cn(
                    "mt-9 h-px w-full origin-left",
                    isDark ? "bg-white/15" : "bg-rule",
                    align === "center" && "mx-auto",
                )}
                initial={reduce ? undefined : { scaleX: 0 }}
                whileInView={reduce ? undefined : { scaleX: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1], delay: 0.15 }}
            />
        </RevealGroup>
    );
}

/** Compact variant for sub-blocks inside a section. */
export function MinorHeading({ children, tone = "light", className }) {
    return (
        <Reveal
            className={cn(
                "eyebrow",
                tone === "dark" ? "text-white/55" : "text-muted",
                className,
            )}
        >
            {children}
        </Reveal>
    );
}
