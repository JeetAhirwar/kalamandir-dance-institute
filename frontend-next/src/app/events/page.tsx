import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem } from "@/lib/motion";
import { places, studio, artworks, poster } from "@/data/media";
import { Paisley } from "@/components/Motifs";

export const metadata: Metadata = {
  title: "Events & Performances",
  description:
    "Performances, festival classes and choreography work at Kala Mandir, Sector 52 Noida — and how to book the institute for your own event.",
};

/**
 * Events — honest structure: no invented dates or fabricated line-ups.
 * The page presents real performance material from the studio and the two
 * genuinely bookable event services.
 */
export default function EventsPage() {
  const moments = [
    { img: places.dandiya, caption: "Festive batch in full costume — dandiya formations, mirrors behind" },
    { img: places.kidsJump, caption: "Rehearsal break — the painted wall behind the players" },
    { img: places.classicalPose, caption: "A classical pose held for the camera, mid-session" },
    { img: places.danceDuoStill, caption: "Two performers, one routine, many counts" },
    { img: places.danceTrio, caption: "Trio practice, beats in sync" },
    { img: places.stretching, caption: "The floor before the floor opens" },
  ];

  const services = [
    {
      title: "Wedding choreography",
      kicker: "Sangeet · first dance · family medleys",
      body: "Routines shaped around your song, your people and your stage — from couple numbers to full family line-ups, rehearsed at the studio until they feel natural.",
    },
    {
      title: "Event & stage pieces",
      kicker: "Annual days · school shows · community programmes",
      body: "Group performances built for school annuals, society events and cultural programmes — formation and costume handled, nerves rehearsed away.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Events & performances"
        title="The stage is where practice pays out"
        standfirst="Festive batches, formation sets and choreographed performances — and a standing invitation to bring Kala Mandir to your stage."
        pillar="dance"
      />

      {/* Moments — real captioned photography, no invented dates */}
      <section aria-labelledby="moments-title" className="section bg-cream">
        <div className="shell">
          <SectionHeading
            id="moments-title"
            number="01"
            eyebrow="Performance moments"
            title={
              <>
                How the year <span className="italic text-golddeep">sounds</span> in pictures.
              </>
            }
            standfirst="Real photographs from classes and performances. The studio doesn't publish a fabricated calendar — upcoming sessions are confirmed directly on enquiry."
          />
          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moments.map((m, i) => (
              <RevealItem key={m.img.src} className={i === 0 ? "sm:col-span-2" : ""}>
                <figure className="group overflow-hidden rounded-[16px]" >
                  <SmartImage
                    image={m.img}
                    className={i === 0 ? "aspect-[16/9] w-full" : "aspect-[4/3] w-full"}
                    imgClassName="transition-transform duration-[850ms] ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                  <figcaption className="mt-3 text-[0.9rem] leading-snug text-muted">
                    {m.caption}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Booking services */}
      <section aria-labelledby="book-title" className="grain relative overflow-hidden bg-plum py-16 text-white lg:py-24">
        <Paisley className="pointer-events-none absolute -left-4 bottom-10 h-24 w-16 text-gold/20" aria-hidden="true" />
        <div className="shell relative">
          <SectionHeading
            id="book-title"
            number="02"
            eyebrow="Book the institute"
            tone="dark"
            title={
              <>
                Bring the studio to your <span className="italic text-gold">stage</span>.
              </>
            }
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <article className="relative overflow-hidden rounded-[18px] border border-white/15 bg-white/5 p-8">
                  <CalendarHeart className="h-5 w-5 text-gold" aria-hidden="true" />
                  <p className="eyebrow mt-5 text-gold">{s.kicker}</p>
                  <h3 className="mt-2 font-display text-[1.8rem] leading-tight text-white">{s.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.7] text-white/70">{s.body}</p>
                  <Link href="/admission" className="mt-6 inline-flex items-center gap-2 text-[0.93rem] font-medium text-gold transition-transform duration-200 hover:translate-x-1">
                    Start a booking enquiry
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Poster feature — the institute's own artwork-adjacent material */}
      <section aria-labelledby="poster-title" className="section bg-paper">
        <div className="shell grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[26rem] overflow-hidden rounded-[18px] shadow-[0_40px_80px_-50px_rgba(41,33,43,0.5)]">
              <SmartImage image={poster.classPoster} className="aspect-[3/4] w-full" />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink via-gold to-violet"
              />
            </div>
          </Reveal>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="poster-title"
              number="03"
              eyebrow="The institute's own poster"
              title={
                <>
                  Handmade notice, <span className="italic text-pink">studio-worn</span>.
                </>
              }
            />
            <Reveal delay={0.1} className="mt-5 space-y-4 text-[0.97rem] leading-[1.75] text-muted">
              <p>
                The studio still writes its notice by hand — the poster above
                hangs in the classroom it advertises. Ask about a class and the
                same information, updated, arrives in your chat instead.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="mt-8 flex flex-wrap gap-4">
              <Link href="/admission" className="btn-rose group">
                Enquire about the next batch
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <Link href="/contact" className="btn-outline">
                Talk to the studio
              </Link>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <div className="flex items-center gap-5 opacity-90">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artworks.twoDancers.fallback}
                  alt={artworks.twoDancers.alt}
                  width={112}
                  height={112}
                  loading="lazy"
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-white"
                  style={{ objectPosition: "50% 42%" }}
                />
                <p className="max-w-[22rem] text-[0.9rem] leading-relaxed text-muted">
                  Behind every event sits the art pillar too — this circular
                  canvas of two dancers hangs beside the notice board, painted
                  by a student of the institute.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
