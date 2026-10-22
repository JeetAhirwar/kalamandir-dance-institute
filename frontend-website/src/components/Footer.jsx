import { ArrowUp, Instagram, Phone, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, contactLinks } from "@/data/siteConfig";
import { classLinks } from "@/data/classes";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";

/**
 * Footer (J) — typography-led, restrained dividers.
 *
 * Only verified business details appear here. The year is computed at runtime
 * so it never goes stale.
 */
export default function Footer() {
    const year = new Date().getFullYear();

    const scrollToTop = () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("home")?.focus?.();
    };

    return (
        <footer
            data-tone="dark"
            className="grain relative isolate overflow-hidden bg-plum text-white"
        >
            <div className="relative">
                <div className="shell">
                    {/* Big wordmark row */}
                    <Reveal className="border-b border-white/12 pb-10 pt-20 sm:pt-24 lg:pt-28">
                        <p className="eyebrow text-white/40">Where art comes alive</p>
                        <p className="mt-4 font-display text-[clamp(2.4rem,8vw,6rem)] leading-[0.95] tracking-[-0.02em] text-white">
                            Kala Mandir
                            <span className="text-pink">.</span>
                        </p>
                        <p className="mt-3 max-w-[34rem] text-[15.5px] leading-relaxed text-white/55">
                            {siteConfig.name} — art and dance classes in Sector 52,
                            Noida.
                        </p>
                    </Reveal>

                    {/* Link columns */}
                    <RevealGroup className="grid grid-cols-1 gap-x-10 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
                        <RevealItem>
                            <p className="eyebrow text-white/35">Explore</p>
                            <ul className="mt-4 space-y-2.5">
                                {siteConfig.nav.map((item) => (
                                    <li key={item.href}>
                                        <a
                                            href={item.href}
                                            className="text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </RevealItem>

                        <RevealItem>
                            <p className="eyebrow text-white/35">Classes</p>
                            <ul className="mt-4 space-y-2.5">
                                {classLinks.map((item) => (
                                    <li key={item.label}>
                                        <a
                                            href={item.href}
                                            className="text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </RevealItem>

                        <RevealItem>
                            <p className="eyebrow text-white/35">Visit</p>
                            <address className="mt-4 space-y-3 not-italic text-[15px] leading-relaxed text-white/70">
                                <span className="flex items-start gap-2.5">
                                    <MapPin
                                        className="mt-1 h-4 w-4 shrink-0 text-white/40"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {siteConfig.address.line1}
                                        <br />
                                        {siteConfig.address.city},{" "}
                                        {siteConfig.address.region}{" "}
                                        {siteConfig.address.postalCode}
                                    </span>
                                </span>
                            </address>
                        </RevealItem>

                        <RevealItem>
                            <p className="eyebrow text-white/35">Contact</p>
                            <ul className="mt-4 space-y-3">
                                <li>
                                    <a
                                        href={contactLinks.phone}
                                        className="flex items-center gap-2.5 text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                                    >
                                        <Phone
                                            className="h-4 w-4 shrink-0 text-white/40"
                                            aria-hidden="true"
                                        />
                                        {siteConfig.phone.display}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={contactLinks.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                                    >
                                        <MessageCircle
                                            className="h-4 w-4 shrink-0 text-white/40"
                                            aria-hidden="true"
                                        />
                                        WhatsApp us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={contactLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2.5 text-[15px] text-white/70 transition-colors duration-200 hover:text-white"
                                    >
                                        <Instagram
                                            className="h-4 w-4 shrink-0 text-white/40"
                                            aria-hidden="true"
                                        />
                                        {siteConfig.instagram.handle}
                                    </a>
                                </li>
                            </ul>

                            <a
                                href="#enquiry"
                                className="mt-5 inline-flex items-center gap-2 rounded-[10px] border border-white/20 px-4 py-2.5 text-[14px] transition-colors duration-200 hover:border-white/50 hover:bg-white/[0.07]"
                            >
                                Book a trial class
                            </a>
                        </RevealItem>
                    </RevealGroup>

                    {/* Base bar */}
                    <div className="flex flex-col gap-5 border-t border-white/12 py-8 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[13.5px] text-white/45">
                            © {year} {siteConfig.name}. All rights reserved.
                        </p>

                        <div className="flex items-center gap-6">
                            <p className="text-[13.5px] text-white/45">
                                Sector 52, Noida · {siteConfig.instagram.handle}
                            </p>
                            <button
                                type="button"
                                onClick={scrollToTop}
                                aria-label="Back to top"
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/70 transition-all duration-200 hover:border-white/50 hover:bg-white/10 hover:text-white"
                            >
                                <ArrowUp className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
