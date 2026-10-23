/**
 * Motion language for Kala Mandir.
 *
 * The house style is slow, deliberate and art-directed: short interface
 * transitions (180–300ms), gentle opacity/vertical reveals for entrances and
 * nothing that hides content if observers or motion never run.
 */

/** Shared easing — a soft editorial curve. */
export const ease = [0.22, 0.61, 0.36, 1];

/** Section entrance: fade + small rise. */
export const revealUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease },
    },
};

/** Soft-focus entrance: blur clears as the element rises — used sparingly on
 *  a hero line or a pull-quote for a cinematic settle. */
export const revealBlur = {
    hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.85, ease },
    },
};

/** Staggered children (headlines, lists, meta rows). */
export const stagger = (delay = 0, staggerChildren = 0.09) => ({
    hidden: {},
    visible: {
        transition: { delayChildren: delay, staggerChildren },
    },
});

export const staggerItem = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

/** Image mask reveal — a vertical wipe used sparingly on hero/editorial images. */
export const maskReveal = {
    hidden: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.4 },
    visible: {
        clipPath: "inset(0% 0% 0% 0%)",
        opacity: 1,
        transition: { duration: 1.05, ease },
    },
};

/** Horizontal rule that draws itself in. */
export const ruleDraw = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease, delay: 0.1 } },
};

/**
 * Default viewport config for scroll-triggered reveals.
 * `once: true` — nothing re-hides after it has been seen.
 */
export const inView = {
    once: true,
    margin: "0px 0px -12% 0px",
    amount: 0.2,
};

/** Wrapper variants for a whole <section>. */
export const sectionVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

/** Buttons should feel snappy, never springy. */
export const tap = { type: "tween", duration: 0.18, ease };

/* -------------------------------------------------------------------------- */
/*  Cohesive motion spec — one shared vocabulary so the many reveals read as   */
/*  a single system rather than one-off tricks.                                */
/* -------------------------------------------------------------------------- */

/** Shared durations (seconds). */
export const durations = { fast: 0.4, base: 0.6, slow: 0.85 };

/** Shared viewport presets for scroll-triggered reveals. */
export const viewport = { once: true, amount: 0.2 };
export const viewportSoon = { once: true, amount: 0.35 };

/**
 * Two reveal "flavours" that give the two brand worlds distinct motion:
 *   revealCalm    — art: a soft, unhurried rise. The default house entrance.
 *   revealKinetic — dance: more travel, a touch of scale and a snappier,
 *                   more energetic curve, so movement sections feel live.
 */
export const revealCalm = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease } },
};

export const revealKinetic = {
    hidden: { opacity: 0, y: 34, scale: 0.985 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: durations.base, ease: [0.16, 1, 0.3, 1] },
    },
};

