# Kala Mandir — Multi-Page Website (Next.js)

Premium **multi-page** site for Kala Mandir Art and Dance Institute, Sector 52, Noida.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion 12.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home — cinematic hero (video-ready), two-pillar showcase, programme ledger, class reels |
| `/about` | Story · vision · mission · philosophy (no invented dates/awards) |
| `/dance` | Dedicated dance pillar — classical, folk & festive, choreography, Zumba + real reels |
| `/art` | Dedicated art pillar — drawing, painting, craft + studio wall (pink & white world) |
| `/courses` | Full catalogue; **fees/timings deliberately quoted on enquiry** (not invented) |
| `/gallery` | Tabs: Dance performances / Art exhibitions / Class videos |
| `/events` | Real performance moments + bookable event services (no fabricated calendar) |
| `/faculty` | Founder (as publicly stated on the institute's bio) + teaching method |
| `/contact` | WhatsApp-backed form, verified phones, embedded map |
| `/admission` | Enrollment enquiry — deep-links into WhatsApp with a pre-filled message |

Plus a custom 404 (`/does-not-exist`).

## Commands

```bash
npm install
npm run dev      # http://localhost:5200
npm run build    # static prerender of all routes
npm run start
```

## Design system

Two cultural pillars, one paper ground — tokens in `src/app/globals.css`:

- **Art** → blush/blossom pinks + deep rose (`bg-blossom`, `bg-pink`, `text-rose`)
- **Dance** → deep plum stage + marigold gold (`bg-plum`, `text-gold`, `btn-gold`)
- Display face: DM Serif Display (italic accents); body: Inter — both **self-hosted** in
  `public/assets/fonts/` (zero font CDN requests)

### Motion (Framer Motion)

- Page transitions via `app/template.tsx` (enter fade+rise+de-blur on every navigation)
- `lib/motion.tsx` — `Reveal`, `RevealGroup`, `TextReveal` (word clip reveal), `Parallax`
- `Flair.tsx` — rotating `Mandala`, drifting `Petals`, slanted scrolling `Ribbon` bands, `Scribble`
- `ScrollProgress` gradient bar; all motion honours `prefers-reduced-motion`

### Video

- Red carpet: drop a real recording at **`public/videos/hero.mp4`** → the home hero switches
  to autoplay/muted/loop video automatically. Until then it renders the cinematic image
  treatment (footage is never faked or hotlinked).
- Class reels are the institute's **official Instagram embeds** (`instagramReels` in
  `src/data/videos.ts`); extra listing videos link out to Google Maps.

## Content honesty

- All photographs/artwork are authentic institute material (Google Business Profile), stored
  in `public/assets/institute/`; the registry with alt text + dimensions is
  `src/data/media.ts`.
- No fees, schedules, teacher rosters, awards, dates or testimonials are published — none
  were verified. `src/data/site.ts` holds every confirmed business fact.

## Accessibility

Landmarks + labelled sections, focus-visible outlines, keyboard-safe tabs/menu, reduced-motion
fallbacks, intrinsic image dimensions (no layout shift), and responsive checks from 360 px
upwards with no horizontal overflow.
