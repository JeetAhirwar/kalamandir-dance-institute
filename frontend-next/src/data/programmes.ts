/**
 * Programmes — the real class catalogue.
 *
 * Only disciplines the institute actually teaches. No fees, no batch
 * timings, no faculty names — none of those are confirmed, so the Courses
 * page routes all scheduling questions to the enquiry form on purpose.
 */

export type Pillar = "art" | "dance";

export interface Programme {
  id: string;
  pillar: Pillar;
  title: string;
  kicker: string;
  summary: string;
  points: string[];
  image: ReturnType<typeof import("./media").media>;
  route: string; // pillar page -> /art or /dance
}

import { media, artworks, places } from "./media";

export const programmes: Programme[] = [
  {
    id: "art-drawing",
    pillar: "art",
    title: "Art & Drawing",
    kicker: "Foundations of seeing",
    summary:
      "Sketching, portrait drawing and the fundamentals of drawing — line, proportion, light and shade — practised steadily on paper.",
    points: ["Sketching", "Portrait drawing", "Drawing fundamentals"],
    image: artworks.birds,
    route: "/art",
  },
  {
    id: "painting-craft",
    pillar: "art",
    title: "Painting & Art Craft",
    kicker: "Colour, surface, material",
    summary:
      "Oil and acrylic painting alongside creative art and craft — working with colour, texture and materials to build a personal body of work.",
    points: ["Oil painting", "Acrylic painting", "Creative art and craft"],
    image: artworks.saraswati,
    route: "/art",
  },
  {
    id: "dance",
    pillar: "dance",
    title: "Dance",
    kicker: "Movement for every age",
    summary:
      "Dance classes arranged for different age groups, moving from regular practice towards confident performance.",
    points: ["Age-group classes", "Classical & folk vocabulary", "Practice & performance"],
    image: places.danceDuo,
    route: "/dance",
  },
  {
    id: "zumba",
    pillar: "dance",
    title: "Zumba",
    kicker: "Rhythm as fitness",
    summary:
      "High-energy, music-led sessions that make movement feel like a dance floor rather than a workout.",
    points: ["Music-led sessions", "Open to beginners"],
    image: places.danceDuoStill,
    route: "/dance",
  },
  {
    id: "choreography",
    pillar: "dance",
    title: "Wedding & Event Choreography",
    kicker: "Made for the moment",
    summary:
      "Special event and wedding choreography — routines shaped around your song, your people and your stage.",
    points: ["Wedding numbers", "Event performances", "Custom routines"],
    image: places.kidsJump,
    route: "/events",
  },
];

/** Enquiry-form interest options (kept in sync with the programmes). */
export const interestOptions = [
  "Art & Drawing",
  "Painting & Art Craft",
  "Dance",
  "Zumba",
  "Wedding / Event Choreography",
];
