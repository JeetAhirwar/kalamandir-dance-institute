import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes without specificity collisions. */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/** Clamp a number between bounds (used for parallax + magnetic offsets). */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/** Format an Indian phone number for display in the footer/contact blocks. */
export function formatPhone(e164) {
    const digits = String(e164 || "").replace(/\D/g, "").replace(/^91/, "");
    if (digits.length !== 10) return e164;
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/**
 * Pick the display source for an image record.
 * WebP is primary, JPEG is the universal fallback carried by <picture>.
 */
export function pictureSources(image) {
    if (!image) return {};
    return {
        src: image.fallback || image.src,
        webp: image.src && image.src.endsWith(".webp") ? image.src : null,
        width: image.width,
        height: image.height,
        alt: image.alt || "",
    };
}
