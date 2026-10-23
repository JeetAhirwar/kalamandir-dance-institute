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

export const showPlaceholderNotice = false;

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
    "km-studio-01":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9T0bvh8PXHuU_PIAzsyXAnOt3MbWXBasxyVrgwbJChMVSyBqeffPG8G0MmHIO-LRKZFRsvbG4U4e4wK-fvaioN_cAJA3_puHiUJWtfnKNMmYvmRuvfAQ6fOVU133tJS-mKvL-i1pJjl3LBS",
    "km-studio-02":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9SdnYGHzC90W_6xqzkc3ekZQRF1QvekkDYp4b-nHcA2wTEjX3FSOo0cb0EXBlxIPfWfgN8wSUUfPdKQxBcYNtrcTf7ZKaTDKt04ex10qxfxc_swHyDQUCr5CiGfxkjMnOCz2NGXvxAr6ZIH",
    "km-studio-03":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S-0sMGqjVIV-dAxzUSmHgN13CYXFwquE0XaaaypvJ5fSARQxlfYfs7_NfWNEknHTQEW_V1NnBelN08-hD0vrW9GSRl3q_hBHpeoloiGzEv5_WewtwiKzpfp9Im34_twj801htOFi-3aNoW",
    "km-studio-04":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9TpAtDW5N4lD--f2V9y9JRqYAkZKLrmMCAJRjGTwnYBHUxPnRIrHodZSxgz8MCpcGoKvcnqPiAr0wFThmH5BqZFoe7dmsBsK6PyT3VdFROw5QpzWf6beG3GU2j0y8F3-DV33ALKU4rEfwg",
    "km-studio-05":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9Se78LmebOT69dojZq_D6eikuQ_nzlAbzPOE-Cp8GquL_omzfETINL_Syfi0ypeBGCwz8p_m7K0JiQViNl5wI9sppYAHZQQBevzUrTSddGNGEj9GIBRpDx0xnc7gsHIUjT6Tp1ws1qTo1o",
    "km-studio-06":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9S91KHroqae2zalKsalAu4JxJIUNMPwwxBqRvxjnQ7cQfNaZ8tY8knVKbHBALLQUyvUN3wzC9-IRXLmu_qjYU2eG-_hDrAAy1MARZ7wzBgS5Kq0YQBksXj_5SEqCKF84hszIzN3ZRqqz_o8",
    "km-studio-07":
        "https://lh3.googleusercontent.com/gps-cs-s/ANWiy9RGQabPl9d9pkDvLS6H-8JgOPfEI8j1ICvHE9qWy-baIyzGZ3RyFDb7ixwSCMOJuxXJWQuYmxub9s1If9N77mJArKx2cta966p6jDrozDLEpLXEcTG4d47mOkobfc3GObJPLxqiL6tKxXPF",
};

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
        "portrait",
        "50% 42%",
    ),
    {
        id: "km-place-07",
        category: "painting",
        src: "/assets/institute/km-place-07.webp",
        fallback: "/assets/institute/km-place-07.jpg",
        alt: "A portrait study of a woman held up in the studio, with the seated model visible in the background",
        caption: "Portrait study in progress",
        width: 1012,
        height: 1800,
        status: "institute",
        source: googleListing,
        crop: "portrait",
        position: "50% 40%",
    },

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
        "portrait",
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

    /* ------------------- NEW WORKS (institute-supplied) -------------------- */
    institute(
        "10",
        "drawing",
        "Papaya — graphite study",
        "Student graphite drawing of a papaya, whole and halved to show the seeds, in a practice workbook",
        900,
        1600,
        "portrait",
        "50% 45%",
    ),
    institute(
        "11",
        "drawing",
        "Two figures — pencil sketch",
        "Student pencil sketch of two figures — a man holding a camera and a woman in a saree",
        900,
        1600,
        "portrait",
        "50% 42%",
    ),
    institute(
        "12",
        "painting",
        "Still life — lamp & book",
        "Student still-life painting of a lit table lamp, a cup on a saucer and spectacles resting on a red book",
        900,
        1600,
        "portrait",
        "50% 45%",
    ),
    institute(
        "13",
        "painting",
        "Seated figure on the easel",
        "Student painting of a seated woman in a red saree on blue paper, displayed on an easel in the studio",
        900,
        1600,
        "portrait",
        "50% 40%",
    ),
    institute(
        "14",
        "painting",
        "Krishna at the flute",
        "Student painting of Krishna with a blue face playing the flute, wearing a striped crown and a peacock feather",
        1600,
        1200,
        "landscape",
        "50% 45%",
    ),
    institute(
        "15",
        "painting",
        "Dancer in motion",
        "Student painting of a classical dancer in a green blouse and flowing orange skirt, arms raised, against a warm golden ground",
        900,
        1600,
        "portrait",
        "50% 42%",
    ),
];

/** Instagram showcase — curated authentic institute photography. */
export const instagramPosts = [    {
        id: "ig-1",
        src: "/assets/institute/km-poster-01.webp",
        fallback: "/assets/institute/km-poster-01.jpg",
        alt: "Kala Mandir Dance N Art Studio class poster listing dance and art classes, contact number and Sector 52, Noida address",
        width: 1200,
        height: 1600,
        status: "institute",
        source: googleListing,
        href: null,
    },
    {
        id: "ig-2",
        src: "/assets/institute/km-place-13.webp",
        fallback: "/assets/institute/km-place-13.jpg",
        alt: "Young students holding up their colourful paintings together in front of the studio wall",
        width: 1600,
        height: 1200,
        status: "institute",
        source: googleListing,
        href: null,
    },
    {
        id: "ig-3",
        src: "/assets/institute/km-place-01.webp",
        fallback: "/assets/institute/km-place-01.jpg",
        alt: "Students practising a dance routine together in the studio",
        width: 464,
        height: 832,
        status: "institute",
        source: googleListing,
        href: null,
    },
    {
        id: "ig-4",
        src: "/assets/institute/km-place-06.webp",
        fallback: "/assets/institute/km-place-06.jpg",
        alt: "Young students stretching on the studio floor during a class",
        width: 1280,
        height: 960,
        status: "institute",
        source: googleListing,
        href: null,
    },
    {
        id: "ig-5",
        src: "/assets/institute/km-place-12.webp",
        fallback: "/assets/institute/km-place-12.jpg",
        alt: "A Kala Mandir art class in session — instructors presenting a landscape painting to children seated at tables",
        width: 1600,
        height: 1200,
        status: "institute",
        source: googleListing,
        href: null,
    },
    {
        id: "ig-6",
        src: "/assets/institute/km-place-14.webp",
        fallback: "/assets/institute/km-place-14.jpg",
        alt: "Young students painting and drawing together at tables in the studio",
        width: 1204,
        height: 1600,
        status: "institute",
        source: googleListing,
        href: null,
    },
];

/**
 * Editorial image slots used by the opening sections.
 * Kept here so a single swap updates intro and showcase together.
 * The hero no longer appears: it now runs on the studio's promotional film
 * (see data/videos.js), so its two painting slots were dropped rather than
 * left dangling. Both files stay in the collection — km-artwork-15 feeds the
 * latest-works strip and km-artwork-02 hangs in the gallery.
 */
export const editorialImages = {
    intro: {
        main: {
            src: "/assets/institute/km-place-14.webp",
            fallback: "/assets/institute/km-place-14.jpg",
            alt: "Young students painting and drawing together at tables in the Kala Mandir studio",
            width: 1204,
            height: 1600,
            status: "institute",
            source: googleListing,
        },
        side: {
            src: "/assets/institute/km-place-12.webp",
            fallback: "/assets/institute/km-place-12.jpg",
            alt: "A Kala Mandir art class in session — two instructors present a landscape painting to children seated at tables, with the studio's artwork and logo on the wall",
            width: 1600,
            height: 1200,
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
            "portrait",
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
            "square",
            "50% 48%",
        ),
    ],
    danceShowcase: {
        // Authentic Kala Mandir studio and class photography, supplied by the
        // institute via its Google Business Profile. Alt text describes only
        // what is visible — no styles, ages or achievements are claimed.
        wide: {
            src: "/assets/institute/km-place-04.webp",
            fallback: "/assets/institute/km-place-04.jpg",
            alt: "Inside the Kala Mandir studio — mirrored walls and an open dance floor",
            width: 1280,
            height: 720,
            status: "institute",
            source: googleListing,
        },
        duo: {
            src: "/assets/institute/km-place-11.webp",
            fallback: "/assets/institute/km-place-11.jpg",
            alt: "Two students in black dance-wear posing after a routine in front of a dark curtain",
            width: 1200,
            height: 1600,
            status: "institute",
            source: googleListing,
        },
        group: {
            src: "/assets/institute/km-place-08.webp",
            fallback: "/assets/institute/km-place-08.jpg",
            alt: "Students in colourful embroidered lehengas holding decorated dandiya sticks during a group dance class, with mirrors and paintings behind",
            width: 1582,
            height: 1600,
            status: "institute",
            source: googleListing,
        },
        zumba: {
            src: "/assets/institute/km-place-09.webp",
            fallback: "/assets/institute/km-place-09.jpg",
            alt: "A student in a black costume with a green tie-and-dye drape holding a classical dance pose in the studio",
            width: 900,
            height: 1600,
            status: "institute",
            source: googleListing,
            position: "50% 25%",
        },
        wedding: {
            src: "/assets/institute/km-place-10.webp",
            fallback: "/assets/institute/km-place-10.jpg",
            alt: "Two students in black dance-wear posing mid-routine in front of a dark curtain",
            width: 1200,
            height: 1600,
            status: "institute",
            source: googleListing,
        },
    },
};

/**
 * studioWalk — a curated filmstrip of real class & studio-life photography
 * (art and dance together), reused by the horizontal-scroll section. Every
 * entry is an existing, institute-supplied record; nothing new is invented and
 * no image is repeated within the strip.
 */
export const studioWalk = [
    editorialImages.intro.side, // class in session
    instagramPosts[5], // students painting together (km-place-14)
    instagramPosts[1], // students holding their paintings (km-place-13)
    editorialImages.danceShowcase.group, // dandiya group class
    instagramPosts[3], // stretching on the studio floor (km-place-06)
    instagramPosts[2], // dance routine in the studio (km-place-01)
    editorialImages.danceShowcase.duo, // dance duo after a routine
    editorialImages.danceShowcase.wedding, // dance duo mid-routine
];

/**
 * studioCard — the institute's own animated card, supplied as a GIF.
 *
 * Held here rather than inlined in the poster so the path, its real 480×270
 * pixel size and its description stay together. There is deliberately no WebP
 * twin: the animation is the whole point of the file.
 */
export const studioCard = {
    id: "km-animated-card",
    src: "/assets/gitfs/Animate_Kala_Mandir_image_animation_20261023165317.gif",
    alt: "Animated studio card: a dancer in a dark costume leaping through a burst of magenta and gold paint beside a wooden palette loaded with brushes, with the words “Where Art Meets Life”, the Kala Mandir logo and a row naming art classes, dance classes and workshops",
    width: 480,
    height: 270,
};

/**
 * studioLife — everyday, institute-supplied photography of the space and the
 * work in progress, used by the "Around the studio" wall below the poster.
 *
 * Each record is authentic Kala Mandir material (Google Business Profile,
 * supplied by the client). Captions and `tag`s describe only what is actually
 * visible and stay within the disciplines the site already names — no student
 * is identified and nothing is invented. `width`/`height` are the delivered
 * pixel dimensions so the wall lays out without shifting.
 */
export const studioLife = [
    {
        id: "km-studio-01",
        src: "/assets/institute/km-studio-01.webp",
        fallback: "/assets/institute/km-studio-01.jpg",
        alt: "A group of young students seated and standing in the studio holding up their colourful paintings, with the Kala Mandir logo and framed artwork on the wall behind",
        caption: "The class, work in hand",
        tag: "Painting",
        width: 1400,
        height: 1050,
        status: "institute",
        source: googleListing,
        position: "50% 45%",
    },
    {
        id: "km-studio-02",
        src: "/assets/institute/km-studio-02.webp",
        fallback: "/assets/institute/km-studio-02.jpg",
        alt: "Students gathered around tables with an instructor, showing handmade paper craft figures with red cone hats, framed portraits on the studio wall behind",
        caption: "A craft session",
        tag: "Craft",
        width: 1400,
        height: 1050,
        status: "institute",
        source: googleListing,
        position: "50% 42%",
    },
    {
        id: "km-studio-03",
        src: "/assets/institute/km-studio-03.webp",
        fallback: "/assets/institute/km-studio-03.jpg",
        alt: "A student modelling seated clay figures at a work table scattered with sculpting tools",
        caption: "Modelling in clay",
        tag: "Craft",
        width: 1050,
        height: 1400,
        status: "institute",
        source: googleListing,
        position: "50% 40%",
    },
    {
        id: "km-studio-04",
        src: "/assets/institute/km-studio-04.webp",
        fallback: "/assets/institute/km-studio-04.jpg",
        alt: "A child's oil-pastel drawing of a panda sitting in grass against a blue and brown background",
        caption: "Panda, in oil pastel",
        tag: "Drawing",
        width: 788,
        height: 1400,
        status: "institute",
        source: googleListing,
        position: "50% 45%",
    },
    {
        id: "km-studio-05",
        src: "/assets/institute/km-studio-05.webp",
        fallback: "/assets/institute/km-studio-05.jpg",
        alt: "A colourful canvas painting of a face partly covered by flowers and leaves, one blue eye showing",
        caption: "Floral portrait on canvas",
        tag: "Painting",
        width: 788,
        height: 1400,
        status: "institute",
        source: googleListing,
        position: "50% 42%",
    },
    {
        id: "km-studio-06",
        src: "/assets/institute/km-studio-06.webp",
        fallback: "/assets/institute/km-studio-06.jpg",
        alt: "A painter at an easel working on a large oil painting of a couple dancing, palette of paints in the foreground",
        caption: "At the easel",
        tag: "Painting",
        width: 788,
        height: 1400,
        status: "institute",
        source: googleListing,
        position: "50% 40%",
    },
    {
        id: "km-studio-07",
        src: "/assets/institute/km-studio-07.webp",
        fallback: "/assets/institute/km-studio-07.jpg",
        alt: "Two students in activewear holding hands and squatting facing each other on the studio floor, framed dance paintings on the wall behind",
        caption: "Warm-up before a routine",
        tag: "Zumba",
        width: 1400,
        height: 1050,
        status: "institute",
        source: googleListing,
        position: "50% 45%",
    },
];
