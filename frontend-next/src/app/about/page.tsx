import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem } from "@/lib/motion";
import { studio, places, artworks } from "@/data/media";
import { siteConfig } from "@/data/site";
import { Lotus, Paisley } from "@/components/Motifs";

export const metadata: Metadata = {
  title: "About Us",
  description: `Meet ${siteConfig.name} — a neighbourhood studio in Sector 52, Noida, and the thinking behind how art and dance are taught here.`,
};

/**
 * About — honest by design: no founding dates, awards or enrollment
 * figures are published because none were supplied. History is told the
 * way it can be verified: the space, the disciplines and the people.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About the institute"
        title="The studio on the corner of C-39"
        standfirst="Kala Mandir is a neighbourhood art and dance institute in Sector 52, Noida — two pillars under one roof, taught one person at a time."
        pillar="neutral"
      />

      {/* The story — verifiable, no invented dates */}
      <section aria-labelledby="story-title" className="section bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              id="story-title"
              number="01"
              eyebrow="The story"
              title={
                <>
                  A room, a roster of <span className="italic text-rose">real</span> work,
                  and the phone always on.
                </>
              }
            />
            <Reveal delay={0.1} className="mt-6 space-y-5 text-[1rem] leading-[1.75] text-ink/85">
              <p>
                Kala Mandir runs from a modest studio — a mirrored dance floor
                on one side, paint-splattered tables and an artwork wall on the
                other. What began as local classes has grown into the
                institute&apos;s two clear pillars: <strong>dance</strong> (age-group
                classes, Zumba, choreography) and <strong>art</strong> (drawing,
                painting, craft).
              </p>
              <p>
                The studio posts its real classes, real work and real reels
                online — what you see on this site is exactly that material:
                actual students, actual artwork, nothing staged for the
                camera.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-4">
              <Link href="/dance" className="btn-rose group">
                Our dance programmes
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link href="/art" className="btn-outline">
                Our art programmes
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <SmartImage image={studio.groupWithWork} className="col-span-2 aspect-[16/10] w-full rounded-[16px]" />
              <SmartImage image={places.artClass} className="aspect-square w-full rounded-[16px]" />
              <SmartImage image={artworks.twoDancers} className="aspect-square w-full rounded-[16px]" pos="50% 45%" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Vision / mission / philosophy cards */}
      <section aria-labelledby="vmp-title" className="section border-t border-rule bg-blossom">
        <div className="shell">
          <SectionHeading
            id="vmp-title"
            number="02"
            eyebrow="Vision · Mission · Philosophy"
            title={
              <>
                Why the studio teaches the way it{" "}
                <span className="italic text-pink">does</span>.
              </>
            }
            standfirst="Written plainly, like the teaching itself — aspirational wording only where it reflects real practice, never as advertising claims."
            align="center"
          />
          <RevealGroup className="mt-14 grid gap-6 lg:mt-18 lg:grid-cols-3 lg:gap-8">
            {[
              {
                title: "Vision",
                kicker: "What the studio works towards",
                body:
                  "A neighbourhood where children and adults think of art and dance not as a special occasion but as a normal part of the week — where a Sector 52 rooftop can grow a dancer, and a school desk can grow a painter.",
                tint: "bg-pink",
              },
              {
                title: "Mission",
                kicker: "What the institute commits to",
                body:
                  "Small, personal batches; honest progression; and a safe, uncluttered space. The studio teaches the foundation layers first — posture and pencil grip before platforms and exhibitions — and keeps feedback direct.",
                tint: "bg-rose",
              },
              {
                title: "Philosophy",
                kicker: "How every class is held",
                body:
                  "Craft over shortcuts, patience over pressure. Every student works in front of a teacher, twice weekly, on the same subjects until they change — the reel-ready moment comes as a side effect of steady practice.",
                tint: "bg-golddeep",
              },
            ].map((card) => (
              <RevealItem key={card.title}>
                <article className="relative h-full overflow-hidden rounded-[18px] border border-rule bg-white p-8">
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${card.tint}`} />
                  <Lotus className="h-6 w-11 text-pink/50" aria-hidden="true" />
                  <p className="eyebrow mt-5 text-muted">{card.kicker}</p>
                  <h3 className="mt-2 font-display text-[1.85rem] leading-tight text-ink">{card.title}</h3>
                  <p className="mt-4 text-[0.96rem] leading-[1.7] text-muted">{card.body}</p>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Values strip */}
      <section aria-label="How classes feel" className="grain relative overflow-hidden bg-plum py-16 text-white lg:py-24">
        <Paisley className="pointer-events-none absolute -right-2 top-10 h-20 w-14 text-gold/25" aria-hidden="true" />
        <div className="shell relative">
          <Reveal>
            <h2 id="values-title" className="max-w-[26ch] font-display text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1]">
              Practice here looks ordinary on purpose —{" "}
              <span className="italic text-gold">that is what makes the stage easy</span>.
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Mirrors, not phones", "Correction happens live, in the room — the reel records the result."],
              ["One wall for the work", "Finished paintings go up; students see progress framed, not deleted."],
              ["Age-honest batches", "Beginners, children and adults each move at a pace that suits them."],
              ["Two pillars, one family", "Dancing siblings and painting siblings share the building, not the syllabus."],
              ["Bilingual teaching", "Instruction in Hindi and English, whichever the room decides that day."],
              ["Festive calendars", "Dandiya and seasonal sessions keep energy high through the year."],
            ].map(([title, body]) => (
              <RevealItem key={title} className="border-t border-white/15 py-6">
                <h3 className="flex items-center gap-3 font-display text-[1.3rem]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {title}
                </h3>
                <p className="mt-2 text-[0.93rem] leading-relaxed text-white/65">{body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Next steps */}
      <section aria-label="Next steps" className="section bg-cream">
        <div className="shell flex flex-col items-center gap-8 text-center">
          <Reveal>
            <p className="eyebrow text-rose">See it for yourself</p>
            <h2 className="mt-4 max-w-[18ch] font-display text-[clamp(2rem,4.6vw,3.2rem)] leading-[1.08]">
              The gallery tells the rest of the story.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/gallery" className="btn-rose group">
                Open the gallery
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link href="/faculty" className="btn-outline">
                Meet the faculty
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
