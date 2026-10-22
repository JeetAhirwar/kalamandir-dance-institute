import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { useScrolled, useSectionSpy, useBodyScrollLock, useIsDesktop } from "@/hooks";
import MobileMenu from "@/components/MobileMenu";

const SECTION_IDS = siteConfig.nav
    .map((item) => item.href.replace("#", ""));

/**
 * Navbar — floating refined glass.
 *
 * Tone follows the section underneath it (charcoal glass over the dark hero and
 * dance showcase, warm neutral glass over paper), then compacts and firms up
 * after the first scroll. Deliberately short so it never dominates the page.
 */
export default function Navbar() {
    const scrolled = useScrolled(40);
    const active = useSectionSpy(SECTION_IDS);
    const [menuOpen, setMenuOpen] = useState(false);
    const [tone, setTone] = useState("dark");
    const reduce = useReducedMotion();
    const isDesktop = useIsDesktop();

    useBodyScrollLock(menuOpen);

    // Track whether a dark section sits behind the navbar.
    useEffect(() => {
        let frame = 0;
        const probe = 44; // approximate navbar centre line

        const update = () => {
            frame = 0;
            const sections = document.querySelectorAll("[data-tone]");
            let next = "dark";
            for (const section of sections) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= probe && rect.bottom > probe) {
                    next = section.dataset.tone || "dark";
                    break;
                }
            }
            setTone(next);
        };

        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(update);
        };

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    // Close the menu if the viewport grows to desktop.
    useEffect(() => {
        if (isDesktop) setMenuOpen(false);
    }, [isDesktop]);

    const dark = tone === "dark";

    return (
        <>
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
            >
                Skip to content
            </a>

            <motion.header
                initial={reduce ? false : { y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
                className="fixed inset-x-0 top-0 z-50 px-3 sm:px-5"
            >
                <nav
                    aria-label="Primary"
                    className={cn(
                        "mx-auto flex w-full max-w-[85rem] items-center justify-between rounded-[14px] border transition-all duration-300 ease-out",
                        // glass surface
                        dark
                            ? "border-white/12 bg-charcoal/55 shadow-[0_10px_40px_-24px_rgba(0,0,0,0.75)] backdrop-blur-xl"
                            : "border-black/[0.07] bg-paper/75 shadow-[0_10px_36px_-28px_rgba(32,33,36,0.5)] backdrop-blur-xl",
                        scrolled
                            ? "h-[58px] sm:h-[62px] px-4 sm:px-5"
                            : "h-[64px] sm:h-[74px] px-4 sm:px-6",
                    )}
                >
                    {/* Brand */}
                    <a
                        href="#home"
                        className="group flex items-center gap-2.5 focus-visible:outline-none"
                        aria-label={`${siteConfig.name} — home`}
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "grid h-8 w-8 shrink-0 place-items-center rounded-[9px] border font-display text-[17px] leading-none transition-colors duration-300",
                                dark
                                    ? "border-white/15 bg-white/[0.06] text-paper group-hover:border-coral/50"
                                    : "border-black/10 bg-white text-ink group-hover:border-coral/60",
                            )}
                        >
                            K
                        </span>
                        <span className="flex flex-col leading-none">
                            <span
                                className={cn(
                                    "font-display text-[17px] tracking-[-0.01em] transition-colors duration-300 sm:text-[19px]",
                                    dark ? "text-white" : "text-text",
                                )}
                            >
                                Kala Mandir
                            </span>
                            <span
                                className={cn(
                                    "eyebrow mt-[3px] text-[9px] tracking-[0.18em] transition-colors duration-300",
                                    dark ? "text-white/45" : "text-muted",
                                )}
                            >
                                Art &amp; Dance
                            </span>
                        </span>
                    </a>

                    {/* Desktop links */}
                    <ul className="hidden items-center gap-1 lg:flex">
                        {siteConfig.nav.map((item) => {
                            const isActive = active === item.href.replace("#", "");
                            return (
                                <li key={item.href}>
                                    <a
                                        href={item.href}
                                        aria-current={isActive ? "true" : undefined}
                                        className={cn(
                                            "relative rounded-full px-3.5 py-2 text-[13.5px] tracking-[0.01em] transition-colors duration-200",
                                            dark
                                                ? isActive
                                                    ? "text-white"
                                                    : "text-white/60 hover:text-white/90"
                                                : isActive
                                                  ? "text-text"
                                                  : "text-muted hover:text-text",
                                        )}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-indicator"
                                                aria-hidden="true"
                                                className="absolute inset-x-3.5 -bottom-px h-px bg-coral"
                                                transition={
                                                    reduce
                                                        ? { duration: 0 }
                                                        : { type: "spring", stiffness: 420, damping: 38 }
                                                }
                                            />
                                        )}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="flex items-center gap-2.5">
                        {/* Primary CTA */}
                        <a
                            href="#enquiry"
                            className={cn(
                                "group hidden items-center gap-1.5 rounded-[10px] border px-4 py-2.5 text-[13px] font-medium tracking-[0.01em] transition-all duration-200 sm:inline-flex",
                                dark
                                    ? "border-white/15 bg-white/[0.07] text-white hover:border-white/30 hover:bg-white/[0.13]"
                                    : "border-text bg-text text-paper hover:border-blue hover:bg-blue",
                            )}
                        >
                            Book a Trial Class
                            <ArrowUpRight
                                aria-hidden="true"
                                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                            />
                        </a>

                        {/* Mobile toggle */}
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            className={cn(
                                "grid h-11 w-11 place-items-center rounded-[10px] border transition-colors duration-200 lg:hidden",
                                dark
                                    ? "border-white/15 bg-white/[0.06] text-white"
                                    : "border-black/10 bg-white text-text",
                            )}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={menuOpen ? "x" : "menu"}
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.18 }}
                                    className="grid place-items-center"
                                >
                                    {menuOpen ? (
                                        <X className="h-5 w-5" aria-hidden="true" />
                                    ) : (
                                        <Menu className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </motion.span>
                            </AnimatePresence>
                        </button>
                    </div>
                </nav>
            </motion.header>

            <MobileMenu
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                active={active}
            />
        </>
    );
}
