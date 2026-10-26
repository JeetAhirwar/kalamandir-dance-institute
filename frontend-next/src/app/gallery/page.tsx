"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Images, Clapperboard, HeartHandshake, Palette } from "lucide-react";
import PageHero from "@/components/PageHero";
import SmartImage from "@/components/SmartImage";
import { Reveal } from "@/lib/motion";
import { artworks, places, studio } from "@/data/media";
import { instagramReels } from "@/data/videos";
import ReelEmbed from "@/components/ReelEmbed";
import { cn } from "@/lib/utils";

export default function GalleryPage() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<"dance" | "art" | "videos">("dance");

  const danceShots = [
    places.dandiya, places.danceTrio, places.danceDuo, places.danceClassWide,
    places.classicalPose, places.danceDuoStill, places.danceDuoFull, places.stretching,
    studio.warmUp,
  ];
  const artShots = [
    artworks.figure, artworks.saraswati, artworks.madhubani, artworks.birds,
    artworks.whiteCharcoal, artworks.clay, artworks.krishna, artworks.twoDancers,
    places.paintingsHeld, places.kidsDrawing, places.artClass, studio.pandaPastel,
    studio.floralPortrait, studio.dancePaintingEasel, places.portraitSession,
  ];

  const shots = tab === "dance" ? danceShots : artShots;

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Everything real, nothing staged"
        standfirst="Photographs and reels of actual Kala Mandir students, classes and artwork — the institute's own material, published the way they publish it."
      />

      {/* Tab switcher */}
      <div className="sticky top-16 z-30 border-b border-rule bg-paper/90 backdrop-blur-md lg:top-[4.5rem]">
        <div className="shell flex gap-2 py-3" role="tablist" aria-label="Gallery sections">
          {(
            [
              { id: "dance", label: "Dance performances", icon: HeartHandshake, accent: "bg-plum text-white" },
              { id: "art", label: "Art exhibitions", icon: Palette, accent: "bg-rose text-white" },
              { id: "videos", label: "Class videos", icon: Clapperboard, accent: "bg-ink text-white" },
            ] as const
          ).map(({ id, label, icon: Icon, accent }) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-rule px-4 py-2 text-[0.88rem] transition-all duration-200",
                tab === id ? `${accent} border-transparent` : "bg-transparent text-muted hover:bg-blossom hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panels — keyed mount-in transitions (enter-only; no blocked waits) */}
      <section className="section pt-10">
        <motion.div
          key={tab}
          initial={reduce ? undefined : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
        >
            {tab === "videos" ? (
              <div className="shell">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {instagramReels.map((code, i) => (
                    <ReelEmbed key={code} shortcode={code} index={i} />
                  ))}
                </div>
                <p className="mt-10 text-[0.9rem] leading-relaxed text-muted">
                  Every reel belongs to the institute&apos;s own account —{" "}
                  <a
                    href="https://www.instagram.com/kala_mandir_sec52/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-rose underline-offset-4 hover:underline"
                  >
                    @kala_mandir_sec52
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  . Additional listing videos live on{" "}
                  <a
                    href="https://www.google.com/maps/place/Kala+Mandir+Art+and+Dance+Institute/@28.5866938,77.3703023,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-rose underline-offset-4 hover:underline"
                  >
                    Google Maps
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                  .
                </p>
              </div>
            ) : (
              <div className="shell">
                {/* Masonry-ish wall */}
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 lg:gap-5">
                  {shots.map((img, i) => (
                    <motion.figure
                      key={img.src}
                      initial={reduce ? undefined : { opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, delay: (i % 3) * 0.07 }}
                      className="group mb-4 break-inside-avoid lg:mb-5"
                    >
                      <div className="overflow-hidden rounded-[14px]">
                        <SmartImage
                          image={img}
                          className={
                            i % 4 === 0
                              ? "aspect-[4/5] w-full"
                              : i % 4 === 1
                                ? "aspect-square w-full"
                                : i % 4 === 2
                                  ? "aspect-[4/3] w-full"
                                  : "aspect-[3/4] w-full"
                          }
                          imgClassName="transition-transform duration-[800ms] ease-out group-hover:scale-[1.045] motion-reduce:transform-none"
                        />
                      </div>
                    </motion.figure>
                  ))}
                </div>
                <Reveal>
                  <p className="mt-10 flex items-start gap-2.5 text-[14px] leading-relaxed text-muted">
                    <Images className="mt-0.5 h-4 w-4 shrink-0 text-rose" aria-hidden="true" />
                    <span>
                      {tab === "dance"
                        ? "Dance photographs are the institute's own class and performance photography. Styles shown reflect what the classes actually rehearse — classical poses, folk sets, Zumba and choreography."
                        : "Every artwork shown is genuine student work, photographed as it left the easel. No third-party or stock art appears anywhere."}
                    </span>
                  </p>
                </Reveal>
              </div>
            )}
        </motion.div>
      </section>
    </>
  );
}

