import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SmartImage
 *
 * - WebP source with a JPEG fallback via <picture>
 * - explicit width/height → no layout shift while loading
 * - skeleton until decode, graceful error panel if a file is missing
 * - lazy by default; `priority` for the hero/first-viewport image
 * - never animates layout, only opacity (cheap and calm)
 */
export default function SmartImage({
    image,
    src,
    fallback,
    alt,
    width,
    height,
    className,
    imgClassName,
    priority = false,
    sizes,
    fit = "cover",
    position = "center",
    onLoad: onLoadProp,
}) {
    const record = image || {};
    const finalSrc = src ?? fallback ?? record.fallback ?? record.src;
    const finalWebp = src ?? record.src;
    const finalAlt = alt ?? record.alt ?? "";
    const w = width ?? record.width;
    const h = height ?? record.height;

    const [status, setStatus] = useState("loading"); // loading | ready | error
    const imgRef = useRef(null);

    // If the image is already complete (cache/back-forward), skip the skeleton.
    useEffect(() => {
        const el = imgRef.current;
        if (el?.complete && el.naturalWidth > 0) setStatus("ready");
    }, [finalSrc]);

    const handleLoad = (event) => {
        setStatus("ready");
        onLoadProp?.(event);
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden bg-[#f4e7ee]",
                status === "loading" && "km-skeleton",
                className,
            )}
            style={{ aspectRatio: w && h ? `${w} / ${h}` : undefined }}
        >
            {status === "error" ? (
                // Graceful missing-image state: keeps the composition intact and
                // stays legible instead of collapsing the layout.
                <div
                    role="img"
                    aria-label={finalAlt || "Image unavailable"}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f6ecf1] px-4 text-center"
                >
                    <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-6 w-6 text-[#b0a0aa]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.4"
                    >
                        <rect x="3" y="4" width="18" height="16" rx="1.5" />
                        <path d="m4 17 5-5 4 4 3-3 4 4" />
                        <circle cx="9" cy="9" r="1.4" />
                    </svg>
                    <span className="eyebrow text-[#9c8a94]">Image unavailable</span>
                </div>
            ) : (
                <picture>
                    {finalWebp && finalWebp !== finalSrc && (
                        <source type="image/webp" srcSet={finalWebp} sizes={sizes} />
                    )}
                    <img
                        ref={imgRef}
                        src={finalSrc}
                        alt={finalAlt}
                        width={w}
                        height={h}
                        loading={priority ? "eager" : "lazy"}
                        decoding={priority ? "sync" : "async"}
                        // LCP hint for the hero image only.
                        fetchPriority={priority ? "high" : "auto"}
                        onLoad={handleLoad}
                        onError={() => setStatus("error")}
                        className={cn(
                            "h-full w-full transition-opacity duration-500",
                            fit === "cover" ? "object-cover" : "object-contain",
                            status === "ready" ? "opacity-100" : "opacity-0",
                            imgClassName,
                        )}
                        style={{ objectPosition: position }}
                    />
                </picture>
            )}
        </div>
    );
}
