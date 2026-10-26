"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import HeroCinematic from "@/components/HeroCinematic";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem, TextReveal, Parallax } from "@/lib/motion";
import { programmes } from "@/data/programmes";
import { places, studio, artworks } from "@/data/media";
import { instagramReels } from "@/data/videos";
import ReelEmbed from "@/components/ReelEmbed";
import { Dots, Paisley } from "@/components/Motifs";
import { Ribbon } from "@/components/Flair";
import { cn } from "@/lib/utils";

/**
 * Home — the cinematic front door.
 * Hero (video-ready) → the two pillars (Dance / Art, kept distinct) →
 * programme marquee → studio-life ledger → class-reel strip → closing CTA.
 */
export default function HomePage() {
  return (
    <>
      <HeroCinematic />

      {/* Programme marquee — slanted colour ribbons */}
      <div aria-hidden="true" className="relative">
        <Ribbon
          tone="gold"
          items={["Dance · age-group classes", "Art · drawing & sketching", "Painting · oil & acrylic", "Craft · clay & paper", "Zumba · dance fitness"]}
          className="-rotate-[1.2deg] scale-[1.02] shadow-[0_16px_40px_-24px_rgba(190,24,93,0.4)]"
        />
        <Ribbon
          tone="pink"
          items={["Wedding choreography", "Classical & folk repertoire", "Madhubani & multidisciplinary detail work", "Portrait sessions", "Dandiya nights"]}
          className="-mt-2 -rotate-[0.6deg] opacity-90"
        />
      </div>

      {/* ── The two pillars ─────────────────────────────────────────── */}
      <section aria-labelledby="pillars-title" className="section bg-paper">
        <div className="shell">
          <SectionHeading
            id="pillars-title"
            number="01"
            eyebrow="Two pillars, one institute"
            title={
              <>
                Dance that fills a stage; art that fills a{" "}
                <span className="italic text-pink">wall</span>.
              </>
            }
            standfirst="They are taught as separate disciplines with separate pages — click through and each has its own world."
            align="center"
          />

          <RevealGroup className="mt-14 grid grid-cols-1 gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
            {/* Dance pillar card */}
            <RevealItem>
              <Link
                href="/dance"
                className="glow-hover group relative block overflow-hidden rounded-[20px] bg-plum text-white"
              >
                <div className="relative">
                  <SmartImage
                    image={places.dandiya}
                    className="aspect-[4/3] w-full"
                    imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(44,16,48,0.92)_0%,rgba(44,16,48,0.35)_55%,transparent_100%)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="eyebrow text-gold">The dance pillar</p>
                  <p className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight">
                    Movement for every age
                  </p>
                  <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-white/75">
                    Age-group classes, classical and folk vocabulary, Zumba
                    fitness and stage choreography — with reels straight from
                    the studio floor.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-gold transition-transform duration-300 group-hover:translate-x-1">
                    Enter the dance studio
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </RevealItem>

            {/* Art pillar card */}
            <RevealItem>
              <Link
                href="/art"
                className="glow-hover group relative block overflow-hidden rounded-[20px] bg-blossom text-ink"
              >
                <div className="relative">
                  <SmartImage
                    image={artworks.figure}
                    className="aspect-[4/3] w-full"
                    imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,rgba(190,24,93,0.35)_0%,transparent_60%)]" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
                  <p className="eyebrow text-rose">The art pillar</p>
                  <p className="mt-3 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-tight text-white">
                    From first pencil line to canvas
                  </p>
                  <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-white/85">
                    Drawing, painting and craft, taught the slowly-good way —
                    and exhibited here exactly as the students left them.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-white transition-transform duration-300 group-hover:translate-x-1">
                    Enter the gallery
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* ── Programmes ledger ────────────────────────────────────────── */}
      <section aria-labelledby="programmes-title" className="section border-t border-rule bg-cream">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                id="programmes-title"
                number="02"
                eyebrow="What we teach"
                title={
                  <>
                    Five ways to make{" "}
                    <span className="italic text-pink">something</span>.
                  </>
                }
                standfirst="Every class starts from observation and practice. No experience is assumed — only the willingness to begin."
              >
                <Dots className="mt-7 text-pink" />
                <Reveal delay={0.1} className="mt-8">
                  <Link href="/courses" className="btn-rose group">
                    Full course list
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                </Reveal>
              </SectionHeading>
            </div>

            <RevealGroup className="flex flex-col lg:col-span-7 lg:col-start-6">
              {programmes.map((programme) => (
                <RevealItem key={programme.id} className="border-t border-rule first:border-t-0 first:border-t" >
                  <Link
                    href={programme.route}
                    className="group flex items-center gap-5 py-6"
                  >
                    <span
                      className={cn(
                        "eyebrow w-10 shrink-0 tabular-nums",
                        programme.pillar === "art" ? "text-rose" : "text-golddeep",
                      )}
                    >
                      {String(programmes.indexOf(programme) + 1).padStart(2, "0")}
                    </span>
                    <SmartImage
                      image={programme.image}
                      className="hidden h-16 w-20 shrink-0 overflow-hidden rounded-[10px] sm:block"
                      pos="50% 40%"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "eyebrow",
                          programme.pillar === "art" ? "text-rose" : "text-golddeep",
                        )}
                      >
                        {programme.kicker}
                      </p>
                      <h3 className="mt-1.5 font-display text-[1.55rem] leading-tight text-ink transition-colors duration-200 group-hover:text-pink sm:text-[1.8rem]">
                        {programme.title}
                      </h3>
                    </div>
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-rule text-ink/60 transition-all duration-300 group-hover:border-rose group-hover:bg-rose group-hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      {/* ── Studio life band (parallax imagery) ──────────────────────── */}
      <section aria-label="Life at the studio" className="border-t border-rule bg-paper py-16 lg:py-24">
        <div className="shell">
          <div className="grid grid-cols-12 gap-4 sm:gap-5">
            <Parallax distance={14} className="col-span-7 sm:col-span-5">
              <SmartImage
                image={places.artClass}
                className="aspect-[4/3] w-full rounded-[16px]"
              />
            </Parallax>
            <Parallax distance={-20} className="col-span-5 sm:col-span-4">
              <SmartImage
                image={places.danceClassWide}
                className="aspect-[4/3] w-full rounded-[16px]"
              />
            </Parallax>
            <Parallax distance={26} className="col-span-12 hidden sm:col-span-3 sm:block">
              <SmartImage
                image={studio.craftSession}
                className="aspect-square w-full rounded-[16px]"
              />
            </Parallax>
          </div>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-10 max-w-[42rem] text-center font-display text-[1.4rem] leading-snug text-ink/85 sm:text-[1.65rem]">
              Mirrors, easels, paint tables and a stage’s worth of courage —
              all inside C-39, Sector 52.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Reels strip — real class videos ──────────────────────────── */}
      <section aria-labelledby="reels-title" className="grain relative overflow-hidden border-t border-rule bg-plum py-16 text-white lg:py-24">
        <Paisley className="pointer-events-none absolute -left-4 top-10 h-20 w-14 text-gold/20" aria-hidden="true" />
        <div className="shell relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              id="reels-title"
              number="03"
              eyebrow="Straight from class"
              tone="dark"
              title={
                <>
                  The studio, in <span className="italic text-gold">motion</span>.
                </>
              }
              standfirst="Real class reels from the institute’s own Instagram — embedded, never downloaded or re-uploaded."
            />
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-2 rounded-[11px] border border-white/25 px-5 py-3 text-[0.9rem] text-white transition-colors hover:border-gold hover:text-gold"
            >
              Full gallery
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instagramReels.slice(0, 3).map((code, i) => (
              <ReelEmbed key={code} shortcode={code} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────── */}
      <section aria-label="Enrol" className="section bg-blossom">
        <div className="shell text-center">
          <Reveal>
            <p className="eyebrow text-rose">New faces welcome</p>
            <h2 className="mx-auto mt-4 max-w-[20ch] font-display text-[clamp(2.2rem,5.5vw,4rem)] leading-[1.04]">
              Your first class is a <span className="italic text-pink">conversation</span> away.
            </h2>
            <p className="mx-auto mt-5 max-w-[32rem] text-[1rem] leading-relaxed text-muted">
              Send one message and we will find the right batch — for the
              dancer, the painter or the not-yet-sure.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/admission" className="btn-rose group">
                Enrol / Enquire
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Visit the studio page
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
