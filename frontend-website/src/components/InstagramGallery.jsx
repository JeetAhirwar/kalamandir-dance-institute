import { Instagram, ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import TiltCard from "@/components/TiltCard";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup } from "@/components/Reveal";
import { instagramPosts, showPlaceholderNotice } from "@/data/gallery";
import { contactLinks, siteConfig } from "@/data/siteConfig";

/**
 * InstagramGallery (G) — a curated grid, honestly labelled.
 *
 * There is no Instagram API integration, so this does NOT simulate a live
 * feed: it is a hand-picked selection of authentic institute photography,
 * with a direct link to the official profile.
 */
export default function InstagramGallery() {
    return (
        <section
            id="instagram"
            data-tone="light"
            aria-labelledby="instagram-title"
            className="section relative bg-paper"
        >
            <div className="shell">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <SectionHeading
                        id="instagram-title"
                        number="06"
                        eyebrow="On Instagram"
                        title={
                            <>
                                A curated{" "}
                                <span className="italic text-pink">selection</span>.
                            </>
                        }
                        standfirst="Highlights chosen for this page. Follow the studio profile for everything else."
                        className="max-w-[34rem]"
                    />

                    <Reveal delay={0.1} className="lg:pb-1">
                        <a
                            href={contactLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 rounded-[11px] border border-text px-5 py-3.5 text-[14.5px] font-medium text-text transition-all duration-200 hover:border-pink hover:bg-pink hover:text-white"
                        >
                            <Instagram className="h-4 w-4" aria-hidden="true" />
                            Follow {siteConfig.instagram.handle}
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>
                        <p className="eyebrow mt-3 text-[#a9a49c]">
                            Opens instagram.com in a new tab
                        </p>
                    </Reveal>
                </div>

                {/* Curated grid — varied spans, not a uniform feed mock */}
                <RevealGroup className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-16 lg:grid-cols-4 lg:gap-5">
                    {instagramPosts.map((post, i) => (
                        <TiltCard
                            key={post.id}
                            max={7}
                            href={contactLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View Kala Mandir on Instagram (opens in a new tab) — ${post.alt}`}
                            className={`group relative block overflow-hidden rounded-[12px] transform-gpu will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-paper ${
                                i === 0 || i === 5 ? "lg:row-span-2" : ""
                            }`}
                        >
                            <SmartImage
                                image={post}
                                sizes="(max-width: 639px) 46vw, (max-width: 1023px) 23vw, 22vw"
                                className={
                                    i === 0 || i === 5
                                        ? "aspect-[3/4] w-full lg:aspect-[3/4] lg:h-full"
                                        : "aspect-square w-full"
                                }
                                imgClassName="transition-transform duration-[650ms] ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-3 left-3 grid h-8 w-8 translate-y-2 place-items-center rounded-full border border-white/30 bg-black/30 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                            >
                                <Instagram className="h-4 w-4" />
                            </span>
                        </TiltCard>
                    ))}
                </RevealGroup>

                {/* Honest note — no simulated live feed */}
                <Reveal delay={0.1} className="mt-7 flex flex-col gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[14px] leading-relaxed text-muted">
                        This is a hand-picked selection, not a live feed. Posts are
                        added manually.
                    </p>
                    {showPlaceholderNotice && (
                        <p className="eyebrow shrink-0 text-[#a9a49c]">
                            Placeholder imagery · Pexels licence
                        </p>
                    )}
                </Reveal>
            </div>
        </section>
    );
}
