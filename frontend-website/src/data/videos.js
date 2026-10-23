/**
 * The institute's promotional clip, referenced from one place so the hero and
 * the studio panel share a single network request for the same file.
 *
 * The hero plays the full film. The studio panel uses the dark
 * brush-on-canvas passage (2.75s–5.15s); 2.8s–5.1s is bright white canvas, and
 * 7.9s onward is the burned-in end card, which the panel skips.
 */
const SRC = "/assets/video/Promotional_video_for_art_institute-clip-1_20261023162105.mp4";

export const instituteVideo = {
    src: SRC,

    /** The whole film, looped natively. Dark enough to hold white type. */
    hero: { start: 0, stillAt: 1.3 },

    /** Paintbrush laying magenta paint, dissolving into the easel class.
     *  The colourful passage — used inside the framed studio panel. Starts
     *  just after the cut to the canvas so the panel opens on the brush. */
    studio: {
        start: 2.75,
        end: 5.15,
        stillAt: 3.5,
        poster: "/assets/video/promo-studio-poster.jpg",
    },
};
