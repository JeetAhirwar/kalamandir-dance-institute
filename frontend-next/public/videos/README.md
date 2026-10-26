# Hero video slot

`HeroCinematic` (`src/components/HeroCinematic.tsx`) shows full-screen video when a
file exists at:

```
public/videos/hero.mp4
```

The check happens **at build/dev-compile time** (`existsSync` in `src/app/page.tsx`,
a server component), not in the browser:

- **File present** → home hero plays it full-screen (autoplay · muted · looped ·
  poster shows first).
- **File absent** → hero renders the cinematic image treatment instead
  (Ken Burns + petals + ribbons) — no broken player either way.

### Dev-mode note

Next caches the compiled home module in dev, so adding/removing the file won't
flip the hero by itself. To see the change, recompile the page (touch
`src/app/page.tsx`) or restart `npm run dev`. Production builds re-evaluate the
check on every build, so it just works.

## Replace the placeholder clip

⚠️ The current `hero.mp4` is a **13 KB ffmpeg-generated test gradient** — it only
proves the wiring and is NOT institute content. Delete it or replace it with a
real recording owned by the institute:

- Download the original from the institute's **own** Instagram / Google Business
  Profile account, then save it here as `hero.mp4`.
- We never hotlink, scrape or fake video URLs.

Suggested spec: 1080p, 10–30 s, Muted-friendly, studio branding visible —
1080×1920 (vertical) or 1920×1080 both work (`object-cover` crops safely).
