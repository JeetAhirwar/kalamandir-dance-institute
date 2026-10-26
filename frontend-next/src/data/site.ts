/**
 * Central business configuration (multi-page edition).
 *
 * Every fact on every page is read from here. Values marked verified came
 * from the institute's brief and listings; anything else must be confirmed
 * before publication. No fees, schedules or teacher rosters are invented —
 * the Courses and Faculty pages are written accordingly.
 */
export const siteConfig = {
  name: "Kala Mandir Art and Dance Institute",
  shortName: "Kala Mandir",
  tagline: "Art & Dance Institute",
  description:
    "Sketching, painting, craft, dance, Zumba and event choreography classes in Sector 52, Noida.",

  address: {
    line1: "C-39, Block C, Sector 52",
    city: "Noida",
    region: "Uttar Pradesh",
    postalCode: "201307",
    full: "C-39, Block C, Sector 52, Noida, Uttar Pradesh 201307",
    verified: true,
  },

  phones: [
    { display: "+91 95600 68023", e164: "+919560068023", verified: true },
    { display: "+91 85859 20501", e164: "+918585920501", verified: true },
  ],

  whatsapp: {
    number: "918585920501",
    display: "+91 85859 20501",
    verified: true,
  },

  instagram: {
    url: "https://www.instagram.com/kala_mandir_sec52/",
    handle: "@kala_mandir_sec52",
    verified: true,
  },

  googleMapsEmbedSrc:
    "https://www.google.com/maps?q=Kala+Mandir+Art+and+Dance+Institute,+C-39,+Block+C,+Sector+52,+Noida,+Uttar+Pradesh+201307&output=embed",

  googleMapsPlace:
    "https://www.google.com/maps/place/Kala+Mandir+Art+and+Dance+Institute/@28.5866938,77.3703023,17z",

  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(
      "Kala Mandir Art and Dance Institute, C-39, Block C, Sector 52, Noida, Uttar Pradesh 201307",
    ),

  /* Main navigation — multi-page routes. */
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Dance", href: "/dance", pillar: "dance" as const },
    { label: "Art", href: "/art", pillar: "art" as const },
    { label: "Courses", href: "/courses" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ],

  /* Footer-only links (secondary destinations). */
  secondaryNav: [
    { label: "Events & Performances", href: "/events" },
    { label: "Faculty", href: "/faculty" },
    { label: "Admission & Enroll", href: "/admission" },
  ],
};

export const contactLinks = {
  phones: siteConfig.phones.map((p) => `tel:${p.e164}`),
  whatsapp: `https://wa.me/${siteConfig.whatsapp.number}`,
  instagram: siteConfig.instagram.url,
  map: siteConfig.mapUrl,
  mapUrl: siteConfig.mapUrl,
  googleMapsPlace: siteConfig.googleMapsPlace,
};

/** Pre-filled WhatsApp enquiry link. */
export function buildWhatsAppUrl(message?: string, interest?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp.number}`;
  const parts: string[] = [];
  if (message) parts.push(message);
  if (interest) parts.push(`I am interested in: ${interest}`);
  if (!parts.length) return base;
  return `${base}?text=${encodeURIComponent(parts.join(". "))}`;
}
