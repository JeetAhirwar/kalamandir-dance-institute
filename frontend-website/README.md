# Kala Mandir Art & Dance Institute — Website

Single-page marketing site for **Kala Mandir Art and Dance Institute**, C-39,
Sector 52, Noida. Built with React + Vite + Tailwind CSS v4 and `motion` for
animation. No router, no backend — the enquiry form opens WhatsApp.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 (port auto-increments if busy)
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Design system

- **Art world** — pink & white: blush/blossom surfaces, vibrant pink
  (`#ec4899`) and deep rose (`#be185d`) accents on warm paper (`#fffcfa`).
- **Dance world** — deep plum (`#351536`) with cream, flame-coral, electric
  violet and gold accents. Dark, energetic, deliberately distinct from art.
- All colour and type tokens live in `src/index.css` under `@theme`. No
  hard-coded colours in components.
- Fonts (DM Serif Display + Inter) are **self-hosted** under
  `public/assets/fonts/` — zero third-party font requests.

## Content rules (please keep)

- **No invented facts.** Fees, schedules, teacher names and counts are absent
  on purpose. Add them only after the institute confirms them in writing.
- **Business facts are centralised** in `src/data/siteConfig.js` (phone,
  WhatsApp, address, Instagram, Google Maps). Change a fact in one place.
- **Enquiry form** posts to WhatsApp (wa.me) — no server, no data collection.

## Media provenance

All photographs and artwork on the site are **authentic Kala Mandir material**
supplied by the institute via its Google Business Profile. Nothing is stock
photography presented as institute work, and no artist names or media are
invented.

### How the assets were produced

1. Original files were downloaded from the institute's own Google listing
   (`lh3.googleusercontent.com/gps-cs-s/…`).
2. Full-size variants were re-fetched by appending `=s1800` to the URL —
   Google serves the largest available resolution without any login or
   access workaround.
3. Each file was converted locally (ffmpeg) to **WebP (quality 82)** for
   modern browsers plus a **JPEG** fallback for older ones, stored in
   `public/assets/institute/`. The site never hotlinks Google's servers.

### Registry

`src/data/gallery.js` is the single registry: every image's `src`, `fallback`,
`alt`, `width`/`height`, `status` (`institute` / `placeholder`) and its
source. Captions describe only what is visibly in the frame — no names,
awards or techniques are claimed unless clearly visible.

`instituteSources` in the same file keeps the original Google URLs as a
provenance trail.

### Videos

The institute's dance videos are hosted on its **Google Business Profile**
and are only playable inside Google Maps (no public file URL exists, and the
listing has no YouTube channel). The site therefore links out honestly:

- "Watch class videos on Instagram" → the institute's official
  [`@kala_mandir_sec52`](https://www.instagram.com/kala_mandir_sec52/)
- "More videos on Google Maps" → the institute's Maps place page, where the
  listing videos live

If the client later supplies original video files, they can be optimised and
embedded in the dance section with a poster image.

## Accessibility & performance

- Semantic landmarks, labelled sections, keyboard-operable lightbox and
  filters, `:focus-visible` outlines everywhere.
- `prefers-reduced-motion` disables parallax, autoplay and reveal animations.
- Images carry intrinsic `width`/`height` (no layout shift) and use
  responsive `sizes`.
- Layout verified from 360 px to 1920 px with no horizontal overflow
  (`public/resp-qa.html?w=<width>` is a local QA harness, not deployed).

## Project layout

```
src/
  components/     # one file per section (Hero, ArtGallery, DanceShowcase, …)
  data/
    siteConfig.js # single source of truth for business facts
    gallery.js    # image registry + provenance
    classes.js    # class catalogue
  index.css       # design tokens + base layer
public/
  assets/institute/  # authentic WebP + JPEG media
  assets/fonts/      # self-hosted woff2
```
