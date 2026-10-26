"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Phone, Instagram, MapPin, MessageCircle, Navigation } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Reveal } from "@/lib/motion";
import { siteConfig, contactLinks, buildWhatsAppUrl } from "@/data/site";

/**
 * Contact — verified details, Google Maps embed and a WhatsApp-backed
 * enquiry form (the site has no backend; the form deep-links into chat
 * with the message pre-filled).
 */
export default function ContactPage() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const waHref = buildWhatsAppUrl(
    `Hello Kala Mandir!${name ? ` I am ${name}.` : ""}${message ? ` ${message}` : ""}`,
    interest,
  );

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="One message away from the studio floor"
        standfirst="Call, WhatsApp or walk in — the phone answers, the door usually rehearsing is open. Address and directions below."
        pillar="neutral"
      />

      <section className="section bg-cream">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <Reveal className="lg:col-span-6">
            <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.08]">
              Write to the <span className="italic text-pink">studio</span>.
            </h2>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
              This form opens a WhatsApp chat with your words already typed —
              nothing is stored on any server.
            </p>
            <form
              className="mt-8"
              onSubmit={(e) => {
                e.preventDefault();
                window.open(waHref, "_blank", "noopener");
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="eyebrow text-muted">Your name</span>
                  <input
                    className="field mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    autoComplete="name"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow text-muted">Interest</span>
                  <select
                    className="field mt-1"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                  >
                    <option value="">Choose one (optional)</option>
                    {["Art & Drawing", "Painting & Art Craft", "Dance", "Zumba", "Wedding / Event Choreography"].map(
                      (o) => (
                        <option key={o} value={o}>{o}</option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <label className="mt-6 block">
                <span className="eyebrow text-muted">Message</span>
                <textarea
                  className="field mt-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. My daughter is 8 and wants to learn dance. What are the batch options?"
                />
              </label>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn-rose group">
                  Send on WhatsApp
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </button>
                <p className="text-[0.82rem] text-muted">
                  Opens wa.me — no data leaves your device otherwise.
                </p>
              </div>
            </form>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="grid gap-4">
              <a
                href={contactLinks.phones[0]}
                className="group flex items-start gap-4 rounded-[16px] border border-rule bg-white p-6 transition-colors hover:border-rose/40"
              >
                <Phone className="mt-1 h-5 w-5 text-rose" aria-hidden="true" />
                <span>
                  <span className="eyebrow block text-muted">Call</span>
                  {siteConfig.phones.map((p) => (
                    <span key={p.e164} className="mt-1 block text-[0.98rem] font-medium text-ink">
                      {p.display}
                    </span>
                  ))}
                </span>
              </a>
              <a
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-[16px] border border-rule bg-white p-6 transition-colors hover:border-rose/40"
              >
                <MessageCircle className="mt-1 h-5 w-5 text-rose" aria-hidden="true" />
                <span>
                  <span className="eyebrow block text-muted">WhatsApp</span>
                  <span className="mt-1 block text-[0.98rem] font-medium text-ink">{siteConfig.whatsapp.display}</span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted">Fastest for batch timings and fees</span>
                </span>
              </a>
              <a
                href={contactLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-[16px] border border-rule bg-white p-6 transition-colors hover:border-rose/40"
              >
                <Instagram className="mt-1 h-5 w-5 text-rose" aria-hidden="true" />
                <span>
                  <span className="eyebrow block text-muted">Instagram</span>
                  <span className="mt-1 block text-[0.98rem] font-medium text-ink">{siteConfig.instagram.handle}</span>
                  <span className="mt-0.5 block text-[0.85rem] text-muted">Class reels, work and studio life</span>
                </span>
              </a>
              <a
                href={contactLinks.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-[16px] border border-rule bg-white p-6 transition-colors hover:border-rose/40"
              >
                <MapPin className="mt-1 h-5 w-5 text-rose" aria-hidden="true" />
                <span>
                  <span className="eyebrow block text-muted">Visit</span>
                  <span className="mt-1 block text-[0.98rem] font-medium text-ink">
                    {siteConfig.address.line1}, {siteConfig.address.city}, {siteConfig.address.region} {siteConfig.address.postalCode}
                  </span>
                  <span className="mt-0.5 inline-block text-[0.85rem] text-rose">Open directions</span>
                </span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section aria-label="Map" className="border-t border-rule bg-paper pb-16 lg:pb-24">
        <div className="shell">
          <Reveal>
            <div className="relative overflow-hidden rounded-[20px] border border-rule">
              <iframe
                title={`Map — ${siteConfig.name}`}
                src={siteConfig.googleMapsEmbedSrc}
                className="h-[24rem] w-full border-0 lg:h-[30rem]"
                loading="lazy"
                allowFullScreen
              />
              <a
                href={contactLinks.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-plum/90 px-4 py-2.5 text-[0.85rem] font-medium text-white backdrop-blur transition-colors hover:bg-plum"
              >
                <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                Get directions
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
