/**
 * ART GALLERY — central image registry.
 *
 * Everything about a gallery tile lives here: source, category, alt text,
 * caption, intrinsic size (so layout never shifts) and provenance.
 *
 * ── PROVENANCE ─────────────────────────────────────────────────────────────
 * `status: "institute"`    → authentic Kala Mandir artwork / class
 *                            photography, supplied via the institute's
 *                            Google Business Profile and approved for use.
 * `status: "placeholder"`  → licensed stock photography used where no
 *                            authentic asset exists yet (Instagram showcase
 *                            and a few activity shots). Placeholders are
 *                            NEVER presented on screen as Kala Mandir
 *                            students or artwork.
 *
 * ── SOURCES ────────────────────────────────────────────────────────────────
 * The institute works below were supplied as Google-hosted images
 * (lh3.googleusercontent.com/gps-cs-s/…) by the client. Full-size variants
 * were re-fetched at `=s1800`, converted to WebP locally with ffmpeg and
 * stored in `public/assets/institute/` so the site never hotlinks.
 * Captions and alt text only describe what is actually visible in each
 * image — no artist names, media guesses or awards are invented.
 *
 * Alt-text note: media descriptions stay descriptive ("what you see");
 * medium (pastel/oil/clay) is only claimed where it is clearly visible.
 */

export const showPlaceholderNotice = true;

export const galleryCategories = [
    { id: "all", label: "All" },
    { id: "drawing", label: "Drawing" },
    { id: "painting", label: "Painting" },
    { id: "craft", label: "Craft" },
];

/** Original Google-hosted source of each institute asset (provenance trail). */
export const instituteSources = {
    "km-artwork-01":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QIaHafZLtCGZ56l9HO_ozQQAME2ReJpjeZMQxit39dyc3MdRuobfJdep4z-nj32UUDBnJ25gX2ZuXp_Hr7as5usklzoUvu2kob389sfGDwrnkEJOu7EWz3h76EasPK5dnYaMYmLlHwiYzJ",
    "km-artwork-02":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TMUEI3_hqxaYq8WYFiWk4TCawBjp2hRMz5-lDh29Fvsc5IKF-xIHnPrgo99R6MlilheWE0eB-ecukupnMFpQpqKqUDpUArhgNdWR-DVwyNjAMD28V1gLRbG6JPuadUjafTGdUZLhihPgQ",
    "km-artwork-03":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SVDJTVMTComfyR7v-CsKY-QSGhJgUqTPskZZh2vSgp9EfI0mAzye_Nlx8kbednaNTtIhfsEY7vJ9DTXSsNwUSAGGM4Ow7fFI3pwR6h6S0YubBofW5f4odQPUjiymXv5x_4HEtZVLuXHsNz",
    "km-artwork-04":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QRE9Pu4ZbqNf8c92qfNU-nk6PkHKmSsJ5koxrQGV00L8vHNWPtAog9Nuw0nPljP7V7Qlh77_wF_nrQokypQmSzAEJyCxRCweqFPsDQot2pK0Gp1oZUb_aaoa17s_oKj2WQlibHlKDh7XXh",
    "km-artwork-05":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TyJC-NWZcHLm4eFl3G0ZQ8eUBHrQkJTtwtGUIUisBLYh9zyXfAcdKIWJJZEyGEDObREoDmf278s92ihwzPDIIvToxcHnc_0coAnZXi4jsjriogF5ELxCODAIuLTLTZ9eCxIwZA2V3Oyhs",
    "km-artwork-06":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S7VZcNun-JHBSlvq33PKMkG7J55ZjnCYjIVyv1rUOSykWes6ovuA5rnXZe39BHF1SezFwcTk9vAK9x7aiedgmK2ZNCvrPboGYUI1RNwlU4qkg1FyI1K8o8K7mOYe5pfo9mzjXM4xqKdG4x",
    "km-artwork-07":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RQZf6_N2SyGCkH2Kdqa6S1zpuP8kkEQ7V9Q9-NydhDX8Df6WPilYd0wZ_raZ_qa-_9Ne44mxeb3FDNpD7NhgkFBVOgiJ3DI6YVql5kfvvNtO7cmi5G9tg97f9-N4VKHQSM0dPATnPDDkzM",
    "km-artwork-08":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Tga430z9NTXT4JhcypmT4M5XHlV0E8rxnjiskVHMUdFVf3yJEgYX8sa6ivp4QuvAkcbjBHWWQk5qXmgCNrZK5itHreQhOTkpWfFJFaNplD33WRNJePhZiev7zpV3xVG1Gt8vYGVcx_bbe9",
    "km-artwork-09":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9QY83C0ZxANrvqvxr22pg-xOnpxxjRVu8R1X95cHQDkWEjmTRIvhVGVqCvcuIlprumpySpii6hwxEsxQM987Jblnc4V390ND6z2bWckbSqdhLhPBv0xwEgc5DGrCn9f0bbj2i6Ch5QWJuuC",
};

const pexels = "Pexels";
const googleListing = "Google Business Profile (supplied by the client)";

/**
 * THE EXHIBITION — the nine authentic works supplied by the institute.
 *
 * `crop` selects the display proportion inside the masonry (the full,
 * uncropped image is always shown in the lightbox). Proportions vary on
 * purpose so the spread reads like a curated wall, not a uniform grid.
 */
const institute = (n, category, caption, alt, width, height, crop, position = "50% 50%") => ({
    id: `km-artwork-${n}`,
    category,
    src: `/assets/institute/km-artwork-${n}.webp`,
    fallback: `/assets/institute/km-artwork-${n}.jpg`,
    alt,
    caption,
    width,
    height,
    status: "institute",
    source: googleListing,
    crop,
    position,
});

export const galleryItems = [
    /* ------------------------------ PAINTING ------------------------------- */
    institute(
        "01",
        "painting",
        "Still life — clay pots & coconut",
        "Student still-life artwork of clay pots and a coconut on a toned background",
        1350,
        1800,
        "square",
        "50% 48%",
    ),
    institute(
        "02",
        "painting",
        "Figure on a circular canvas",
        "Colourful figure painting on a circular canvas — a girl in a white top and red tartan skirt, photographed at the studio",
        1350,
        1800,
        "portrait",
        "50% 45%",
    ),
    institute(
        "05",
        "painting",
        "Saraswati on a lotus",
        "Student painting of the goddess Saraswati seated on a lotus with a white swan, in teal water tones",
        1012,
        1800,
        "square",
        "50% 42%",
    ),
    institute(
        "09",
        "painting",
        "Figure study on the easel",
        "A student painter at an easel beside an oil figure study in warm reds and whites",
        1012,
        1800,
        "landscape",
        "62% 42%",
    ),

    /* ------------------------------ DRAWING -------------------------------- */
    institute(
        "03",
        "drawing",
        "In class — Madhubani Krishna",
        "A student colouring a Madhubani-style Krishna face artwork at a blue work table",
        1012,
        1800,
        "portrait",
        "50% 38%",
    ),
    institute(
        "04",
        "drawing",
        "Birds on a branch — graphite",
        "Graphite drawing of small birds perched on a leafy branch",
        1012,
        1800,
        "portrait",
        "50% 42%",
    ),
    institute(
        "07",
        "drawing",
        "Profile in white charcoal",
        "Portrait profile of a woman drawn in white charcoal on grey paper",
        1012,
        1800,
        "portrait",
        "50% 40%",
    ),

    /* -------------------------------- CRAFT -------------------------------- */
    institute(
        "06",
        "craft",
        "Clay floral relief",
        "Hand-built clay mural of flowers in raised relief",
        1350,
        1800,
        "landscape",
        "50% 46%",
    ),

    /* -------------------------------- DANCE -------------------------------- */
    institute(
        "08",
        "painting",
        "Two dancers on a circular canvas",
        "Student painting of two dancers on a circular canvas, against a colourful geometric background",
        1012,
        1800,
        "portrait",
        "50% 42%",
    ),
];

/** Instagram showcase — curated local assets (never scraped from Instagram). */
export const instagramPosts = [
    {
        id: "ig-1",
        src: "/assets/instagram/ig-classical-dancer.webp",
        fallback: "/assets/instagram/ig-classical-dancer.jpg",
        alt: "Classical dancer in traditional costume mid-performance",
        width: 800,
        height: 1200,
        status: "placeholder",
        source: pexels,
        href: null,
    },
    {
        id: "ig-2",
        src: "/assets/instagram/ig-watercolour.webp",
        fallback: "/assets/instagram/ig-watercolour.jpg",
        alt: "Hand painting loose watercolour flowers on paper",
        width: 800,
        height: 533,
        status: "placeholder",
        source: pexels,
        href: null,
    },
    {
        id: "ig-3",
        src: "/assets/instagram/ig-kid-painting.webp",
        fallback: "/assets/instagram/ig-kid-painting.jpg",
        alt: "Young student painting a rainbow at a studio table",
        width: 800,
        height: 533,
        status: "placeholder",
        source: pexels,
        href: null,
    },
    {
        id: "ig-4",
        src: "/assets/instagram/ig-sketch-faces.webp",
        fallback: "/assets/instagram/ig-sketch-faces.jpg",
        alt: "Sketchbook page covered with drawn faces",
        width: 800,
        height: 1200,
        status: "placeholder",
        source: pexels,
        href: null,
    },
    {
        id: "ig-5",
        src: "/assets/instagram/ig-palette-hands.webp",
        fallback: "/assets/instagram/ig-palette-hands.jpg",
        alt: "Hands holding a palette loaded with mixed paint",
        width: 800,
        height: 533,
        status: "placeholder",
        source: pexels,
        href: null,
    },
    {
        id: "ig-6",
        src: "/assets/instagram/ig-drawing-table.webp",
        fallback: "/assets/instagram/ig-drawing-table.jpg",
        alt: "Students drawing together at a shared work table",
        width: 800,
        height: 450,
        status: "placeholder",
        source: pexels,
        href: null,
    },
];

/**
 * Editorial image slots used by the opening sections.
 * Kept here so a single swap updates hero, intro and showcase together.
 * Hero and intro now use authentic institute media.
 */
export const editorialImages = {
    hero: {
        primary: {
            src: "/assets/institute/km-artwork-08.webp",
            fallback: "/assets/institute/km-artwork-08.jpg",
            alt: "Student painting of two dancers on a circular canvas, against a colourful geometric background",
            width: 1012,
            height: 1800,
            status: "institute",
            source: googleListing,
        },
        secondary: {
            src: "/assets/institute/km-artwork-02.webp",
            fallback: "/assets/institute/km-artwork-02.jpg",
            alt: "Colourful student figure painting on a circular canvas",
            width: 1350,
            height: 1800,
            status: "institute",
            source: googleListing,
        },
    },
    intro: {
        main: {
            src: "/assets/institute/km-artwork-03.webp",
            fallback: "/assets/institute/km-artwork-03.jpg",
            alt: "A student colouring a Madhubani-style Krishna artwork at a class work table",
            width: 1012,
            height: 1800,
            status: "institute",
            source: googleListing,
        },
        side: {
            src: "/assets/institute/km-artwork-06.webp",
            fallback: "/assets/institute/km-artwork-06.jpg",
            alt: "Clay mural of flowers in raised relief, made in class",
            width: 1350,
            height: 1800,
            status: "institute",
            source: googleListing,
        },
    },
    artDetail: [
        institute(
            "09",
            "painting",
            "At the easel",
            "A student painter at an easel beside an oil figure study",
            1012,
            1800,
            "portrait",
            "62% 42%",
        ),
        institute(
            "05",
            "painting",
            "Saraswati on a lotus",
            "Student painting of the goddess Saraswati seated on a lotus with a white swan",
            1012,
            1800,
            "landscape",
            "50% 42%",
        ),
        institute(
            "06",
            "craft",
            "Clay relief work",
            "Hand-built clay mural of flowers in raised relief",
            1350,
            1800,
            "square",
            "50% 46%",
        ),
        institute(
            "01",
            "painting",
            "Still life practice",
            "Student still-life artwork of clay pots and a coconut",
            1350,
            1800,
            "landscape",
            "50% 48%",
        ),
    ],
    danceShowcase: {
        // 21:9 band needs a landscape frame — authentic portrait footage does
        // not crop to this shape without losing the dancers. Placeholder kept
        // until landscape performance photography is supplied.
        wide: {
            src: "/assets/dance/dance-classical-stage.webp",
            fallback: "/assets/dance/dance-classical-stage.jpg",
            alt: "Classical dancer performing under a focused stage light (placeholder image)",
            width: 1300,
            height: 1948,
            status: "placeholder",
            source: pexels,
        },
        duo: {
            src: "/assets/dance/choreo-wedding-couple.webp",
            fallback: "/assets/dance/choreo-wedding-couple.jpg",
            alt: "Couple in wedding attire sharing a dance moment (placeholder image)",
            width: 1200,
            height: 1804,
            status: "placeholder",
            source: pexels,
        },
        group: {
            src: "/assets/dance/dance-group-class.webp",
            fallback: "/assets/dance/dance-group-class.jpg",
            alt: "Group class rehearsing a routine together (placeholder image)",
            width: 1300,
            height: 867,
            status: "placeholder",
            source: pexels,
        },
        // Portrait slot carries authentic student artwork of dancers.
        zumba: {
            src: "/assets/institute/km-artwork-08.webp",
            fallback: "/assets/institute/km-artwork-08.jpg",
            alt: "Student painting of two dancers on a circular canvas, against a colourful geometric background",
            width: 1012,
            height: 1800,
            status: "institute",
            source: googleListing,
            position: "50% 42%",
        },
        wedding: {
            src: "/assets/dance/choreo-indian-attire.webp",
            fallback: "/assets/dance/choreo-indian-attire.jpg",
            alt: "Three performers in coordinated traditional Indian attire (placeholder image)",
            width: 1200,
            height: 800,
            status: "placeholder",
            source: pexels,
        },
    },
};
