import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import { RevealItem } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * ClassCard — editorial card, deliberately NOT a uniform product tile.
 *
 * Each card carries its own proportion (`layout`) and its own accent from the
 * studio palette (kicker + bullet dots), so the grid still reads like a
 * catalogue spread while every class gets a friendly identity.
 * The whole card links to the relevant section or the enquiry form; clicking
 * also pre-selects that interest in the form.
 */

/* Kept literal so Tailwind's scanner sees every class string. */
const ACCENTS = {
    pink: { kicker: "text-pink", dot: "bg-pink" },
    rose: { kicker: "text-rose", dot: "bg-rose" },
    violet: { kicker: "text-violet", dot: "bg-violet" },
    flame: { kicker: "text-flame", dot: "bg-flame" },
    gold: { kicker: "text-[#c98a12]", dot: "bg-gold" },
};

export default function ClassCard({ item }) {
    const { title, kicker, summary, points, index, image, anchor, interest } = item;
    const accent = ACCENTS[item.accent] || ACCENTS.pink;

    const handleInterest = () => {
        // Pre-select the matching option when the visitor lands on the form.
        window.dispatchEvent(
            new CustomEvent("km:interest", { detail: { interest } }),
        );
    };

    const aspect =
        item.layout === "tall"
            ? "aspect-[3/4]"
            : item.layout === "full"
              ? "aspect-[16/9] sm:aspect-[21/9]"
              : "aspect-[4/3] sm:aspect-[16/10]";

    return (
        <RevealItem className={cn(item.layout === "full" && "col-span-full")}>
            <a
                href={anchor}
                onClick={handleInterest}
                className="group block focus-visible:outline-none"
                aria-label={`${title} — enquire`}
            >
                {/* Image */}
                <div className="relative overflow-hidden rounded-[16px]">
                    <SmartImage
                        image={image}
                        sizes={
                            item.layout === "full"
                                ? "(max-width: 1023px) 92vw, 92vw"
                                : "(max-width: 767px) 92vw, 46vw"
                        }
                        className={cn("w-full", aspect)}
                        position={item.layout === "full" ? "50% 42%" : "50% 45%"}
                        imgClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.045] motion-reduce:transform-none"
                    />
                    {/* Index label over the image */}
                    <span className="eyebrow absolute left-4 top-4 rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-white/85 backdrop-blur-sm">
                        {index}
                    </span>
                </div>

                {/* Text block under a fine rule */}
                <div className="mt-5 border-t border-rule pt-4">
                    <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0">
                            <p className={cn("eyebrow", accent.kicker)}>{kicker}</p>
                            <h3 className="mt-2.5 font-display text-[clamp(1.5rem,3.2vw,2.15rem)] leading-[1.08] tracking-[-0.01em] text-text transition-colors duration-200 group-hover:text-pink">
                                {title}
                            </h3>
                        </div>
                        <span
                            aria-hidden="true"
                            className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-rule text-muted transition-all duration-200 group-hover:border-pink group-hover:bg-pink group-hover:text-white"
                        >
                            <ArrowUpRight className="h-4 w-4" />
                        </span>
                    </div>

                    <p className="mt-3 max-w-[38rem] text-[0.975rem] leading-[1.65] text-muted">
                        {summary}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                        {points.map((point) => (
                            <li
                                key={point}
                                className="eyebrow flex items-center gap-2 text-[#8d867c]"
                            >
                                <span
                                    aria-hidden="true"
                                    className={cn("h-1 w-1 rounded-full", accent.dot)}
                                />
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            </a>
        </RevealItem>
    );
}
