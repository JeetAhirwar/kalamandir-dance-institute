/**
 * Central business configuration.
 *
 * Every piece of business information on the site is read from this file so it
 * can be corrected in one place. Values marked `verified: true` came directly
 * from the institute brief; anything else must be confirmed with the institute
 * before it is published.
 *
 * TO DO (needs institute confirmation):
 *  - `domain`      — canonical URL used for Open Graph / structured data.
 *  - `mapQuery`    — currently derived from the verified address string.
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

    // E.164 format — used by tel: links and structured data. The first number
    // is also the primary for single-number call buttons.
    phones: [
        { display: "+91 95600 68023", e164: "+919560068023", verified: true },
        { display: "+91 85859 20501", e164: "+918585920501", verified: true },
    ],

    // Every WhatsApp link and the enquiry hand-off go to this line only.
    whatsapp: {
        // wa.me expects digits only, no "+".
        number: "918585920501",
        display: "+91 85859 20501",
        verified: true,
    },

    instagram: {
        url: "https://www.instagram.com/kala_mandir_sec52/",
        handle: "@kala_mandir_sec52",
        verified: true,
    },

    /** Google Maps directions — built from the verified address. */
    mapUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent("Kala Mandir Art and Dance Institute, C-39, Block C, Sector 52, Noida, Uttar Pradesh 201307"),

    /**
     * Google Business Profile (Maps place). Coordinates and place id come from
     * the institute's own listing (verified from the supplied deep link).
     * The listing hosts several institute videos; they are only playable
     * inside Google Maps, so the site links here instead of embedding.
     */
    googleMapsPlace:
        "https://www.google.com/maps/place/Kala+Mandir+Art+and+Dance+Institute/@28.5866938,77.3703023,17z",

    /** Where the enquiry form posts when a backend is configured. */
    enquiry: {
        // Leave null to use the WhatsApp fallback (documented in README.md).
        endpoint: null,
        // Minimum time, in ms, a visitor must spend on the form before it will
        // submit — a lightweight honeypot-free spam guard.
        minFillMs: 2500,
    },

    /**
     * Canonical origin. UNVERIFIED — replace with the real domain before go-live
     * and update `index.html` (canonical, og:url) to match.
     */
    domain: "https://kalamandir.in",

    /** Primary navigation (single-page anchors). */
    nav: [
        { label: "Home", href: "#home" },
        { label: "Art", href: "#art" },
        { label: "Dance", href: "#dance" },
        { label: "Gallery", href: "#gallery" },
        { label: "About", href: "#about" },
        { label: "Contact", href: "#contact" },
    ],
};

export const contactLinks = {
    phones: siteConfig.phones.map((phone) => `tel:${phone.e164}`),
    whatsapp: `https://wa.me/${siteConfig.whatsapp.number}`,
    instagram: siteConfig.instagram.url,
    map: siteConfig.mapUrl,
    googleMapsPlace: siteConfig.googleMapsPlace,
};

/** Build a pre-filled WhatsApp enquiry message. */
export function buildWhatsAppUrl(message) {
    const base = `https://wa.me/${siteConfig.whatsapp.number}`;
    if (!message) return base;
    return `${base}?text=${encodeURIComponent(message)}`;
}
