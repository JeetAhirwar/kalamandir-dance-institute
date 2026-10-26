import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Sparkles, Users } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal } from "@/lib/motion";
import { places, studio, artworks } from "@/data/media";

export const metadata: Metadata = {
  title: "Faculty",
  description:
    "The teaching team at Kala Mandir Art and Dance Institute, Sector 52 Noida — led by its founder, with a small, hands-on faculty across art and dance.",
};

/**
 * Faculty — honest by design.
 *
 * The institute's public bio names one founder; no other teacher names or
 * qualification claims are published because none were supplied. The page
 * therefore introduces the founder (what her own public profile states) and
 * describes the teaching team's working method, with slots clearly marked
 * where the institute can add verified profiles later.
 */
export default function FacultyPage() {
  return (
    <>
      <PageHero
        eyebrow="Faculty"
        title="Taught close, not from a distance"
        standfirst="A small teaching team where every student is seen in every session — introduction by method, since qualifications only matter when they meet the room."
        pillar="neutral"
      />

      {/* Founder */}
      <section aria-labelledby="founder-title" className="section bg-cream">
        <div className="shell grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="overflow-hidden rounded-[20px]">
                <SmartImage
                  image={places.danceDuo}
                  className="aspect-[16/11] w-full rounded-[20px]"
                  pos="50% 40%"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 w-[42%] max-w-[11rem] overflow-hidden rounded-[14px] border-4 border-cream shadow-[0_24px_50px_-30px_rgba(41,33,43,0.5)]">
                <SmartImage image={artworks.dancerMotion} className="aspect-[4/5] w-full" pos="50% 35%" />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="founder-title"
              number="01"
              eyebrow="Founder"
              title={
                <>
                  Puja <span className="italic text-rose">Mittal</span>.
                </>
              }
              standfirst="Founder of Kala Mandir Art and Dance Institute, Sector 52."
            />
            <Reveal delay={0.1} className="mt-6 space-y-4 text-[0.98rem] leading-[1.75] text-ink/85">
              <p>
                Puja Mittal founded Kala Mandir as a neighbourhood institute
                where art and dance carry equal weight — the two pillars the
                whole studio is organised around today. She leads the dance
                side: age-group classes through to wedding and event
                choreography.
              </p>
              <p>
                What her teaching is known for, inside the studio, is patient
                correction and repertoire built from what the room can do —
                classical drills for students who want the discipline, festive
                formations for the ones who want the energy.
              </p>
              <p className="text-[0.9rem] text-muted">
                More of her work as it is actually published:{" "}
                <a
                  href="https://www.instagram.com/kala_mandir_sec52/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-rose underline-offset-4 hover:underline"
                >
                  @kala_mandir_sec52
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Teaching method */}
      <section aria-labelledby="method-title" className="section border-t border-rule bg-blossom">
        <div className="shell">
          <SectionHeading
            id="method-title"
            number="02"
            eyebrow="The teaching team"
            title={
              <>
                How every session is <span className="italic text-pink">held</span>.
              </>
            }
            standfirst="Rather than a wall of borrowed bios, here is the method that runs the room — the parts you will actually experience."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Every student, every session",
                body: "Batches stay small enough that corrections are personal. Instructors work beside students — at the barre, on the floor, at the table.",
              },
              {
                icon: GraduationCap,
                title: "Foundations before flair",
                body: "Posture first, pencil grip first, rhythm counts first. Advanced work is unlocked in layers, at the student's pace.",
              },
              {
                icon: Sparkles,
                title: "Two pillars, one standard",
                body: "Dance and art teachers rehearse the same philosophy: demonstrate honestly, correct kindly, exhibit the real work.",
              },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 0.08}>
                <article className="relative h-full overflow-hidden rounded-[18px] border border-rule bg-white p-8">
                  <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${i === 0 ? "bg-pink" : i === 1 ? "bg-rose" : "bg-gold"}`} />
                  <card.icon className="h-5 w-5 text-rose" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-[1.45rem] leading-tight text-ink">{card.title}</h3>
                  <p className="mt-3 text-[0.94rem] leading-[1.7] text-muted">{card.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Honest slots note */}
          <Reveal delay={0.15} className="mx-auto mt-12 max-w-[44rem] rounded-[16px] border border-dashed border-rose/40 bg-white/70 p-6 text-center">
            <p className="text-[0.92rem] leading-relaxed text-muted">
              <span className="font-medium text-ink">For the institute:</span> when
              additional verified teacher profiles (names, disciplines,
              photographs) are approved, they slot into this page without any
              layout change — the cards above describe the method, this band
              reserves the space.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Studio proof */}
      <section aria-label="In the room" className="border-t border-rule bg-cream py-16 lg:py-24">
        <div className="shell grid gap-4 sm:grid-cols-3">
          <Reveal>
            <SmartImage image={places.artClass} className="aspect-[4/3] w-full rounded-[16px]" />
          </Reveal>
          <Reveal delay={0.08}>
            <SmartImage image={studio.craftSession} className="aspect-[4/3] w-full rounded-[16px]" />
          </Reveal>
          <Reveal delay={0.16}>
            <SmartImage image={places.danceClassWide} className="aspect-[4/3] w-full rounded-[16px]" />
          </Reveal>
        </div>
        <Reveal>
          <p className="shell mx-auto mt-10 max-w-[40rem] text-center font-display text-[1.4rem] leading-snug text-ink/85 sm:text-[1.55rem]">
            Correction happens in the room, live — the photographs above are
            ordinary days at the institute.
          </p>
        </Reveal>
        <div className="mt-10 text-center">
          <Link href="/admission" className="btn-rose group inline-flex">
            Come meet the team
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
