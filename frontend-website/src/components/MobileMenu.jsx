import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Instagram, Phone } from "lucide-react";
import { siteConfig, contactLinks } from "@/data/siteConfig";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/motion";

/**
 * MobileMenu — full-screen charcoal panel.
 *
 * Tall, quiet typography; every target ≥44px; closes on link click, Escape and
 * backdrop tap; focus moves in on open and returns to the toggle on close.
 */
export default function MobileMenu({ open, onClose, active }) {
    const reduce = useReducedMotion();
    const panelRef = useRef(null);
    const previouslyFocused = useRef(null);

    // Focus management + Escape handling.
    useEffect(() => {
        if (!open) return;
        previouslyFocused.current = document.activeElement;

        const first = panelRef.current?.querySelector("a, button");
        first?.focus();

        const onKey = (event) => {
            if (event.key === "Escape") onClose();

            // Simple focus trap.
            if (event.key === "Tab" && panelRef.current) {
                const focusables = panelRef.current.querySelectorAll(
                    'a[href], button:not([disabled])',
                );
                if (!focusables.length) return;
                const firstEl = focusables[0];
                const lastEl = focusables[focusables.length - 1];
                if (event.shiftKey && document.activeElement === firstEl) {
                    event.preventDefault();
                    lastEl.focus();
                } else if (!event.shiftKey && document.activeElement === lastEl) {
                    event.preventDefault();
                    firstEl.focus();
                }
            }
        };

        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("keydown", onKey);
            const target = previouslyFocused.current;
            if (target && typeof target.focus === "function") target.focus();
        };
    }, [open, onClose]);

    const listVariants = reduce
        ? {}
        : {
              hidden: {},
              show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } },
              exit: { transition: { staggerChildren: 0.03 } },
          };

    const itemVariants = reduce
        ? {}
        : {
              hidden: { opacity: 0, y: 26 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
              exit: { opacity: 0, y: 12, transition: { duration: 0.25 } },
          };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    id="mobile-menu"
                    ref={panelRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    className="fixed inset-0 z-40 flex flex-col bg-paper lg:hidden"
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.28, ease }}
                >
                    {/* soft colour washes so the panel isn't a flat slab */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                    >
                        <span className="absolute inset-0 bg-[radial-gradient(120%_60%_at_90%_0%,rgba(139,92,246,0.08),transparent_55%)]" />
                        <span className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.12),transparent_65%)]" />
                        <span className="absolute bottom-0 right-0 h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.12),transparent_65%)]" />
                    </div>

                    <div className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-24 sm:px-8">
                        <motion.nav
                            aria-label="Mobile"
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                            exit="exit"
                            className="flex-1"
                        >
                            <ul className="space-y-1">
                                {siteConfig.nav.map((item, index) => {
                                    const id = item.href.replace("#", "");
                                    const isActive = active === id;
                                    return (
                                        <motion.li key={item.href} variants={itemVariants}>
                                            <a
                                                href={item.href}
                                                onClick={onClose}
                                                aria-current={isActive ? "true" : undefined}
                                                className="group flex items-baseline gap-4 border-b border-rule py-4"
                                            >
                                                <span className="eyebrow w-7 shrink-0 tabular-nums text-[#b0a0aa]">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "font-display text-[2rem] leading-none tracking-[-0.01em] transition-colors duration-200 sm:text-[2.4rem]",
                                                        isActive
                                                            ? "text-pink"
                                                            : "text-text group-hover:text-muted",
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </a>
                                        </motion.li>
                                    );
                                })}
                            </ul>

                            <motion.div variants={itemVariants} className="mt-8 space-y-3">
                                <a
                                    href="#enquiry"
                                    onClick={onClose}
                                    className="flex items-center justify-between gap-3 rounded-[12px] bg-rose px-5 py-4 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-pink"
                                >
                                    Book a Trial Class
                                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                </a>

                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href={contactLinks.phone}
                                        className="flex items-center justify-center gap-2 rounded-[12px] border border-rule bg-white py-3.5 text-[13.5px] text-text transition-colors duration-200 hover:border-text"
                                    >
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                        Call
                                    </a>
                                    <a
                                        href={contactLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-[12px] border border-rule bg-white py-3.5 text-[13.5px] text-text transition-colors duration-200 hover:border-text"
                                    >
                                        <Instagram className="h-4 w-4" aria-hidden="true" />
                                        Instagram
                                    </a>
                                </div>
                            </motion.div>
                        </motion.nav>

                        <motion.div
                            variants={itemVariants}
                            className="mt-10 border-t border-rule pt-6"
                        >
                            <p className="eyebrow text-muted">Studio</p>
                            <address className="mt-2 not-italic text-[14px] leading-relaxed text-muted">
                                {siteConfig.address.full}
                            </address>
                            <a
                                href={`tel:${siteConfig.phone.e164}`}
                                className="mt-1.5 inline-block font-display text-[19px] text-text"
                            >
                                {siteConfig.phone.display}
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
