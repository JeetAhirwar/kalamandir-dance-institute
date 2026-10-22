import { Check } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

const REASONS = [
    {
        title: "Two disciplines, one roof",
        body: "Art and dance are taught side by side, so a student can draw in the afternoon and rehearse in the evening without changing addresses.",
        tone: "Practice",
    },
    {
        title: "Fundamentals before flourish",
        body: "Drawing starts with seeing. Painting starts with mixing. Dance starts with posture. The impressive part comes later, and it comes easier.",
        tone: "Method",
    },
    {
        title: "Room for every age group",
        body: "Classes are arranged for different age groups, and each works at a pace that suits the people actually in the room.",
        tone: "Access",
    },
    {
        title: "Work that leaves the studio",
        body: "Performances, event choreography and finished pieces give students a reason to complete what they start.",
        tone: "Outcome",
    },
];

/**
 * WhyLearnHere (F) — an editorial numbered list instead of a card grid.
 *
 * No claims about awards, credentials, years of operation or results — only
 * the structure of how classes are run, which is verifiable from the brief.
 */
export default function WhyLearnHere() {
    return (
        <section
            id="why"
            data-tone="light"
            aria-labelledby="why-title"
            className="relative bg-white py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
                    {/* Sticky heading column */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-32">
                            <SectionHeading
                                id="why-title"
                                number="05"
                                eyebrow="Why learn here?"
                                title={
                                    <>
                                        Serious about the craft,{" "}
                                        <span className="italic text-coral">
                                            gentle
                                        </span>{" "}
                                        with the beginner.
                                    </>
                                }
                                standfirst="Four reasons families and first-timers keep returning to the same room."
                            />

                            <Reveal delay={0.12} className="mt-9 hidden lg:block">
                                <a
                                    href="#enquiry"
                                    className="rule-link text-[15px] text-blue"
                                >
                                    Book a trial class
                                </a>
                            </Reveal>
                        </div>
                    </div>

                    {/* Numbered rows with fine rules */}
                    <RevealGroup className="lg:col-span-6 lg:col-start-7">
                        {REASONS.map((reason, i) => (
                            <RevealItem
                                key={reason.title}
                                className="group grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-rule py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-6 sm:py-8"
                            >
                                <span className="eyebrow pt-1.5 tabular-nums text-[#a9a49c] transition-colors duration-300 group-hover:text-coral">
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                <div>
                                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                        <h3 className="font-display text-[clamp(1.35rem,2.6vw,1.85rem)] leading-tight text-text">
                                            {reason.title}
                                        </h3>
                                        <span className="eyebrow text-[#a9a49c]">
                                            {reason.tone}
                                        </span>
                                    </div>
                                    <p className="mt-3 max-w-[34rem] text-[1rem] leading-[1.7] text-muted">
                                        {reason.body}
                                    </p>
                                </div>
                            </RevealItem>
                        ))}

                        <RevealItem className="border-t border-rule pt-7">
                            <ul className="flex flex-wrap gap-x-6 gap-y-3">
                                {[
                                    "Sketching",
                                    "Oil & acrylic",
                                    "Portrait drawing",
                                    "Art & craft",
                                    "Dance",
                                    "Zumba",
                                    "Choreography",
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-2 text-[14px] text-text/80"
                                    >
                                        <Check
                                            className="h-3.5 w-3.5 text-blue"
                                            aria-hidden="true"
                                        />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </RevealItem>
                    </RevealGroup>
                </div>
            </div>
        </section>
    );
}
