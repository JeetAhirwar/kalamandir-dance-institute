import { Instagram, ArrowUpRight, MessageCircle, CalendarDays } from "lucide-react";
import SmartImage from "@/components/SmartImage";
import SectionHeading from "@/components/SectionHeading";
import BrushStroke from "@/components/BrushStroke";
import Magnetic from "@/components/Magnetic";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { recentArtwork, instagram, events } from "@/data/updates";
import { buildWhatsAppUrl } from "@/data/siteConfig";

/**
 * StudioJournal — a "come back and see what's new" section.
 *
 * Three honest, data-driven blocks: the newest work on the exhibition wall
 * (real, already-approved pieces), a workshops/performances panel that renders
 * only confirmed events (and an honest empty state otherwise), and a direct
 * link to the studio's real Instagram. Nothing here is fabricated — no made-up
 * dates, events, testimonials or achievements.
 */

const updatesHref = buildWhatsAppUrl(
    "Hi Kala Mandir! I'd like to know about upcoming workshops and performances.",
);

export default function StudioJournal() {
    return (
        <section
            id="latest"
            data-tone="light"
            aria-labelledby="latest-title"
            className="section relative bg-blush"
        >
            <div className="shell">
                <SectionHeading
                    id="latest-title"
                    eyebrow="From the studio"
                    title={
                        <>
                            New work,{" "}
                            <span className="italic text-pink">new moves</span>.
                        </>
                    }
                    standfirst="A quick look at what's latest on the wall and on the floor — and where to follow along between visits."
                    className="max-w-[40rem]"
                >
                    <BrushStroke className="mt-6 h-4 w-52 text-pink/70" />
                </SectionHeading>

                {/* Newest pieces on the exhibition wall (real, approved work) */}
                <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                    {recentArtwork.map((item) => (
                        <RevealItem key={item.id}>
                            <a
                                href="#gallery"
                                className="group block focus-visible:outline-none"
                                aria-label={`See "${item.caption}" in the gallery`}
                            >
                                <div className="relative overflow-hidden rounded-[14px] border border-white shadow-[0_20px_44px_-32px_rgba(41,33,43,0.5)]">
                                    <SmartImage
                                        image={item}
                                        sizes="(max-width: 639px) 46vw, 24vw"
                                        className="aspect-[4/5] w-full"
                                        position={item.position || "50% 42%"}
                                        imgClassName="transition-transform duration-[700ms] ease-out group-hover:scale-[1.07] motion-reduce:transform-none"
                                    />
                                    <span className="eyebrow absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-rose backdrop-blur-sm">
                                        On the wall
                                    </span>
                                </div>
                                <p className="mt-3 text-[14px] leading-snug text-text/85">
                                    {item.caption}
                                </p>
                            </a>
                        </RevealItem>
                    ))}
                </RevealGroup>

                {/* Updates + Instagram */}
                <div className="mt-12 grid gap-5 lg:grid-cols-2 lg:gap-6">
                    {/* Workshops & performances — real events only */}
                    <Reveal className="flex h-full flex-col rounded-[18px] border border-rule bg-white p-6 sm:p-8">
                        <div className="flex items-center gap-2.5">
                            <CalendarDays
                                aria-hidden="true"
                                className="h-4 w-4 text-rose"
                            />
                            <h3 className="eyebrow text-muted">
                                Workshops &amp; performances
                            </h3>
                        </div>

                        {events.length > 0 ? (
                            <ul className="mt-5 space-y-4">
                                {events.map((event) => (
                                    <li
                                        key={event.id}
                                        className="border-t border-rule pt-4 first:border-t-0 first:pt-0"
                                    >
                                        <div className="flex items-baseline justify-between gap-4">
                                            <p className="font-display text-[1.15rem] leading-tight text-text">
                                                {event.title}
                                            </p>
                                            <span className="eyebrow shrink-0 text-pink">
                                                {event.kind}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[14px] text-muted">
                                            {event.when}
                                            {event.where ? ` · ${event.where}` : ""}
                                        </p>
                                        {event.blurb && (
                                            <p className="mt-1.5 text-[14px] leading-relaxed text-muted">
                                                {event.blurb}
                                            </p>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-5 text-[15px] leading-relaxed text-muted">
                                Nothing on the calendar to announce just yet. Ask us
                                about the next batch or a workshop and we'll tell you
                                exactly what's coming.
                            </p>
                        )}

                        <Magnetic strength={0.25} className="mt-auto pt-6">
                            <a
                                href={updatesHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 text-[15px] font-medium text-rose transition-colors duration-200 hover:text-pink"
                            >
                                <MessageCircle
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                                Ask about upcoming dates
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </Magnetic>
                    </Reveal>

                    {/* Follow the studio — real Instagram account */}
                    <Reveal
                        delay={0.08}
                        className="relative flex h-full flex-col overflow-hidden rounded-[18px] bg-gradient-to-br from-plum via-plum-2 to-charcoal p-6 text-cream sm:p-8"
                    >
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.22),transparent_65%)]"
                        />
                        <div className="relative flex items-center gap-2.5">
                            <Instagram aria-hidden="true" className="h-4 w-4 text-gold" />
                            <h3 className="eyebrow text-cream/70">Follow along</h3>
                        </div>
                        <p className="relative mt-5 font-display text-[1.5rem] leading-tight sm:text-[1.7rem]">
                            Class moments and fresh work, posted as they happen.
                        </p>
                        <p className="relative mt-2 text-[14px] text-cream/65">
                            {instagram.handle}
                        </p>
                        <Magnetic strength={0.25} className="relative mt-auto pt-6">
                            <a
                                href={instagram.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-[11px] bg-cream px-5 py-3 text-[14.5px] font-medium text-plum transition-colors duration-200 hover:bg-white"
                            >
                                <Instagram
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                />
                                Follow on Instagram
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </a>
                        </Magnetic>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
