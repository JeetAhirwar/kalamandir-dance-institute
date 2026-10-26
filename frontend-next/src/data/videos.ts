/**
 * Video sources — honest by design.
 *
 * The institute's own dance videos are hosted on Instagram
 * (@kala_mandir_sec52) and inside its Google Business Profile. These are the
 * official Instagram shortcodes discovered on the institute's own profile;
 * each is embedded via Instagram's official embed route below.
 *
 * There is no invented video URL anywhere. A client-supplied hero video can
 * be dropped into `public/videos/hero.mp4` — HeroCinematic picks it up
 * automatically and falls back to the cinematic image treatment otherwise.
 */

export const instagramReels = [
  "DWgpWMtCWUB",
  "DR12_9wEjn7",
  "DcQyS5vpJMD",
  "DcLtStVJinZ",
  "DcCDFKpSy4B",
  "DcA3UHcp6nz",
] as const;

/** Instagram's official embed endpoint (no API needed). */
export function instagramEmbedUrl(shortcode: string): string {
  return `https://www.instagram.com/reel/${shortcode}/embed/captioned/`;
}

/** Instagram post URL (for "watch on Instagram" links). */
export function instagramPostUrl(shortcode: string): string {
  return `https://www.instagram.com/reel/${shortcode}/`;
}
