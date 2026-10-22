import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { contactLinks } from "@/data/siteConfig";
import { useInViewSelector } from "@/lib/useScrolledFlag";

/**
 * Floating WhatsApp affordance.
 *
 * Appears only after the visitor has scrolled past the hero (so it never
 * competes with the opening composition), hides again while the enquiry form is
 * on screen, and never uses a magnetic/elastic treatment.
 */
export default function WhatsAppButton() {
    const reduce = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const nearForm = useInViewSelector("#enquiry");

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.85);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const show = visible && !nearForm;

    return (
        <AnimatePresence>
            {show && (
                <motion.a
                    href={contactLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat with Kala Mandir on WhatsApp (opens in a new tab)"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
                    className="group fixed bottom-4 right-4 z-40 flex items-center gap-2.5 rounded-full border border-white/15 bg-charcoal/90 py-3 pl-3 pr-3.5 text-white shadow-[0_16px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-all duration-200 hover:border-[#25D366]/70 hover:bg-charcoal sm:bottom-6 sm:right-6 sm:pr-4.5"
                >
                    <span
                        aria-hidden="true"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"
                    >
                        <MessageCircle className="h-4.5 w-4.5" />
                    </span>
                    <span className="hidden text-[14px] font-medium sm:inline">
                        WhatsApp us
                    </span>
                </motion.a>
            )}
        </AnimatePresence>
    );
}
