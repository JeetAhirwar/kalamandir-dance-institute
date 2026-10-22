/**
 * Class / programme catalogue.
 *
 * Only the disciplines supplied by the institute are listed here. No fees,
 * schedules, durations, teacher names or qualification claims are published —
 * add them only after the institute confirms them.
 *
 * `anchor` decides where each card links. `interest` pre-selects a matching
 * option in the enquiry form when a visitor arrives from a card.
 */
export const classes = [
    {
        id: "art-drawing",
        index: "01",
        title: "Art & Drawing",
        kicker: "Foundations of seeing",
        interest: "Art",
        anchor: "#art-detail",
        summary:
            "Sketching, portrait drawing and the fundamentals of drawing — line, proportion, light and shade — practised steadily on paper.",
        points: ["Sketching", "Portrait drawing", "Drawing fundamentals"],
        image: {
            src: "/assets/art/art-drawing-fundamentals.webp",
            fallback: "/assets/art/art-drawing-fundamentals.jpg",
            alt: "Hand shading a graphite drawing exercise on paper",
            width: 1200,
            height: 801,
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
        anchor: "#art-detail",
        summary:
            "Oil and acrylic painting alongside creative art and craft — working with colour, texture and materials to build a personal body of work.",
        points: ["Oil painting", "Acrylic painting", "Creative art and craft"],
        image: {
            src: "/assets/painting/paint-palette-tubes.webp",
            fallback: "/assets/painting/paint-palette-tubes.jpg",
            alt: "Palette loaded with oil paint tubes and a palette knife",
            width: 1200,
            height: 801,
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
        anchor: "#dance",
        summary:
            "Dance classes arranged for different age groups, moving from regular practice towards confident performance.",
        points: ["Different age groups", "Practice & performance"],
        image: {
            src: "/assets/dance/dance-group-class.webp",
            fallback: "/assets/dance/dance-group-class.jpg",
            alt: "Group of students practising a dance routine together in a studio",
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
        anchor: "#dance",
        summary:
            "High-energy, music-led sessions that make movement feel like a dance floor rather than a workout.",
        points: ["Music-led sessions", "Open to beginners"],
        image: {
            src: "/assets/dance/zumba-fitness-class.webp",
            fallback: "/assets/dance/zumba-fitness-class.jpg",
            alt: "Instructor leading an energetic group fitness dance class",
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
        anchor: "#enquiry",
        summary:
            "Special event and wedding choreography — routines shaped around your song, your people and your stage.",
        points: ["Wedding numbers", "Event performances", "Custom routines"],
        image: {
            src: "/assets/dance/choreo-couple-lights.webp",
            fallback: "/assets/dance/choreo-couple-lights.jpg",
            alt: "Couple dancing together beneath warm event lights",
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
