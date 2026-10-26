/**
 * Motifs — light-weight cultural SVG decorations.
 * Paisley, lotus line art, and rangoli dot strips. All aria-hidden and
 * never used to mean anything beyond decoration.
 */

export function Paisley({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 140"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M64 8c-14 4-26 14-30 28-5 18 4 30 18 34 12 4 22-2 24-11 2-8-4-15-12-15 9-2 18 3 20 12 3 14-8 26-24 28-22 3-40-12-42-33C16 26 38 5 62 1Z"
        fill="currentColor"
      />
      <circle cx="56" cy="118" r="5" fill="currentColor" opacity="0.55" />
      <circle cx="70" cy="130" r="3" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function Lotus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M60 6c4 10 6 20 6 30 0-10 4-20 12-26-2 10-6 18-12 26 8-2 16-6 24-12-4 10-12 17-22 21 2 3 3 6 4 9-8-4-16-6-24 0-2-3-1-6 0-9-10-4-18-11-22-21 8 6 16 10 24 12-6-8-10-16-12-26 8 6 12 16 12 26 0-10 2-20 6-30Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A rhythm strip of dots — used under headlines and between sections. */
export function Dots({
  className,
  count = 7,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <span className={className} aria-hidden="true">
      <span className="flex items-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-current"
            style={{ opacity: 0.35 + (0.1 * (i % 3)) }}
          />
        ))}
      </span>
    </span>
  );
}

/** Thin arch line — a nod to temple-arch framing. */
export function ArchLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 36c20 0 36-28 60-28s40 24 60 24 40-24 60-24 40 28 60 24"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
