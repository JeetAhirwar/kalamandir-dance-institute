import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Paisley } from "@/components/Motifs";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-cream text-ink">
      <Paisley className="pointer-events-none absolute -left-6 top-16 h-24 w-16 text-rose/15" aria-hidden="true" />
      <Paisley className="pointer-events-none absolute bottom-10 right-8 h-32 w-20 text-pink/15" aria-hidden="true" />
      <div className="shell py-32 text-center">
        <p className="eyebrow text-rose">404 — page not found</p>
        <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.03]">
          This step is off the <span className="italic text-pink">beat</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-[30rem] text-[1rem] leading-relaxed text-muted">
          The page you were looking for has moved or never existed. The
          studio, however, is exactly where it belongs.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn-rose group">
            Back to the home page
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
          <Link href="/courses" className="btn-outline">
            Browse classes
          </Link>
        </div>
      </div>
    </section>
  );
}
