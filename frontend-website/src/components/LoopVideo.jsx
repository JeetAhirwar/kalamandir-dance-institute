import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks";

/**
 * LoopVideo — a decorative background clip.
 *
 * Without an `end` the element uses the browser's native `loop`, so the whole
 * file plays and restarts. With an `end` it rewinds to `start` when it reaches
 * that time, which lets two placements share one file while showing different
 * passages of it.
 *
 * Playback is held down to 0.9× so the movement reads as calm rather than
 * twitchy, paused whenever the clip is off screen, and replaced by a single
 * still frame when the visitor prefers reduced motion.
 *
 * `poster` keeps the frame from going black while the file is still loading,
 * which matters for the 4 MB source used here.
 */
export default function LoopVideo({
    src,
    start = 0,
    end,
    rate = 0.9,
    stillAt,
    poster,
    playing = true,
    eager = false,
    className,
    ...rest
}) {
    const ref = useRef(null);
    const reduce = useReducedMotion();
    const [inView, setInView] = useState(eager);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver !== "function") {
            setInView(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: "15% 0px" },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    /* Seek once, before the first frame is painted, so the clip never opens on
       a passage outside its assigned range. The source URL also carries the
       start time as a media fragment, so the first decoded frame is already the
       right one even if this effect misses the metadata event. */
    useEffect(() => {
        const el = ref.current;
        if (!el || start <= 0) return undefined;
        const seek = () => {
            if (el.currentTime < start) el.currentTime = start;
        };
        if (el.readyState >= 1) seek();
        else el.addEventListener("loadedmetadata", seek, { once: true });
        el.addEventListener("loadeddata", seek, { once: true });
        return () => {
            el.removeEventListener("loadedmetadata", seek);
            el.removeEventListener("loadeddata", seek);
        };
    }, [start]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.muted = true;
        el.playbackRate = rate;

        if (reduce) {
            el.pause();
            const at = stillAt ?? start;
            const hold = () => {
                el.currentTime = at;
            };
            if (el.readyState >= 1) hold();
            else el.addEventListener("loadedmetadata", hold, { once: true });
            return;
        }

        if (playing && inView) {
            const attempt = el.play();
            if (attempt?.catch) attempt.catch(() => {});
        } else {
            el.pause();
        }
    }, [playing, inView, reduce, rate, start, stillAt]);

    useEffect(() => {
        const el = ref.current;
        if (!el || reduce || typeof end !== "number") return undefined;
        const onTime = () => {
            if (el.currentTime >= end) el.currentTime = start;
        };
        el.addEventListener("timeupdate", onTime);
        return () => el.removeEventListener("timeupdate", onTime);
    }, [reduce, start, end]);

    return (
        <video
            ref={ref}
            aria-hidden="true"
            muted
            playsInline
            loop={typeof end !== "number"}
            poster={poster}
            autoPlay={!reduce && eager}
            preload={reduce || !eager ? "metadata" : "auto"}
            disablePictureInPicture
            tabIndex={-1}
            className={className}
            {...rest}
        >
            <source src={start > 0 ? `${src}#t=${start}` : src} type="video/mp4" />
        </video>
    );
}
