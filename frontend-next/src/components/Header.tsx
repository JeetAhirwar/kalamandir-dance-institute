"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig, contactLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

/**
 * Header — sticky, translucent paper with a hairline. Multi-page awareness:
 * the active route gets its own underline; Dance/Art link to their dedicated
 * pages. Mobile: full-screen plum menu with staggered entering links.
 */
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  /* Close the menu on every navigation. */
  useEffect(() => setOpen(false), [pathname]);

  /* Lock scroll while the menu is open. */
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rule/70 bg-paper/85 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-6 lg:h-[4.5rem]">
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Kala Mandir — home"
            className="group flex items-baseline gap-2"
          >
            <span className="font-display text-[1.45rem] leading-none text-ink transition-colors duration-200 group-hover:text-rose sm:text-[1.6rem]">
              Kala Mandir
            </span>
            <span className="hidden font-sans text-[0.62rem] font-medium uppercase tracking-[0.22em] text-muted sm:inline">
              Sector 52 · Noida
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {siteConfig.nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.92rem] transition-colors duration-200",
                        item.pillar === "dance" && "text-ink/80 hover:text-plum2",
                        item.pillar === "art" && "text-ink/80 hover:text-rose",
                        !item.pillar && "text-ink/80 hover:text-rose",
                        active && "text-ink",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300",
                          active ? "scale-x-100" : "scale-x-0",
                          item.pillar === "dance" ? "bg-gold" : "bg-pink",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <a
              href={contactLinks.phones[0]}
              className="hidden h-10 w-10 place-items-center rounded-full border border-rule text-ink/70 transition-colors hover:border-rose hover:text-rose md:grid"
              aria-label="Call the institute"
            >
              <Phone className="h-4 w-4" />
            </a>
            <Link
              href="/admission"
              className="hidden items-center gap-1.5 rounded-[11px] bg-rose px-5 py-2.5 text-[0.9rem] font-medium text-white transition-colors duration-200 hover:bg-pink sm:inline-flex"
            >
              Enquire
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-rule text-ink lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen plum with large serif links */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="fixed inset-0 z-[60] grain bg-plum text-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="shell relative flex h-16 items-center justify-between">
              <span className="font-display text-[1.45rem] leading-none text-white">
                Kala Mandir
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/25 text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="shell mt-6">
              <motion.ul
                className="flex flex-col"
                initial="hidden"
                animate="show"
                variants={
                  reduce
                    ? undefined
                    : { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }
                }
              >
                {siteConfig.nav.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={
                      reduce
                        ? undefined
                        : { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }
                    }
                    className="border-b border-white/10"
                  >
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between py-4 font-display text-[2rem] text-white/90"
                    >
                      {item.label}
                      <ArrowUpRight className="h-5 w-5 text-gold" aria-hidden="true" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </nav>

            <div className="shell mt-8 flex flex-col gap-3 pb-10">
              <Link
                href="/admission"
                className="justify-self-start inline-flex items-center gap-2 rounded-[11px] bg-gold px-6 py-3.5 text-[0.95rem] font-semibold text-plum"
              >
                Enrol / Enquire
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href={contactLinks.phones[0]} className="text-[0.95rem] text-white/70">
                {siteConfig.phones[0].display}
              </a>
              <a
                href={contactLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.95rem] text-white/70"
              >
                {siteConfig.instagram.handle}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
