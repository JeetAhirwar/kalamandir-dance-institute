"use client";

import { useState } from "react";
import type { Media } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * SmartImage — media resurfaces as WebP with a JPEG fallback.
 * Intrinsic dimensions prevent layout shift; `pos` crops by default.
 */
export default function SmartImage({
  image,
  className,
  imgClassName,
    priority = false,
  pos,
}: {
  image: { src: string; fallback: string; alt: string; w: number; h: number; pos?: string };
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  pos?: string;
}) {
  const [src, setSrc] = useState(image.src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative", className)}>
      {!loaded && (
        <div aria-hidden="true" className="km-skeleton absolute inset-0" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={image.alt}
        width={image.w}
        height={image.h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding={priority ? "sync" : "async"}
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setSrc(image.fallback)}
        style={{ objectPosition: pos || image.pos || "50% 45%" }}
        className={cn(
          "h-full w-full object-cover",
          !loaded && "opacity-0",
          "transition-opacity duration-500",
          imgClassName,
        )}
      />
    </div>
  );
}
