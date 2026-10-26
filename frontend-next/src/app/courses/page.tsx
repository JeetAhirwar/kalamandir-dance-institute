import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock, Users2, LayoutGrid } from "lucide-react";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import SmartImage from "@/components/SmartImage";
import { Reveal, RevealGroup, RevealItem } from "@/lib/motion";
import { programmes } from "@/data/programmes";
import { buildWhatsAppUrl } from "@/data/site";

export const metadata: Metadata = {
  title: "Courses & Classes",
  description:
    "The full class list at Kala Mandir, Sector 52 Noida — art, dance, Zumba and choreography. Batch timings and fees are shared on enquiry.",
};

/**
 * Courses — the full catalogue.
 * Honest by design: batch timings and fees are NOT published because the
 * institute has not confirmed them; every fee question is routed to the
 * enquiry form purposefully.
 */
export default function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses & classes"
        title="The full list, in plain words"
        standfirst="Five programmes run across the week. Batch timings and fees are shared personally on enquiry — classes are placed by age and level, not by form fields."
      />

      {/* Programme cards */}
      <section aria-labelledby="catalogue-title" className="section bg-cream">
        <div className="shell">
          <SectionHeading
            id="catalogue-title"
            number="01"
            eyebrow="The catalogue"
            title={
              <>
                What each class <span className="italic text-pink">builds</span>.
              </>
            }
            standfirst="Every entry below is a real, running programme. Tap a card for its dedicated page and the enquiry form pre-selects it."
          />

          <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
            {programmes.map((p, i) => (
              <RevealItem key={p.id} className={i === 4 ? "sm:col-span-2 lg:col-span-3" : ""}>
                <Link
                  href={p.route === "/events" ? "/admission" : p.route}
                  className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-rule bg-white transition-shadow duration-300 hover:shadow-[0_30px_60px_-38px_rgba(41,33,43,0.35)]"
                >
                  <SmartImage
                    image={p.image}
                    className={i === 4 ? "aspect-[21/9] w-full" : "aspect-[4/3] w-full"}
                    imgClassName="transition-transform duration-[850ms] ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                  />
                  <div className="flex flex-1 flex-col p-7">
                    <p className={`eyebrow ${p.pillar === "art" ? "text-rose" : "text-golddeep"}`}>
                      {p.kicker}
                    </p>
                    <h3 className="mt-2 font-display text-[1.7rem] leading-tight text-ink transition-colors duration-200 group-hover:text-pink">
                      {p.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[0.94rem] leading-[1.65] text-muted">
                      {p.summary}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.points.map((point) => (
                        <li
                          key={point}
                          className="rounded-full border border-rule px-3 py-1 text-[0.8rem] text-ink/70"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* How admission works — three honest steps */}
      <section aria-labelledby="how-title" className="section border-t border-rule bg-blossom">
        <div className="shell">
          <SectionHeading
            id="how-title"
            number="02"
            eyebrow="How joining works"
            title={
              <>
                Three messages, one <span className="italic text-pink">first class</span>.
              </>
            }
            align="center"
          />
          <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Clock,
                title: "1 · Message the studio",
                body: "Tell us the candidate's age and interest — dance, art, both, or not-sure-yet. WhatsApp is fastest.",
              },
              {
                icon: LayoutGrid,
                title: "2 · Get placed",
                body: "We reply with the right batch, its timings and the fee structure — decided with you, not published blindly.",
              },
              {
                icon: Users2,
                title: "3 · Meet the room",
                body: "Visit, watch a session, and begin at the pace that suits you. Beginners and adults are placed as carefully as children.",
              },
            ].map((step, i) => (
              <RevealItem key={step.title}>
                <div className="relative h-full rounded-[16px] border border-rule bg-white p-7">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 ${i === 0 ? "bg-pink" : i === 1 ? "bg-rose" : "bg-gold"}`}
                  />
                  <step.icon className="h-5 w-5 text-rose" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-[1.35rem] text-ink">{step.title}</h3>
                  <p className="mt-2.5 text-[0.93rem] leading-[1.65] text-muted">{step.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Fees & timings — honest note */}
      <section aria-labelledby="fees-title" className="section bg-paper">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              id="fees-title"
              number="03"
              eyebrow="Fees & timings"
              title={
                <>
                  Shared on <span className="italic text-rose">enquiry</span>, on purpose.
                </>
              }
              standfirst="Different batches and levels carry different schedules, so a single published table would say less than a conversation. One message gets exact, current numbers."
            />
          </div>
          <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-[18px] border border-rule bg-white p-8">
              <ul className="space-y-4 text-[0.96rem] leading-[1.7] text-ink/85">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink" />
                  <span><strong>Nobody needs to guess a price.</strong> Fees depend on the batch; the studio quotes them directly and finally.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                  <span><strong>Timings follow the day.</strong> School-age, working-adult and weekend batches each have their own slots.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  <span><strong>Demo and materials questions</strong> — art supplies, costumes, logbooks — are answered with the placement reply.</span>
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/admission" className="btn-rose group">
                  Send an enquiry
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </Link>
                <a
                  href={buildWhatsAppUrl("Hello! I'd like timings and fees for classes.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rule-link text-[0.95rem] font-medium text-rose"
                >
                  Ask on WhatsApp
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
