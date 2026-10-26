import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Music4, Users, Sparkles, HeartHandshake } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem, Parallax } from "@/lib/motion";
import { places, artworks, studio } from "@/data/media";
import { instagramReels } from "@/data/videos";
import ReelEmbed from "@/components/ReelEmbed";
import { Ribbon } from "@/components/Flair";

export const metadata: Metadata = {
  title: "Dance Classes",
  description:
    "Dance classes at Kala Mandir, Sector 52 Noida — age-group training, classical and folk repertoire, Zumba fitness and wedding & event choreography.",
};

/**
 * Dance — a dedicated page. No art content appears here; every discipline
 * shown is evidenced by real studio photography or the institute's own reels.
 */
const STYLES = [
  {
    title: "Classical technique",
    kicker: "Adavus, mudras, posture",
    body:
      "Students drill the classical vocabulary — controlled posture, gestures and rhythm counts — building the discipline that every other style borrows from. Evidenced in the studio's classical portraits and stage poses.",
    image: places.classicalPose,
    pos: "50% 25%",
  },
  {
    title: "Folk & festive",
    kicker: "Dandiya, garba & seasonal sets",
    body:
      "Group routines for Navratri and the festive season — formation dancing, stick work and costuming, straight out of the studio's annual festival classes.",
    image: places.dandiya,
  },
  {
    title: "Choreography & performance",
    kicker: "Made for the moment",
    body:
      "Wedding numbers, event sets and solo pieces shaped around songs and stages — rehearsed until the count disappears and the performance begins.",
    image: places.danceDuoFull,
  },
  {
    title: "Zumba fitness",
    kicker: "Rhythm as workout",
    body:
      "Music-led sessions where fitness arrives as a side effect of moving well — open to beginners, no dance background required.",
    image: places.stretching,
  },
];

export default function DancePage() {
  const highlights = [
    { icon: Users, title: "Different age groups", body: "Classes are grouped so beginners, children and adults each work at a pace that suits them." },
    { icon: Music4, title: "Zumba", body: "Music-led sessions where fitness arrives as a side effect of moving well." },
    { icon: Sparkles, title: "Classical & folk", body: "Posture, gestures, formations and festive sets — both pillars of the repertoire." },
    { icon: HeartHandshake, title: "Choreography", body: "Wedding and event routines built around your song, your people and your stage." },
  ];

  return (
    <>
      <PageHero
        eyebrow="The dance pillar"
        title="Every count, rehearsed until it disappears"
        standfirst="Classical drills, folk formations, Zumba energy and stage choreography — taught on a mirrored floor in Sector 52 and performed wherever courage gathers."
        pillar="dance"
      />

      {/* Styles — alternating composition */}
      <section aria-labelledby="styles-title" className="section bg-cream">
        <div className="shell">
          <SectionHeading
            id="styles-title"
            number="01"
            eyebrow="What goes on the floor"
            title={
              <>
                Four strands of <span className="italic text-golddeep">movement</span>.
              </>
            }
            standfirst="Each strand is a real class running at the institute — not a brochure invention. Where you see it here, you can see it on the studio floor."
          />

          <div className="mt-14 grid gap-10 lg:mt-20 lg:gap-16">
            {STYLES.map((style, i) => (
              <Reveal key={style.title}>
                <article className="grid items-center gap-6 lg:grid-cols-12 lg:gap-10">
                  <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <Parallax distance={i % 2 === 0 ? 10 : -10}>
                      <SmartImage
                        image={style.image}
                        className={
                          i === 0 || i === 2
                            ? "aspect-[3/4] w-full max-w-[30rem] rounded-[18px]"
                            : "aspect-[4/3] w-full rounded-[18px]"
                        }
                      />
                    </Parallax>
                  </div>
                  <div className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <p className="eyebrow flex items-center gap-3 text-golddeep">
                      <span className="tabular-nums">0{i + 1}</span>
                      <span className="h-px w-7 bg-gold/60" aria-hidden="true" />
                      {style.kicker}
                    </p>
                    <h3 className="mt-3 max-w-[18ch] font-display text-[clamp(1.8rem,3.6vw,2.7rem)] leading-[1.06] text-plum">
                      {style.title}
                    </h3>
                    <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-[1.75] text-muted">
                      {style.body}
                    </p>
                    <Reveal delay={0.1} className="mt-6">
                      <Link href="/admission" className="rule-link text-[0.95rem] font-medium text-golddeep">
                        Ask about {style.title.toLowerCase()} classes
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Reveal>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Colour ribbon between strands and videos */}
      <div aria-hidden="true">
        <Ribbon
          tone="pink"
          items={["Classical technique", "Dandiya nights", "Zumba fitness", "Wedding medleys", "Annual-day sets"]}
          className="-rotate-[0.8deg] scale-[1.01]"
        />
      </div>

      {/* Videos — the institute's own reels */}
      <section id="videos" aria-labelledby="dance-videos" className="grain relative overflow-hidden bg-plum py-16 text-white lg:py-24">
        <div className="shell relative">
          <SectionHeading
            id="dance-videos"
            number="02"
            eyebrow="Class videos"
            tone="dark"
            title={
              <>
                Watch the floor <span className="italic text-gold">work</span>.
              </>
            }
            standfirst="Real reels filmed in the studio by the institute — embedded from Instagram, the way they publish them."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {instagramReels.slice(0, 6).map((code, i) => (
              <ReelEmbed key={code} shortcode={code} index={i} />
            ))}
          </div>
          <p className="mt-10 text-[0.9rem] leading-relaxed text-white/55">
            More reels on{" "}
            <Link
              href="https://www.instagram.com/kala_mandir_sec52/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              @kala_mandir_sec52
            </Link>{" "}
            — and additional listing videos on{" "}
            <a
              href="https://www.google.com/maps/place/Kala+Mandir+Art+and+Dance+Institute/@28.5866938,77.3703023,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline-offset-4 hover:underline"
            >
              Google Maps
            </a>
            .
          </p>
        </div>
      </section>

      {/* Highlights rows */}
      <section aria-labelledby="dance-highlights" className="section bg-paper">
        <div className="shell">
          <SectionHeading
            id="dance-highlights"
            number="03"
            eyebrow="How the classes run"
            title={
              <>
                Practice as a <span className="italic text-plum2">craft</span>.
              </>
            }
          />
          <RevealGroup className="mt-12 grid grid-cols-1 gap-x-10 lg:grid-cols-3">
            {highlights.map(({ icon: Icon, title, body }, i) => (
              <RevealItem key={title} className="border-t border-rule py-7">
                <div className="flex items-start gap-4">
                  <span className="eyebrow mt-1 tabular-nums text-ink/35">0{i + 1}</span>
                  <div>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-golddeep" aria-hidden="true" />
                      <h3 className="font-display text-[1.4rem] leading-tight text-ink">{title}</h3>
                    </div>
                    <p className="mt-2.5 text-[0.94rem] leading-[1.65] text-muted">{body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href="/admission" className="btn-rose group">
              Enrol in a dance batch
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link href="/courses" className="btn-outline">
              Full course list
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
