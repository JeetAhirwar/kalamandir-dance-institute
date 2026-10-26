import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem, Parallax } from "@/lib/motion";
import { artworks, places, studio } from "@/data/media";
import { Lotus, Dots } from "@/components/Motifs";
import { Ribbon } from "@/components/Flair";

export const metadata: Metadata = {
  title: "Art Classes",
  description:
    "Art classes at Kala Mandir, Sector 52 Noida — drawing, painting and craft, taught from first pencil line to finished canvas and exhibited as student work.",
};

/**
 * Art — a dedicated page for the art pillar. Completely separate from
 * Dance: pink-and-white identity, gallery-style exhibits, no dance content.
 */
export default function ArtPage() {
  const disciplines = [
    {
      title: "Drawing",
      kicker: "Line · proportion · light",
      body:
        "Sketching, graphite studies and portrait drawing — the foundation course where every art student's hand is built. Students repeat the same subjects until proportion, shading and observation settle.",
      images: [artworks.birds, artworks.whiteCharcoal, artworks.papaya],
    },
    {
      title: "Painting",
      kicker: "Colour · surface · story",
      body:
        "Oil and acrylic work on canvas and paper — still life, figure studies and devotional themes. Advanced students paint from a live model at the easel, palette in hand.",
      images: [artworks.figure, artworks.saraswati, artworks.dancerMotion],
    },
    {
      title: "Craft",
      kicker: "Material · texture · relief",
      body:
        "Clay modelling, paper construction and mixed-material craft — material intelligence that teaches young hands patience and form in three dimensions.",
      images: [artworks.clay, studio.clayModelling, studio.craftSession],
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="The art pillar"
        title="From first pencil line to finished canvas"
        standfirst="Drawing, painting and craft, taught the slowly-good way — exhibited here exactly as the students left them, in a gallery the studio built for its own people."
        pillar="art"
      />

      {/* Disciplines — alternating exhibition rows */}
      <section aria-labelledby="disciplines-title" className="section bg-blossom">
        <div className="shell">
          <SectionHeading
            id="disciplines-title"
            number="01"
            eyebrow="What goes on the table"
            title={
              <>
                Three rooms of <span className="italic text-pink">practice</span>.
              </>
            }
            standfirst="Drawing first, painting second, craft alongside — every piece below is real student work from these classes."
          />

          <div className="mt-14 grid gap-14 lg:mt-20">
            {disciplines.map((d, i) => (
              <Reveal key={d.title}>
                <article className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                    <p className="eyebrow flex items-center gap-3 text-rose">
                      <span className="tabular-nums">0{i + 1}</span>
                      <span className="h-px w-7 bg-pink/60" aria-hidden="true" />
                      {d.kicker}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.9rem,3.8vw,2.9rem)] leading-[1.05] text-ink">
                      {d.title}
                    </h3>
                    <p className="mt-4 max-w-[32rem] text-[0.98rem] leading-[1.75] text-muted">
                      {d.body}
                    </p>
                    <Reveal delay={0.1} className="mt-6">
                      <Link href="/admission" className="rule-link text-[0.95rem] font-medium text-rose">
                        Ask about {d.title.toLowerCase()} classes
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Reveal>
                    <Dots className="mt-8 text-pink" />
                  </div>
                  <RevealGroup className="grid grid-cols-3 gap-3 sm:gap-4 lg:col-span-7">
                    {d.images.map((img, j) => (
                      <RevealItem
                        key={img.src}
                        className={j === 0 ? "col-span-3 lg:col-span-2" : "col-span-1"}
                      >
                        <div className="group relative overflow-hidden rounded-[14px]">
                          <SmartImage
                            image={img}
                            className={j === 0 ? "aspect-[16/10] w-full" : "aspect-[3/4] w-full"}
                            imgClassName="transition-transform duration-[850ms] ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
                          />
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Colour ribbon between disciplines and the wall */}
      <div aria-hidden="true">
        <Ribbon
          tone="gold"
          items={["Drawing", "Oil & acrylic", "Craft & clay", "Portrait sessions", "Madhubani detail"]}
          className="-rotate-[0.8deg] scale-[1.01]"
        />
      </div>

      {/* Studio wall — work in progress */}
      <section aria-labelledby="wall-title" className="section border-t border-rule bg-paper">
        <div className="shell">
          <SectionHeading
            id="wall-title"
            number="02"
            eyebrow="The studio wall"
            title={
              <>
                Work, hung the way a <span className="italic text-pink">gallery</span> hangs it.
              </>
            }
            standfirst="Finished paintings go up in the studio so students see progress framed — not deleted. A selection is shown below; the full set lives on the Gallery page."
          />
          <RevealGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {[
              artworks.madhubani,
              artworks.lamp,
              artworks.seatedFigure,
              artworks.krishna,
              artworks.twoDancers,
              artworks.easel,
              artworks.twoFigures,
              studio.pandaPastel,
              studio.floralPortrait,
              studio.dancePaintingEasel,
            ].map((img) => (
              <RevealItem key={img.src}>
                <div className="glow-hover overflow-hidden rounded-[12px]">
                  <SmartImage
                    image={img}
                    className="aspect-[3/4] w-full rounded-[12px]"
                    imgClassName="transition-transform duration-[700ms] ease-out hover:scale-[1.04] motion-reduce:transform-none"
                  />
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 flex flex-wrap gap-4">
            <Link href="/gallery" className="btn-rose group">
              Full exhibition
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link href="/admission" className="btn-outline">
              Enrol in art classes
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Live session band */}
      <section aria-label="A class in session" className="relative overflow-hidden bg-blush">
        <div className="grid lg:grid-cols-2">
          <Parallax distance={12} className="relative min-h-[22rem] lg:min-h-[36rem]">
            <SmartImage image={places.portraitSession} className="absolute inset-0 h-full w-full" pos="50% 35%" />
          </Parallax>
          <div className="flex flex-col justify-center py-16 lg:py-0">
            <div className="px-7 lg:px-16">
              <Reveal>
                <Lotus className="h-7 w-12 text-rose/60" aria-hidden="true" />
                <p className="eyebrow mt-6 text-rose">Twice a week, every week</p>
                <p className="mt-4 max-w-[26rem] font-display text-[clamp(1.7rem,3vw,2.4rem)] leading-[1.1] text-ink">
                  &ldquo;The same subjects, repeated until they change.&rdquo;
                </p>
                <p className="mt-5 max-w-[28rem] text-[0.97rem] leading-[1.7] text-muted">
                  Live portrait sessions sit at the top of the art ladder — the
                  seated model above is a real class exercise, not a
                  demonstration painting.
                </p>
                <div className="mt-8">
                  <Link href="/gallery" className="rule-link text-[0.95rem] font-medium text-rose">
                    See more from the class floor
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
