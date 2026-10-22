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
                    className="fixed inset-0 z-40 flex flex-col bg-charcoal lg:hidden"
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                    transition={{ duration: 0.28, ease }}
                >
                    {/* soft warm glow so the panel isn't a flat black slab */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_75%_at_85%_0%,rgba(231,124,102,0.16),transparent_60%)]"
                    />

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
                                                className="group flex items-baseline gap-4 border-b border-white/10 py-4"
                                            >
                                                <span className="eyebrow w-7 shrink-0 tabular-nums text-white/30">
                                                    {String(index + 1).padStart(2, "0")}
                                                </span>
                                                <span
                                                    className={cn(
                                                        "font-display text-[2rem] leading-none tracking-[-0.01em] transition-colors duration-200 sm:text-[2.4rem]",
                                                        isActive
                                                            ? "text-coral"
                                                            : "text-white group-hover:text-white/75",
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
                                    className="flex items-center justify-between gap-3 rounded-[12px] bg-paper px-5 py-4 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-white"
                                >
                                    Book a Trial Class
                                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                                </a>

                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href={contactLinks.phone}
                                        className="flex items-center justify-center gap-2 rounded-[12px] border border-white/15 py-3.5 text-[13.5px] text-white/85 transition-colors duration-200 hover:border-white/35"
                                    >
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                        Call
                                    </a>
                                    <a
                                        href={contactLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-[12px] border border-white/15 py-3.5 text-[13.5px] text-white/85 transition-colors duration-200 hover:border-white/35"
                                    >
                                        <Instagram className="h-4 w-4" aria-hidden="true" />
                                        Instagram
                                    </a>
                                </div>
                            </motion.div>
                        </motion.nav>

                        <motion.div
                            variants={itemVariants}
                            className="mt-10 border-t border-white/10 pt-6"
                        >
                            <p className="eyebrow text-white/35">Studio</p>
                            <address className="mt-2 not-italic text-[14px] leading-relaxed text-white/60">
                                {siteConfig.address.full}
                            </address>
                            <a
                                href={`tel:${siteConfig.phone.e164}`}
                                className="mt-1.5 inline-block font-display text-[19px] text-white"
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
