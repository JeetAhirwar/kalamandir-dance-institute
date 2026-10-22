import { useEffect, useState } from "react";

/**
 * True while the element matching `selector` is intersecting the viewport.
 * Used by the floating WhatsApp button so it stands down near the form.
 */
export function useInViewSelector(selector) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const target = document.querySelector(selector);
        if (!target || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [selector]);

    return inView;
}
