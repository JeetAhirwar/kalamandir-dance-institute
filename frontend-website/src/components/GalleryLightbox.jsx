import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

/**
 * GalleryLightbox — accessible full-screen image viewer.
 *
 * Keyboard: ← / → to move, Escape to close.
 * Pointer: swipe left/right on touch screens, backdrop click to close.
 * Focus moves in on open and returns to the triggering thumbnail on close.
 * Body scroll is locked while open.
 */
export default function GalleryLightbox({ items, index, onClose, onNavigate }) {
    const reduce = useReducedMotion();
    const closeRef = useRef(null);
    const previouslyFocused = useRef(null);
    const touchStart = useRef(null);
    const [failed, setFailed] = useState(false);

    const item = items[index];

    const go = useCallback(
        (delta) => {
            if (!items.length) return;
            setFailed(false);
            onNavigate((index + delta + items.length) % items.length);
        },
        [index, items.length, onNavigate],
    );

    // Focus + keyboard + scroll lock
    useEffect(() => {
        if (index == null) return;
        previouslyFocused.current = document.activeElement;
        closeRef.current?.focus();

        const { body } = document;
        const prevOverflow = body.style.overflow;
        body.style.overflow = "hidden";

        const onKey = (event) => {
            if (event.key === "Escape") onClose();
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
        };
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("keydown", onKey);
            body.style.overflow = prevOverflow;
            const target = previouslyFocused.current;
            if (target && typeof target.focus === "function") target.focus();
        };
    }, [index, go, onClose]);

    // Reset failure state whenever the slide changes
    useEffect(() => {
        setFailed(false);
    }, [index]);

    const onTouchStart = (event) => {
        touchStart.current = event.touches[0].clientX;
    };
    const onTouchEnd = (event) => {
        if (touchStart.current == null) return;
        const delta = event.changedTouches[0].clientX - touchStart.current;
        if (Math.abs(delta) > 55) go(delta < 0 ? 1 : -1);
        touchStart.current = null;
    };

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Gallery image ${index + 1} of ${items.length}: ${item.caption || item.alt}`}
                    className="fixed inset-0 z-[90] flex flex-col bg-paper/97 backdrop-blur-sm"
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Top bar */}
                    <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
                        <span className="eyebrow tabular-nums text-muted">
                            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </span>
                        <button
                            ref={closeRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close gallery"
                            className="grid h-11 w-11 place-items-center rounded-full border border-rule text-text transition-colors duration-200 hover:border-text hover:bg-white"
                        >
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Stage */}
                    <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-4 sm:px-16 sm:pb-6">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous image"
                            className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-rule bg-white/85 text-text transition-colors duration-200 hover:border-text hover:bg-white sm:left-4 sm:h-12 sm:w-12"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>

                        <figure className="flex h-full max-h-full w-full max-w-[64rem] flex-col items-center justify-center">
                            <div className="relative flex max-h-full items-center justify-center">
                                {failed ? (
                                    <div
                                        role="img"
                                        aria-label={item.alt}
                                        className="grid h-[50vh] w-[80vw] max-w-[40rem] place-items-center rounded-[14px] border border-rule bg-white text-center"
                                    >
                                        <span className="eyebrow text-muted">
                                            Image unavailable
                                        </span>
                                    </div>
                                ) : (
                                    <img
                                        src={item.fallback || item.src}
                                        alt={item.alt}
                                        width={item.width}
                                        height={item.height}
                                        decoding="async"
                                        onError={() => setFailed(true)}
                                        className="max-h-[68svh] w-auto max-w-full rounded-[10px] object-contain shadow-[0_36px_90px_-48px_rgba(32,33,36,0.55)] outline outline-1 outline-black/[0.06]"
                                    />
                                )}
                            </div>

                            <figcaption className="mt-5 max-w-[40rem] px-14 text-center">
                                <p className="font-display text-[1.3rem] leading-tight text-text sm:text-[1.5rem]">
                                    {item.caption}
                                </p>
                                <p className="eyebrow mt-2 text-muted">
                                    {item.category} · {item.status === "institute" ? "Kala Mandir student work" : `Placeholder · ${item.source}`}
                                </p>
                            </figcaption>
                        </figure>

                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next image"
                            className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-rule bg-white/85 text-text transition-colors duration-200 hover:border-text hover:bg-white sm:right-4 sm:h-12 sm:w-12"
                        >
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Thumbnail rail — visible only when there is more than one item */}
                    {items.length > 1 && (
                        <div className="flex items-center justify-center gap-2 overflow-x-auto px-4 pb-6 sm:pb-8">
                            {items.map((thumb, i) => (
                                <button
                                    key={thumb.id}
                                    type="button"
                                    onClick={() => onNavigate(i)}
                                    aria-label={`View image ${i + 1}: ${thumb.caption}`}
                                    aria-current={i === index ? "true" : undefined}
                                    className={`h-1.5 shrink-0 rounded-full transition-all duration-300 ${
                                        i === index
                                            ? "w-8 bg-pink"
                                            : "w-3 bg-ink/15 hover:bg-ink/40"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Small overlay cue used on gallery tiles (kept next to the lightbox). */
export function ZoomCue() {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/25 bg-black/25 text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
            <ZoomIn className="h-4 w-4" />
        </span>
    );
}
