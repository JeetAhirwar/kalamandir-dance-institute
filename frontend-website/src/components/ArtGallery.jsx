import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import Magnetic from "@/components/Magnetic";
import SplitText from "@/components/SplitText";
import BrushStroke from "@/components/BrushStroke";
import GalleryLightbox, { ZoomCue } from "@/components/GalleryLightbox";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { galleryCategories, galleryItems } from "@/data/gallery";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * ArtGallery — THE section the page is built around.
 *
 * A curated exhibition of authentic Kala Mandir student work, hung in a
 * masonry spread with category filters, an accessible lightbox and generous,
 * colourful detailing drawn from the artwork's own palette.
 */

/* Category → colour from the art palette (kept literal for Tailwind). */
const ACCENTS = {
    all: {
        solid: "bg-text text-white",
        dot: "bg-text",
        hover: "hover:text-text",
        text: "text-text",
    },
    drawing: {
        solid: "bg-rose text-white",
        dot: "bg-rose",
        hover: "hover:text-rose",
        text: "text-rose",
    },
    painting: {
        solid: "bg-pink text-white",
        dot: "bg-pink",
        hover: "hover:text-pink",
        text: "text-pink",
    },
    craft: {
        solid: "bg-violet text-white",
        dot: "bg-violet",
        hover: "hover:text-violet",
        text: "text-violet",
    },
    dance: {
        solid: "bg-flame text-white",
        dot: "bg-flame",
        hover: "hover:text-flame",
        text: "text-flame",
    },
};

const CROPS = {
    square: "aspect-square",
    portrait: "aspect-[4/5]",
    landscape: "aspect-[4/3]",
};

export default function ArtGallery() {
    const [active, setActive] = useState("all");
    const [openIndex, setOpenIndex] = useState(null);
    const reduce = useReducedMotion();

    const filtered = useMemo(
        () =>
            active === "all"
                ? galleryItems
                : galleryItems.filter((item) => item.category === active),
        [active],
    );

    return (
        <section
            id="gallery"
            data-tone="light"
            aria-labelledby="gallery-title"
            className="section relative bg-blossom"
        >
            {/* Decorative corner paint-swatch — quiet, aria-hidden */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 hidden select-none lg:block"
            >
                <div className="flex gap-2 pt-10">
                    <span className="h-16 w-2.5 rounded-full bg-pink/70" />
                    <span className="h-16 w-2.5 rounded-full bg-rose/70" />
                    <span className="h-16 w-2.5 rounded-full bg-gold/80" />
                    <span className="h-16 w-2.5 rounded-full bg-violet/60" />
                </div>
            </div>

            <div className="shell">
                {/* Header + filters */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="gallery-title"
                        number="03"
                        eyebrow="Student exhibition"
                        title={
                            <>
                                Made in{" "}
                                <span className="italic text-pink">our classes</span>,
                                kept with pride.
                            </>
                        }
                        standfirst="A curated wall of actual student work from Kala Mandir — drawing, painting, craft and dance — presented the way a gallery would hang it."
                        className="max-w-[38rem]"
                    >
                        <BrushStroke className="mt-7 h-4 w-56 text-pink/70" />
                    </SectionHeading>

                    <Reveal delay={0.1} className="lg:pb-1">
                        <div
                            role="group"
                            aria-label="Filter gallery by category"
                            className="flex flex-wrap gap-2"
                        >
                            {galleryCategories.map((category) => {
                                const isActive = active === category.id;
                                const accent = ACCENTS[category.id];
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => setActive(category.id)}
                                        aria-pressed={isActive}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-[13px] tracking-[0.01em] transition-all duration-200",
                                            isActive
                                                ? cn("border-transparent", accent.solid)
                                                : cn(
                                                      "border-rule bg-transparent text-muted hover:bg-white hover:text-text",
                                                      accent.hover,
                                                  ),
                                        )}
                                    >
                                        {category.label}
                                        <span className="ml-1.5 tabular-nums text-[11px] opacity-60">
                                            {category.id === "all"
                                                ? galleryItems.length
                                                : galleryItems.filter(
                                                      (i) => i.category === category.id,
                                                  ).length}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Reveal>
                </div>

                {/* Provenance note — everything here is the institute's own work */}
                <Reveal delay={0.15}>
                    <p className="mt-6 flex items-start gap-2.5 text-[14px] leading-relaxed text-muted">
                        <span
                            aria-hidden="true"
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pink motion-safe:animate-pulse"
                        />
                        <span className="max-w-[54rem]">
                            Every piece on this wall is{" "}
                            <span className="font-medium text-text">
                                actual student work from Kala Mandir classes
                            </span>
                            , supplied by the institute.
                        </span>
                    </p>
                </Reveal>

                {/* Masonry exhibition wall — calm, art-first, no distortion */}
                <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:mt-14 lg:columns-3 lg:gap-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filtered.map((item) => {
                            const accent = ACCENTS[item.category] || ACCENTS.all;
                            return (
                                <motion.figure
                                    key={item.id}
                                    layout={!reduce}
                                    initial={
                                        reduce
                                            ? false
                                            : { opacity: 0, y: 18, scale: 0.985 }
                                    }
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={
                                        reduce
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: -8, scale: 0.985 }
                                    }
                                    transition={{ duration: 0.45, ease }}
                                    className="group mb-5 break-inside-avoid lg:mb-6"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenIndex(filtered.indexOf(item))}
                                        className="relative block w-full overflow-hidden rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-blossom"
                                        aria-label={`Open in gallery: ${item.caption}`}
                                    >
                                        <SmartImage
                                            image={item}
                                            sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                                            className={cn("w-full", CROPS[item.crop] || "aspect-[4/5]")}
                                            position={item.position || "50% 45%"}
                                            imgClassName="transition-transform duration-[650ms] ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                                        />
                                        <ZoomCue />
                                        {/* Caption overlay — appears on hover/focus only,
                                            the caption also exists as real text below. */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-4 pt-14 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        >
                                            <span className="text-[13.5px] font-medium text-white">
                                                {item.caption}
                                            </span>
                                            <span className="eyebrow flex items-center gap-1.5 text-white/85">
                                                <span
                                                    className={cn(
                                                        "h-1.5 w-1.5 rounded-full",
                                                        accent.dot,
                                                    )}
                                                />
                                                {item.category}
                                            </span>
                                        </span>
                                    </button>

                                    {/* Always-visible caption for a11y + print feel */}
                                    <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-rule pt-2.5">
                                        <span className="text-[14px] leading-snug text-text/85">
                                            {item.caption}
                                        </span>
                                        <span className="eyebrow flex shrink-0 items-center gap-1.5">
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    "h-1.5 w-1.5 rounded-full",
                                                    accent.dot,
                                                )}
                                            />
                                            <span className={accent.text}>
                                                {item.category}
                                            </span>
                                        </span>
                                    </figcaption>
                                </motion.figure>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Enquiry CTA under the exhibition */}
                <RevealGroup className="mt-14 flex flex-col items-start gap-6 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-[30rem] font-display text-[1.45rem] leading-snug text-text sm:text-[1.7rem]">
                        <SplitText text="Want work like this on your wall?" />
                    </p>
                    <div className="flex flex-wrap gap-x-7 gap-y-4">
                        <Magnetic>
                            <a
                                href="#enquiry"
                                className="group inline-flex items-center gap-2 rounded-[11px] bg-rose px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-pink"
                            >
                                Enquire about art classes
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </Magnetic>
                        <a
                            href="#art-detail"
                            className="rule-link text-[15px] text-text hover:text-rose"
                        >
                            More about the syllabus
                        </a>
                    </div>
                </RevealGroup>

                {/* Empty state (defensive — filters always match at least one) */}
                {filtered.length === 0 && (
                    <div className="mt-14 rounded-[14px] border border-dashed border-rule px-6 py-16 text-center">
                        <p className="font-display text-[1.6rem] text-text">
                            Nothing in this category yet.
                        </p>
                        <p className="mt-2 text-[15px] text-muted">
                            New work is added as it is approved.
                        </p>
                        <button
                            type="button"
                            onClick={() => setActive("all")}
                            className="rule-link mt-6 text-[15px] text-rose"
                        >
                            Show all work
                        </button>
                    </div>
                )}
            </div>

            <GalleryLightbox
                items={filtered}
                index={openIndex}
                onClose={() => setOpenIndex(null)}
                onNavigate={setOpenIndex}
            />
        </section>
    );
}
