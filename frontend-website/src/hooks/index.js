import { useEffect, useState, useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------- */
/*  prefers-reduced-motion                                                     */
/* -------------------------------------------------------------------------- */

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback) {
    const media = window.matchMedia(QUERY);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
}

function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}

/** True when the visitor has asked the OS to reduce motion. */
export function useReducedMotion() {
    return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/* -------------------------------------------------------------------------- */
/*  viewport queries                                                           */
/* -------------------------------------------------------------------------- */

function useMediaQuery(query) {
    const subscribe = (cb) => {
        const media = window.matchMedia(query);
        media.addEventListener("change", cb);
        return () => media.removeEventListener("change", cb);
    };
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
    );
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMobile = () => useMediaQuery("(max-width: 767px)");
export const useHoverCapable = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/* -------------------------------------------------------------------------- */
/*  scrolled state — drives the navbar's compact glass transition              */
/* -------------------------------------------------------------------------- */

export function useScrolled(threshold = 24) {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                setScrolled(window.scrollY > threshold);
                frame = 0;
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [threshold]);
    return scrolled;
}

/* -------------------------------------------------------------------------- */
/*  active section spy — highlights the current navbar link                    */
/* -------------------------------------------------------------------------- */

export function useSectionSpy(ids) {
    const [active, setActive] = useState(ids[0] ?? null);

    useEffect(() => {
        const sections = ids
            .map((id) => document.getElementById(id))
            .filter(Boolean);
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                // Choose the entry nearest the top that is actually intersecting.
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length) {
                    setActive(visible[0].target.id);
                }
            },
            // Band roughly across the middle of the viewport, so the indicator
            // changes when a section genuinely takes over the screen.
            { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [ids.join("|")]);

    return active;
}

/* -------------------------------------------------------------------------- */
/*  body scroll lock (mobile menu + lightbox)                                  */
/* -------------------------------------------------------------------------- */

export function useBodyScrollLock(locked) {
    useEffect(() => {
        if (!locked) return;
        const { body } = document;
        const previousOverflow = body.style.overflow;
        const previousPadding = body.style.paddingRight;
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        body.style.overflow = "hidden";
        if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
        return () => {
            body.style.overflow = previousOverflow;
            body.style.paddingRight = previousPadding;
        };
    }, [locked]);
}

/* -------------------------------------------------------------------------- */
/*  smooth anchor scrolling (accessible: respects reduced motion)              */
/* -------------------------------------------------------------------------- */

export function useSmoothAnchors(enabled = true) {
    useEffect(() => {
        if (!enabled) return;
        const onClick = (event) => {
            const anchor = event.target.closest?.('a[href^="#"]');
            if (!anchor) return;
            const hash = anchor.getAttribute("href");
            if (!hash || hash === "#") return;
            const target = document.querySelector(hash);
            if (!target) return;
            event.preventDefault();
            const reduce = window.matchMedia(QUERY).matches;
            target.scrollIntoView({
                behavior: reduce ? "auto" : "smooth",
                block: "start",
            });
            // Move focus for keyboard/AT users without stealing the URL.
            const focusable = target.querySelector("h1, h2, h3, [tabindex]");
            if (focusable) {
                focusable.setAttribute("tabindex", "-1");
                focusable.focus({ preventScroll: true });
            }
            if (history.replaceState) history.replaceState(null, "", hash);
        };
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, [enabled]);
}
