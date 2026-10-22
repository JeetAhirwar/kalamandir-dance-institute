import { galleryItems } from "@/data/gallery";
import { siteConfig } from "@/data/siteConfig";

/**
 * Return-visit content — everything here is derived from material that is
 * already real and approved for the site. Nothing is invented: no dates,
 * events, testimonials or achievements are fabricated.
 */

/**
 * recentArtwork — the newest pieces added to the student exhibition. "Recent"
 * means the latest works the institute supplied for the wall, not a made-up
 * timestamp. These are the same records the gallery already shows.
 */
const recentIds = ["km-artwork-15", "km-artwork-14", "km-artwork-13", "km-artwork-12"];

export const recentArtwork = recentIds
    .map((id) => galleryItems.find((item) => item.id === id))
    .filter(Boolean);

/** Official Instagram — verified handle and URL from siteConfig. */
export const instagram = {
    handle: siteConfig.instagram.handle,
    url: siteConfig.instagram.url,
};

/**
 * events — upcoming workshops, performances and exhibitions.
 *
 * Populate ONLY with items confirmed by the institute. Each entry:
 *   { id, title, kind, when, where, blurb }
 *   - `kind`  : "Workshop" | "Performance" | "Exhibition" | "Batch"
 *   - `when`  : a human-readable, confirmed date string (e.g. "Sun 14 Dec, 5pm")
 *   - `where` : venue / "Studio" / "Online"
 *
 * The section hides this block entirely when the array is empty and shows an
 * honest "nothing to announce yet" line instead — so an empty list never
 * renders a placeholder or a fabricated event.
 */
export const events = [];
