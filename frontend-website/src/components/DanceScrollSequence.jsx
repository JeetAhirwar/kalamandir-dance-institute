import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";

/**
 * DanceScrollSequence — a scroll-scrubbed dancer.
 *
 * The section pins for a stretch of scroll and, as the visitor moves through
 * it, an image sequence (extracted from the institute's own dance clip) steps
 * frame by frame — so scrolling literally makes the dancer move. Nothing here
 * is a stock placeholder: the frames come from a clip supplied by the client.
 *
 * Implementation notes:
 *  - The frame index is derived from the pinned track's bounding rect on a
 *    plain scroll/resize listener (throttled to one read per frame). This keeps
 *    the scrub tied to real scroll position rather than an animation loop.
 *  - Frames are preloaded once, so scrubbing always reads from cache.
 *  - With `prefers-reduced-motion` the pin and scrubbing are dropped and a
 *    single still frame is shown — the content stands on its own.
 */

const FRAME_COUNT = 48;
const BASE = "/assets/dance-seq";
const frames = Array.from(
    { length: FRAME_COUNT },
    (_, i) => `${BASE}/frame-${String(i + 1).padStart(2, "0")}.webp`,
);

const clamp = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

export default function DanceScrollSequence() {
    const trackRef = useRef(null);
    const railRef = useRef(null);
    const reduce = useReducedMotion();
    const [frame, setFrame] = useState(0);
    const [ready, setReady] = useState(false);

    // Preload every frame once, so scrubbing reads from cache.
    useEffect(() => {
        const imgs = frames.map((src) => {
            const img = new Image();
            img.src = src;
            return img;
        });
        Promise.allSettled(
            imgs.map(
                (img) =>
                    img.complete ||
                    new Promise((res) => {
                        img.onload = img.onerror = res;
                    }),
            ),
        ).then(() => setReady(true));
        return () => imgs.forEach((img) => (img.onload = img.onerror = null));
    }, []);

    // Map the pinned track's position through the viewport onto a frame index.
    const measure = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const rect = track.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const progress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
        const next = Math.round(progress * (FRAME_COUNT - 1));
        setFrame((prev) => (prev === next ? prev : next));
        if (railRef.current) {
            railRef.current.style.transform = `scaleX(${progress})`;
        }
    }, []);

    useEffect(() => {
        if (reduce) return;
        let last = 0;
        const onScroll = () => {
            const now = performance.now();
            if (now - last < 16) return; // ~one read per frame
            last = now;
            measure();
        };
        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [measure, reduce]);

    const activeSrc = frames[reduce ? 0 : frame];

    return (
        <section
            id="dance-motion"
            data-tone="dark"
            aria-labelledby="dance-motion-title"
            className="relative bg-plum"
        >
            {/* Tall outer track gives the pinned viewport its scroll distance. */}
            <div
                ref={trackRef}
                className={reduce ? "relative" : "relative h-[320vh] sm:h-[360vh]"}
            >
                <div
                    className={
                        reduce
                            ? "relative"
                            : "sticky top-0 flex h-screen items-center overflow-hidden"
                    }
                >
                    {/* Warm radial glow behind the dancer */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,rgba(251,191,36,0.16)_0%,rgba(74,29,76,0.55)_45%,var(--color-plum)_78%)]"
                    />

                    <div className="shell relative w-full">
                        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-x-14">
                            {/* Copy */}
                            <div className="lg:col-span-5">
                                <Reveal>
                                    <p className="eyebrow text-gold">Motion study</p>
                                    <h2
                                        id="dance-motion-title"
                                        className="mt-4 font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-[1.03] text-white"
                                    >
                                        Keep scrolling —{" "}
                                        <span className="italic text-flame">
                                            she keeps dancing.
                                        </span>
                                    </h2>
                                    <p className="mt-5 max-w-[30rem] text-[1.02rem] leading-[1.72] text-white/72">
                                        A single turn, played out across the page.
                                        Every frame is drawn from the institute's own
                                        dance footage — the same spin, from first
                                        count to last.
                                    </p>

                                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                                        <a
                                            href="#enquiry"
                                            className="group inline-flex items-center gap-2 rounded-[11px] bg-white px-6 py-3.5 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-cream"
                                        >
                                            Enquire about dance
                                            <ArrowUpRight
                                                aria-hidden="true"
                                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            />
                                        </a>
                                        <a
                                            href="#dance"
                                            className="rule-link text-[15px] text-white/70 hover:text-white"
                                        >
                                            See the studio
                                        </a>
                                    </div>
                                </Reveal>
                            </div>

                            {/* Scrubbed frame */}
                            <div className="lg:col-span-7">
                                <Reveal delay={0.1}>
                                    <figure className="relative overflow-hidden rounded-[18px] border border-white/10 bg-charcoal">
                                        <div className="relative aspect-[16/10] w-full">
                                            <img
                                                src={activeSrc}
                                                alt="A classical dancer turning through a full spin inside a warmly lit palace arch."
                                                decoding="async"
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            {!ready && (
                                                <span className="km-skeleton absolute inset-0" />
                                            )}
                                        </div>

                                        {/* Scrub progress rail */}
                                        {!reduce && (
                                            <div
                                                aria-hidden="true"
                                                className="absolute inset-x-0 bottom-0 h-[3px] bg-white/12"
                                            >
                                                <div
                                                    ref={railRef}
                                                    className="h-full w-full origin-left bg-gradient-to-r from-gold to-flame"
                                                    style={{ transform: "scaleX(0)" }}
                                                />
                                            </div>
                                        )}
                                    </figure>
                                </Reveal>

                                <p className="mt-3 flex items-center gap-2 text-[12.5px] text-white/45">
                                    <span
                                        aria-hidden="true"
                                        className={
                                            reduce
                                                ? "h-1.5 w-1.5 rounded-full bg-gold"
                                                : "h-1.5 w-1.5 rounded-full bg-gold motion-safe:animate-pulse"
                                        }
                                    />
                                    {reduce
                                        ? "A still from the dance reel."
                                        : "Scroll to advance the frame · " +
                                          String(frame + 1).padStart(2, "0") +
                                          " / " +
                                          FRAME_COUNT}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
