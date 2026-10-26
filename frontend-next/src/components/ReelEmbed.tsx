"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { instagramEmbedUrl, instagramPostUrl } from "@/data/videos";

/**
 * ReelEmbed — the institute's own Instagram reels, embedded via the
 * official Instagram embed route (the only supported, allowed way). The
 * frame carries its own loading shimmer until the remote iframe reports
 * load.
 */
export default function ReelEmbed({
  shortcode,
  index = 0,
}: {
  shortcode: string;
  index?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.figure
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 0.61, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[16px] bg-[#0c0510]"
    >
      <div className="relative mx-auto w-full max-w-[26rem]" style={{ aspectRatio: "9/16.4" }}>
        <div aria-hidden="true" className="km-skeleton absolute inset-0" />
        <iframe
          src={instagramEmbedUrl(shortcode)}
          title={`Kala Mandir class reel ${index + 1} — watch on Instagram`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          scrolling="no"
          allowFullScreen
          onLoad={(e) => {
            (e.currentTarget.previousElementSibling as HTMLElement | null)?.remove();
          }}
        />
      </div>
      <figcaption className="px-4 pb-4 pt-3 text-[0.85rem] text-white/60">
        <a
          href={instagramPostUrl(shortcode)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-gold"
        >
          Class reel on Instagram
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </figcaption>
    </motion.figure>
  );
}
