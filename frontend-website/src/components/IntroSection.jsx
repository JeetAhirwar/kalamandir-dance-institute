import { ArrowUpRight } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import SectionHeading from "@/components/SectionHeading";
import { MaskReveal, Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { editorialImages } from "@/data/gallery";

/**
 * Introduction (B) — a short editorial opening.
 *
 * One striking image, a large serif heading and compact supporting copy.
 * No feature lists, no invented history or credentials.
 */
export default function IntroSection() {
    const { intro } = editorialImages;

    return (
        <section
            id="about"
            data-tone="light"
            aria-labelledby="intro-title"
            className="relative bg-paper py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-12">
                    {/* Image — asymmetric, offset from the top rule */}
                    <div className="lg:col-span-5 lg:pt-2">
                        <MaskReveal>
                            <SmartImage
                                image={intro.main}
                                sizes="(max-width: 1023px) 92vw, 38vw"
                                className="aspect-[4/5] w-full rounded-[16px] lg:aspect-[3/4]"
                                position="50% 35%"
                            />
                        </MaskReveal>

                        <Reveal
                            delay={0.15}
                            className="mt-4 flex items-start justify-between gap-4 border-t border-rule pt-3"
                        >
                            <span className="eyebrow text-muted">The studio at work</span>
                            <span className="eyebrow text-[#a9a49c]">
                                Sector 52 · Noida
                            </span>
                        </Reveal>

                        {/* Small secondary image, deliberately offset */}
                        <MaskReveal className="mt-6 hidden lg:mt-8 lg:block">
                            <SmartImage
                                image={intro.side}
                                sizes="30vw"
                                className="aspect-[16/10] w-[86%] rounded-[14px]"
                            />
                        </MaskReveal>
                    </div>

                    {/* Copy */}
                    <div className="lg:col-span-6 lg:col-start-7">
                        <SectionHeading
                            number="01"
                            eyebrow="Introduction"
                            title={
                                <>
                                    A studio built for{" "}
                                    <span className="italic text-coral">
                                        creative expression
                                    </span>
                                    .
                                </>
                            }
                            standfirst="Kala Mandir brings art and dance together under one roof — a place to sit with a sheet of paper, work colour across a canvas, and learn to move with confidence."
                        />

                        <RevealGroup className="mt-8 space-y-5">
                            <RevealItem>
                                <p className="max-w-[34rem] text-[1.0625rem] leading-[1.72] text-text/85">
                                    Classes begin with the fundamentals and stay close
                                    to them — drawing what you see, mixing what you
                                    feel, practising a step until it becomes yours.
                                    Art and movement are treated as serious
                                    disciplines, taught patiently, for every age group
                                    that walks in.
                                </p>
                            </RevealItem>

                            <RevealItem>
                                <p className="max-w-[34rem] text-[1.0625rem] leading-[1.72] text-muted">
                                    Whether you are picking up a pencil for the first
                                    time or preparing a performance for a wedding
                                    stage, the room is the same: attentive, unhurried
                                    and yours.
                                </p>
                            </RevealItem>
                        </RevealGroup>

                        {/* Supporting image for mobile only */}
                        <MaskReveal className="mt-9 lg:hidden">
                            <SmartImage
                                image={intro.side}
                                sizes="92vw"
                                className="aspect-[16/10] w-full rounded-[14px]"
                            />
                        </MaskReveal>

                        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                            <a href="#why" className="rule-link text-[15px] text-blue">
                                Why learn here
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-200"
                                />
                            </a>
                            <a
                                href="#enquiry"
                                className="rule-link text-[15px] text-text hover:text-blue"
                            >
                                Book a trial class
                                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                            </a>
                        </Reveal>

                        {/* Fine caption row, editorial detail */}
                        <Reveal delay={0.15} className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3">
                            {[
                                { k: "Disciplines", v: "Art · Dance" },
                                { k: "Format", v: "Studio classes" },
                                { k: "Enquiries", v: "Open" },
                            ].map((item) => (
                                <div key={item.k} className="border-t border-rule pt-3">
                                    <dt className="eyebrow text-[#a9a49c]">{item.k}</dt>
                                    <dd className="mt-1.5 font-display text-[1.35rem] leading-none text-text">
                                        {item.v}
                                    </dd>
                                </div>
                            ))}
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}
