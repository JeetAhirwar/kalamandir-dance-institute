import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import GalleryLightbox, { ZoomCue } from "@/components/GalleryLightbox";
import { Reveal, RevealGroup } from "@/components/Reveal";
import {
    galleryCategories,
    galleryItems,
    showPlaceholderNotice,
} from "@/data/gallery";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * ArtGallery (D) — editorial masonry with category filters and a lightbox.
 *
 * Layout uses CSS columns so tall and wide works interleave like a printed
 * spread instead of a row of identical cards. Filtering animates softly;
 * keyboard users get real buttons with `aria-pressed` state.
 */
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
            className="relative bg-paper py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                {/* Header + filters */}
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="gallery-title"
                        number="03"
                        eyebrow="Art gallery"
                        title={
                            <>
                                Work in{" "}
                                <span className="italic text-coral">progress</span>,
                                and after.
                            </>
                        }
                        standfirst="A rotating selection across drawing, painting, craft and dance."
                        className="max-w-[36rem]"
                    />

                    <Reveal delay={0.1} className="lg:pb-1">
                        <div
                            role="group"
                            aria-label="Filter gallery by category"
                            className="flex flex-wrap gap-2"
                        >
                            {galleryCategories.map((category) => {
                                const isActive = active === category.id;
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => setActive(category.id)}
                                        aria-pressed={isActive}
                                        className={cn(
                                            "rounded-full border px-4 py-2 text-[13px] tracking-[0.01em] transition-all duration-200",
                                            isActive
                                                ? "border-text bg-text text-paper"
                                                : "border-rule bg-transparent text-muted hover:border-[#c9c2b5] hover:text-text",
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

                {/* Honest provenance note */}
                {showPlaceholderNotice && (
                    <Reveal delay={0.15}>
                        <p className="eyebrow mt-6 flex items-start gap-2 text-[#8d867c]">
                            <span
                                aria-hidden="true"
                                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue/70"
                            />
                            <span className="max-w-[52rem] normal-case tracking-[0.04em]">
                                Placeholder imagery shown while the institute's own
                                artwork is being curated. Source: Pexels licence.
                                Authentic Kala Mandir work will replace these.
                            </span>
                        </p>
                    </Reveal>
                )}

                {/* Masonry */}
                <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:mt-14 lg:columns-3 lg:gap-6">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {filtered.map((item) => (
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
                                    className="relative block w-full overflow-hidden rounded-[14px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                                    aria-label={`Open in gallery: ${item.caption}`}
                                >
                                    <SmartImage
                                        image={item}
                                        sizes="(max-width: 639px) 92vw, (max-width: 1023px) 46vw, 30vw"
                                        className="w-full"
                                        position="50% 45%"
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
                                        <span className="eyebrow text-white/70">
                                            {item.category}
                                        </span>
                                    </span>
                                </button>

                                {/* Always-visible caption for a11y + print feel */}
                                <figcaption className="mt-3 flex items-baseline justify-between gap-4 border-t border-rule pt-2.5">
                                    <span className="text-[14px] leading-snug text-text/85">
                                        {item.caption}
                                    </span>
                                    <span className="eyebrow shrink-0 text-[#a9a49c]">
                                        {item.category}
                                    </span>
                                </figcaption>
                            </motion.figure>
                        ))}
                    </AnimatePresence>
                </div>

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
                            className="rule-link mt-6 text-[15px] text-blue"
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
