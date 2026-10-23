import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup } from "@/components/Reveal";
import ClassCard from "@/components/ClassCard";
import { classes } from "@/data/classes";
import { editorialImages } from "@/data/gallery";
import SmartImage from "@/components/SmartImage";
import { ArrowUpRight } from "lucide-react";

/**
 * ClassesSection (C) — "Discover Our Classes".
 *
 * Layout follows a catalogue spread: two columns of mixed proportions on
 * desktop, with the choreography class as a full-bleed wide row. The `#classes`
 * anchor is the hero CTA target; `#art-detail` is the deep-dive below.
 */
export default function ClassesSection() {
    const [artClass, paintClass, danceClass, zumbaClass, choreoClass] = classes;

    return (
        <section
            id="art"
            data-tone="light"
            aria-labelledby="classes-title"
            className="section relative bg-white"
        >
            {/* Secondary anchor targeted by the hero "Explore Classes" CTA */}
            <div
                id="classes"
                aria-hidden="true"
                className="pointer-events-none absolute top-0 scroll-mt-28"
            />
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-12 lg:items-end lg:gap-x-12">
                    <div className="lg:col-span-7">
                        <SectionHeading
                            id="classes-title"
                            number="02"
                            eyebrow="Discover our classes"
                            title={
                                <>
                                    Five ways to make{" "}
                                    <span className="italic text-pink">something</span>.
                                </>
                            }
                            standfirst="Drawing, painting, craft, dance, Zumba and choreography — each taught as its own discipline, with its own rhythm."
                        />
                    </div>

                    <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
                        <p className="border-l border-rule pl-5 text-[0.975rem] leading-[1.7] text-muted">
                            Every class starts from observation and practice. No
                            experience is assumed, and no talent is required — only
                            the willingness to begin.
                        </p>
                    </Reveal>
                </div>

                {/* Mixed-proportion catalogue grid */}
                <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:gap-x-10 lg:gap-y-16">
                    <ClassCard item={artClass} />
                    <ClassCard item={paintClass} />
                    <ClassCard item={danceClass} />
                    <ClassCard item={zumbaClass} />
                    <ClassCard item={choreoClass} />
                </RevealGroup>
            </div>

            {/* ── Art detail target: an asymmetric gallery-catalogue spread ── */}
            <div
                id="art-detail"
                aria-labelledby="art-detail-title"
                className="mt-24 scroll-mt-28 border-t border-rule bg-blossom py-24 lg:mt-32 lg:py-32"
            >
                <div className="shell">
                    <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
                        {/* Text column */}
                        <div className="lg:col-span-4">
                            <SectionHeading
                                id="art-detail-title"
                                number="02.1"
                                eyebrow="Art & painting"
                                title={
                                    <>
                                        Give the work{" "}
                                        <span className="italic text-pink">
                                            room to breathe
                                        </span>
                                        .
                                    </>
                                }
                                standfirst="Paintings hung the way a catalogue would hang them — spaced, captioned and left alone."
                            />

                            <Reveal delay={0.1} className="mt-8 space-y-4">
                                <p className="text-[1.0625rem] leading-[1.7] text-text/85">
                                    Sketching and portrait drawing build the eye.
                                    Oil and acrylic painting build the hand. Craft
                                    brings material into the conversation — paper,
                                    texture, colour, surface.
                                </p>
                                <p className="text-[1.0625rem] leading-[1.7] text-muted">
                                    Students work at their own pace across the three,
                                    returning to the same subjects until they change.
                                </p>
                            </Reveal>

                            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
                                <a href="#gallery" className="rule-link text-[15px] text-rose">
                                    See the gallery
                                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                                </a>
                                <a href="#enquiry" className="rule-link text-[15px] text-text hover:text-rose">
                                    Ask about classes
                                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                                </a>
                            </Reveal>
                        </div>

                        {/* Asymmetric image composition */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-12 gap-4 sm:gap-5">
                                <Reveal className="col-span-7">
                                    <SmartImage
                                        image={editorialImages.artDetail[0]}
                                        sizes="(max-width: 1023px) 60vw, 44vw"
                                        className="aspect-[4/5] w-full rounded-[14px]"
                                        position="50% 40%"
                                    />
                                    <p className="eyebrow mt-3 text-[#a08a97]">
                                        {editorialImages.artDetail[0].caption}
                                    </p>
                                </Reveal>

                                <Reveal delay={0.1} className="col-span-5 self-end">
                                    <SmartImage
                                        image={editorialImages.artDetail[2]}
                                        sizes="(max-width: 1023px) 36vw, 26vw"
                                        className="aspect-square w-full rounded-[14px]"
                                    />
                                    <p className="eyebrow mt-3 text-[#a08a97]">
                                        {editorialImages.artDetail[2].caption}
                                    </p>
                                </Reveal>

                                <Reveal delay={0.15} className="col-span-5">
                                    <SmartImage
                                        image={editorialImages.artDetail[3]}
                                        sizes="(max-width: 1023px) 36vw, 26vw"
                                        className="aspect-[4/3] w-full rounded-[14px]"
                                    />
                                    <p className="eyebrow mt-3 text-[#a08a97]">
                                        {editorialImages.artDetail[3].caption}
                                    </p>
                                </Reveal>

                                <Reveal delay={0.2} className="col-span-7">
                                    <SmartImage
                                        image={editorialImages.artDetail[1]}
                                        sizes="(max-width: 1023px) 60vw, 44vw"
                                        className="aspect-[4/3] w-full rounded-[14px]"
                                        position="50% 35%"
                                    />
                                    <p className="eyebrow mt-3 text-[#a08a97]">
                                        {editorialImages.artDetail[1].caption}
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
