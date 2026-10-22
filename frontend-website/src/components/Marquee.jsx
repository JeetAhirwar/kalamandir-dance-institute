import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Marquee — an infinite horizontal ticker used as an editorial divider.
 *
 * The two tracks are identical, so translating the container by -50% loops
 * seamlessly. With reduced motion the band becomes a single static row.
 * The visible strip is always aria-hidden; the words are exposed once to
 * assistive tech via a screen-reader-only list so nothing is lost.
 */
const TONES = {
    art: { band: "bg-rose text-white", sep: "text-white/70" },
    dance: { band: "bg-plum text-cream", sep: "text-gold" },
    cream: { band: "bg-butter text-ink", sep: "text-rose" },
};

export default function Marquee({ items, tone = "art", duration = 30, className }) {
    const reduce = useReducedMotion();
    const t = TONES[tone] ?? TONES.art;
    const row = [...items, ...items];

    const Track = (
        <div className="flex shrink-0 items-center gap-10 pr-10 sm:gap-16 sm:pr-16">
            {row.map((label, i) => (
                <span key={i} className="flex items-center gap-10 sm:gap-16">
                    <span className="whitespace-nowrap font-display text-[clamp(1.4rem,3.4vw,2.6rem)] leading-none">
                        {label}
                    </span>
                    <span aria-hidden="true" className={cn("text-[1.05em]", t.sep)}>
                        ✳
                    </span>
                </span>
            ))}
        </div>
    );

    return (
        <div
            className={cn("relative isolate overflow-hidden py-5 sm:py-6", t.band, className)}
        >
            <p className="sr-only">{items.join(", ")}</p>
            <div aria-hidden="true">
                {reduce ? (
                    <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5">
                        {items.map((label, i) => (
                            <span key={i} className="flex items-center gap-10">
                                <span className="whitespace-nowrap font-display text-[clamp(1.2rem,3vw,2rem)] leading-none">
                                    {label}
                                </span>
                                <span className={t.sep}>✳</span>
                            </span>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        className="flex w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration, ease: "linear", repeat: Infinity }}
                    >
                        {Track}
                        {Track}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
