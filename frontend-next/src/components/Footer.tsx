import Link from "next/link";
import { Phone, Instagram, MapPin, MessageCircle } from "lucide-react";
import { siteConfig, contactLinks } from "@/data/site";
import { Lotus } from "@/components/Motifs";

/**
 * Footer — deep plum with marigold accents. Quick links to every page,
 * the institute's verified contact details and socials.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="grain relative overflow-hidden bg-plum text-white">
      {/* Gold hairline at the top */}
      <div aria-hidden="true" className="h-[3px] w-full bg-gradient-to-r from-gold/70 via-pink/60 to-violet/60" />

      <div className="shell relative py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 font-display text-[1.9rem] leading-tight text-white">
              <Lotus className="h-6 w-10 text-gold" />
              Kala Mandir
            </p>
            <p className="mt-3 max-w-[24rem] text-[0.95rem] leading-[1.7] text-white/70">
              {siteConfig.description}
            </p>
            <p className="mt-6 flex items-start gap-3 text-[0.95rem] leading-relaxed text-white/70">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span>
                {siteConfig.address.line1},<br />
                {siteConfig.address.city}, {siteConfig.address.region}{" "}
                {siteConfig.address.postalCode}
              </span>
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={contactLinks.phones[0]}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.88rem] text-white/85 transition-colors hover:border-gold hover:text-gold"
              >
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                {siteConfig.phones[0].display}
              </a>
              <a
                href={contactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.88rem] text-white/85 transition-colors hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={contactLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[0.88rem] text-white/85 transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
                {siteConfig.instagram.handle}
              </a>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer — explore" className="lg:col-span-3">
            <h3 className="eyebrow text-gold">Explore</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Institute */}
          <nav aria-label="Footer — institute" className="lg:col-span-2">
            <h3 className="eyebrow text-gold">Institute</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              {siteConfig.secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={contactLinks.googleMapsPlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  Videos on Google Maps
                </a>
              </li>
            </ul>
          </nav>

          {/* Programmes */}
          <nav aria-label="Footer — programmes" className="lg:col-span-2">
            <h3 className="eyebrow text-gold">Programmes</h3>
            <ul className="mt-5 space-y-3 text-[0.95rem]">
              <li><Link href="/dance" className="text-white/70 transition-colors hover:text-white">Dance classes</Link></li>
              <li><Link href="/art" className="text-white/70 transition-colors hover:text-white">Art & painting</Link></li>
              <li><Link href="/courses" className="text-white/70 transition-colors hover:text-white">Zumba</Link></li>
              <li><Link href="/admission" className="text-white/70 transition-colors hover:text-white">Event choreography</Link></li>
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.82rem] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}, {siteConfig.address.city}
          </p>
          <p>Every photograph shows real Kala Mandir students and artwork.</p>
        </div>
      </div>
    </footer>
  );
}
