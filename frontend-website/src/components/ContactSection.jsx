import {
    MapPin,
    Phone,
    Instagram,
    ArrowUpRight,
    MessageCircle,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { contactLinks, siteConfig } from "@/data/siteConfig";

/**
 * Location & Contact (I) — verified business details only.
 *
 * No opening hours, no map pin coordinates and no landmark claims: those were
 * never supplied, so they are deliberately omitted rather than guessed.
 */
export default function ContactSection() {
    const channels = [
        {
            icon: MapPin,
            label: "Address",
            value: siteConfig.address.full,
            href: contactLinks.map,
            external: true,
            action: "Get directions",
        },
        {
            icon: Phone,
            label: "Phone",
            value: siteConfig.phone.display,
            href: contactLinks.phone,
            external: false,
            action: "Call the studio",
        },
        {
            icon: Instagram,
            label: "Instagram",
            value: siteConfig.instagram.handle,
            href: contactLinks.instagram,
            external: true,
            action: "View profile",
        },
        {
            icon: MessageCircle,
            label: "WhatsApp",
            value: siteConfig.phone.display,
            href: contactLinks.whatsapp,
            external: true,
            action: "Start a chat",
        },
    ];

    return (
        <section
            id="contact"
            data-tone="light"
            aria-labelledby="contact-title"
            className="relative bg-paper py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-12">
                    {/* Heading */}
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="contact-title"
                            number="08"
                            eyebrow="Location & contact"
                            title={
                                <>
                                    Find us in{" "}
                                    <span className="italic text-pink">
                                        Sector 52
                                    </span>
                                    .
                                </>
                            }
                            standfirst="Kala Mandir Art and Dance Institute, C-39, Block C, Sector 52, Noida."
                        />

                        <Reveal delay={0.1} className="mt-9">
                            {/* Address block set like a magazine colophon */}
                            <div className="rounded-[16px] border border-rule bg-white p-6 sm:p-7">
                                <p className="eyebrow text-[#b0a0aa]">Studio address</p>
                                <address className="mt-3 font-display text-[clamp(1.35rem,2.5vw,1.7rem)] not-italic leading-[1.35] text-text">
                                    {siteConfig.address.line1}
                                    <br />
                                    {siteConfig.address.city},{" "}
                                    {siteConfig.address.region}{" "}
                                    {siteConfig.address.postalCode}
                                </address>

                                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-rule pt-5">
                                    <a
                                        href={contactLinks.map}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="rule-link text-[15px] text-rose"
                                    >
                                        Get directions
                                        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                                    </a>
                                    <a
                                        href={contactLinks.phone}
                                        className="rule-link text-[15px] text-text"
                                    >
                                        {siteConfig.phone.display}
                                    </a>
                                </div>
                            </div>
                        </Reveal>
                    </div>

                    {/* Channel rows */}
                    <RevealGroup className="lg:col-span-6 lg:col-start-7">
                        {channels.map((channel) => (
                            <RevealItem key={channel.label}>
                                <a
                                    href={channel.href}
                                    {...(channel.external
                                        ? { target: "_blank", rel: "noopener noreferrer" }
                                        : {})}
                                    className="group grid grid-cols-[2.75rem_1fr_auto] items-center gap-x-4 border-t border-rule py-5 transition-colors duration-200 hover:border-[#d9c4d0] sm:gap-x-6 sm:py-6"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="grid h-11 w-11 place-items-center rounded-full border border-rule text-muted transition-all duration-200 group-hover:border-pink group-hover:bg-pink group-hover:text-white"
                                    >
                                        <channel.icon className="h-4.5 w-4.5" />
                                    </span>

                                    <span className="min-w-0">
                                        <span className="eyebrow block text-[#b0a0aa]">
                                            {channel.label}
                                        </span>
                                        <span className="mt-1 block break-words text-[1.05rem] leading-snug text-text">
                                            {channel.value}
                                        </span>
                                    </span>

                                    <span className="flex items-center gap-2 text-[13.5px] text-muted transition-colors duration-200 group-hover:text-pink">
                                        <span className="hidden sm:inline">
                                            {channel.action}
                                        </span>
                                        <ArrowUpRight
                                            aria-hidden="true"
                                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        />
                                    </span>
                                </a>
                            </RevealItem>
                        ))}

                        <RevealItem className="border-t border-rule pt-7">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="max-w-[26rem] text-[13.5px] leading-relaxed text-muted">
                                    Map opens in your default maps app. Opening hours
                                    and landmark details will be published once
                                    confirmed by the institute.
                                </p>
                                <a
                                    href="#enquiry"
                                    className="group inline-flex items-center gap-2 rounded-[11px] bg-rose px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-pink"
                                >
                                    Send an enquiry
                                    <ArrowUpRight
                                        aria-hidden="true"
                                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </a>
                            </div>
                        </RevealItem>
                    </RevealGroup>
                </div>
            </div>
        </section>
    );
}
