"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, User2, Palette, Music4 } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/lib/motion";
import { buildWhatsAppUrl } from "@/data/site";
import { interestOptions } from "@/data/programmes";
import { places } from "@/data/media";
import SmartImage from "@/components/SmartImage";
import { cn } from "@/lib/utils";

/**
 * Admission — the enrolment / enquiry page.
 * No stored data: the completed form deep-links into WhatsApp with a
 * structured, pre-filled message. The studio replies with batch options,
 * timings and fees.
 */
export default function AdmissionPage() {
  const [form, setForm] = useState({
    forWho: "myself",
    name: "",
    age: "",
    interest: "",
    notes: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const parts: string[] = [];
  parts.push(form.forWho === "child" ? "Hello! I want to enrol my child." : "Hello! I want to enrol myself.");
  if (form.name) parts.push(`Name: ${form.name}`);
  if (form.age) parts.push(`Age: ${form.age}`);
  if (form.interest) parts.push(`Interested in: ${form.interest}`);
  if (form.notes) parts.push(form.notes);
  const waHref = buildWhatsAppUrl(parts.join(". "));

  const filled = Object.entries(form).filter(([, v]) => v).length;

  return (
    <>
      <PageHero
        eyebrow="Admission & enrolment"
        title="Enrolment begins with a good question"
        standfirst="Tell us who is learning and what draws them — dance, art, Zumba, or all of it. The studio replies personally with the right batch."
      />

      <section className="section bg-blossom">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* The form */}
          <Reveal className="lg:col-span-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.open(waHref, "_blank", "noopener");
              }}
            >
              {/* Who is joining */}
              <p className="eyebrow flex items-center gap-2.5 text-rose">
                <User2 className="h-3.5 w-3.5" aria-hidden="true" />
                Who is joining
              </p>
              <div className="mt-3 flex gap-3" role="radiogroup" aria-label="Who is joining">
                {[
                  { id: "myself", label: "Myself" },
                  { id: "child", label: "My child" },
                ].map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={form.forWho === o.id}
                    onClick={() => set("forWho")(o.id)}
                    className={cn(
                      "rounded-full border px-5 py-2.5 text-[0.9rem] transition-colors",
                      form.forWho === o.id
                        ? "border-transparent bg-rose text-white"
                        : "border-rule bg-white text-muted hover:text-ink",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow text-muted">Name</span>
                  <input
                    className="field mt-1"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    placeholder={form.forWho === "child" ? "Child's name" : "Your name"}
                    autoComplete="off"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow text-muted">Age (approx. is fine)</span>
                  <input
                    className="field mt-1"
                    value={form.age}
                    onChange={(e) => set("age")(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                    inputMode="numeric"
                    placeholder="e.g. 8"
                  />
                </label>
              </div>

              {/* Interest */}
              <p className="mt-9 flex items-center gap-2.5 text-rose">
                {form.interest.includes("Art") ? <Palette className="h-3.5 w-3.5" aria-hidden="true" /> : <Music4 className="h-3.5 w-3.5" aria-hidden="true" />}
                <span className="eyebrow">Interest</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {interestOptions.map((o) => (
                  <button
                    key={o}
                    type="button"
                    aria-pressed={form.interest === o}
                    onClick={() => set("interest")(form.interest === o ? "" : o)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-[0.82rem] transition-colors",
                      form.interest === o
                        ? "border-transparent bg-rose text-white"
                        : "border-rule bg-white text-muted hover:text-ink",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>

              <label className="mt-9 block">
                <span className="eyebrow text-muted">Anything else?</span>
                <textarea
                  className="field mt-1"
                  value={form.notes}
                  onChange={(e) => set("notes")(e.target.value)}
                  placeholder="Goals, experience, preferred days — anything that helps place the right batch."
                />
              </label>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-rose group">
                  Send enquiry on WhatsApp
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </button>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rule-link text-[0.9rem] text-rose"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Just say hello first
                </a>
              </div>
              <p className="mt-4 text-[0.82rem] text-muted">
                {filled
                  ? "Your answers open in the chat pre-filled — nothing is stored anywhere."
                  : "No account, no form store — your details land directly in the institute's WhatsApp."}
              </p>
            </form>
          </Reveal>

          {/* Reassurance column */}
          <div className="lg:col-span-6">
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[20px]">
                <SmartImage
                  image={places.kidsDrawing}
                  className="aspect-[16/11] w-full rounded-[20px]"
                />
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <ol className="mt-8 space-y-5">
                {[
                  ["Placement, not paperwork", "Batches are matched to the learner — age, pace and what they want from the class."],
                  ["Timings & fees in the first reply", "The studio quotes the current schedule and fee structure directly; nothing is guessed on a webpage."],
                  ["Visit first, commit second", "Watch a session in the room before joining. Beginners are welcome in every pillar."],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose text-[0.85rem] font-semibold text-white">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-display text-[1.3rem] text-ink">{title}</span>
                      <span className="mt-1 block text-[0.93rem] leading-relaxed text-muted">{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
            <motion.p
              initial={false}
              className="mt-8 rounded-[14px] border border-rose/25 bg-white p-5 text-[0.9rem] leading-relaxed text-muted"
            >
              <span className="font-medium text-ink">Art and dance are kept separate on purpose —</span>
              but siblings joining both are placed sympathetically, and many
              families learn one of each.
            </motion.p>
          </div>
        </div>
      </section>
    </>
  );
}
