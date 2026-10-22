/**
 * Class / programme catalogue.
 *
 * Only the disciplines supplied by the institute are listed here. No fees,
 * schedules, durations, teacher names or qualification claims are published —
 * add them only after the institute confirms them.
 *
 * `anchor` decides where each card links. `interest` pre-selects a matching
 * option in the enquiry form when a visitor arrives from a card. `accent`
 * chooses the card's colour accent from the Kala Mandir palette.
 */
export const classes = [
    {
        id: "art-drawing",
        index: "01",
        title: "Art & Drawing",
        kicker: "Foundations of seeing",
        interest: "Art",
        accent: "teal",
        anchor: "#art-detail",
        summary:
            "Sketching, portrait drawing and the fundamentals of drawing — line, proportion, light and shade — practised steadily on paper.",
        points: ["Sketching", "Portrait drawing", "Drawing fundamentals"],
        image: {
            src: "/assets/institute/km-artwork-04.webp",
            fallback: "/assets/institute/km-artwork-04.jpg",
            alt: "Kala Mandir student drawing of birds on a branch, in graphite",
            width: 1012,
            height: 1800,
            status: "institute",
        },
        tone: "light",
        layout: "wide",
    },
    {
        id: "painting-craft",
        index: "02",
        title: "Painting & Art Craft",
        kicker: "Colour, surface, material",
        interest: "Painting",
        accent: "magenta",
        anchor: "#art-detail",
        summary:
            "Oil and acrylic painting alongside creative art and craft — working with colour, texture and materials to build a personal body of work.",
        points: ["Oil painting", "Acrylic painting", "Creative art and craft"],
        image: {
            src: "/assets/institute/km-artwork-05.webp",
            fallback: "/assets/institute/km-artwork-05.jpg",
            alt: "Kala Mandir student painting of Saraswati on a lotus with a white swan",
            width: 1012,
            height: 1800,
            status: "institute",
        },
        tone: "light",
        layout: "tall",
    },
    {
        id: "dance",
        index: "03",
        title: "Dance",
        kicker: "Movement for every age",
        interest: "Dance",
        accent: "coral",
        anchor: "#dance",
        summary:
            "Dance classes arranged for different age groups, moving from regular practice towards confident performance.",
        points: ["Different age groups", "Practice & performance"],
        image: {
            src: "/assets/dance/dance-group-class.webp",
            fallback: "/assets/dance/dance-group-class.jpg",
            alt: "Group of students practising a dance routine together in a studio (placeholder image)",
            width: 1300,
            height: 867,
        },
        tone: "dark",
        layout: "wide",
    },
    {
        id: "zumba",
        index: "04",
        title: "Zumba",
        kicker: "Rhythm as fitness",
        interest: "Zumba",
        accent: "orange",
        anchor: "#dance",
        summary:
            "High-energy, music-led sessions that make movement feel like a dance floor rather than a workout.",
        points: ["Music-led sessions", "Open to beginners"],
        image: {
            src: "/assets/dance/zumba-fitness-class.webp",
            fallback: "/assets/dance/zumba-fitness-class.jpg",
            alt: "Instructor leading an energetic group fitness dance class (placeholder image)",
            width: 1300,
            height: 866,
        },
        tone: "dark",
        layout: "tall",
    },
    {
        id: "choreography",
        index: "05",
        title: "Wedding & Event Choreography",
        kicker: "Made for the moment",
        interest: "Wedding / Event Choreography",
        accent: "blue",
        anchor: "#enquiry",
        summary:
            "Special event and wedding choreography — routines shaped around your song, your people and your stage.",
        points: ["Wedding numbers", "Event performances", "Custom routines"],
        image: {
            src: "/assets/dance/choreo-couple-lights.webp",
            fallback: "/assets/dance/choreo-couple-lights.jpg",
            alt: "Couple dancing together beneath warm event lights (placeholder image)",
            width: 1300,
            height: 867,
        },
        tone: "dark",
        layout: "full",
    },
];

/** Short list used by the footer and the dance showcase. */
export const classLinks = classes.map((c) => ({
    label: c.title,
    href: c.anchor,
    interest: c.interest,
}));
