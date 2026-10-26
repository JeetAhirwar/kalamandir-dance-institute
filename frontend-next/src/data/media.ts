/**
 * Central media registry (multi-page edition).
 *
 * Every image is authentic Kala Mandir material — supplied by the institute
 * via its Google Business Profile and re-fetched at `=s1800`, then converted
 * to WebP (q82) with a JPEG fallback. The site never hotlinks.
 *
 * Alt text describes only what is visible. Nothing is presented as something
 * it is not: status is always "institute" here — no stock is used anywhere
 * on this edition of the site.
 */

export interface Media {
  src: string;
  fallback: string;
  alt: string;
  w: number;
  h: number;
  /** Default object-position crop within the frame. */
  pos?: string;
}

const base = "/assets/institute";

function webp(id: string): string {
  return `${base}/${id}.webp`;
}

function jpg(id: string): string {
  return `${base}/${id}.jpg`;
}

export function media(id: string, alt: string, w: number, h: number, pos?: string): Media {
  return { src: webp(id), fallback: jpg(id), alt, w, h, pos };
}

/* ------------------------- artwork (student work) ------------------------ */
export const artworks = {
  stillLife: media(
    "km-artwork-01",
    "Student still-life artwork of clay pots and a coconut on a toned background",
    1350, 1800, "50% 48%",
  ),
  figure: media(
    "km-artwork-02",
    "Colourful student figure painting on a circular canvas — a girl in a white top and red tartan skirt",
    1350, 1800, "50% 45%",
  ),
  madhubani: media(
    "km-artwork-03",
    "A student colouring a Madhubani-style Krishna face artwork at a blue work table",
    1012, 1800, "50% 38%",
  ),
  birds: media(
    "km-artwork-04",
    "Graphite drawing of small birds perched on a leafy branch",
    1012, 1800, "50% 42%",
  ),
  saraswati: media(
    "km-artwork-05",
    "Student painting of the goddess Saraswati seated on a lotus with a white swan, in teal water tones",
    1012, 1800, "50% 42%",
  ),
  clay: media(
    "km-artwork-06",
    "Hand-built clay mural of flowers in raised relief",
    1350, 1800, "50% 46%",
  ),
  whiteCharcoal: media(
    "km-artwork-07",
    "Portrait profile of a woman drawn in white charcoal on grey paper",
    1012, 1800, "50% 40%",
  ),
  twoDancers: media(
    "km-artwork-08",
    "Student painting of two dancers on a circular canvas, against a colourful geometric background",
    1012, 1800, "50% 42%",
  ),
  easel: media(
    "km-artwork-09",
    "A student painter at an easel beside an oil figure study in warm reds and whites",
    1012, 1800, "62% 42%",
  ),
  papaya: media(
    "km-artwork-10",
    "Student graphite drawing of a papaya, whole and halved to show the seeds, in a practice workbook",
    900, 1600, "50% 45%",
  ),
  twoFigures: media(
    "km-artwork-11",
    "Student pencil sketch of two figures — a man holding a camera and a woman in a saree",
    900, 1600, "50% 42%",
  ),
  lamp: media(
    "km-artwork-12",
    "Student still-life painting of a lit table lamp, a cup on a saucer and spectacles resting on a red book",
    900, 1600, "50% 45%",
  ),
  seatedFigure: media(
    "km-artwork-13",
    "Student painting of a seated woman in a red saree on blue paper, displayed on an easel in the studio",
    900, 1600, "50% 40%",
  ),
  krishna: media(
    "km-artwork-14",
    "Student painting of Krishna with a blue face playing the flute, wearing a striped crown and a peacock feather",
    1600, 1200, "50% 45%",
  ),
  dancerMotion: media(
    "km-artwork-15",
    "Student painting of a classical dancer in a green blouse and flowing orange skirt, arms raised, against a warm golden ground",
    900, 1600, "50% 42%",
  ),
};

/* ------------------------------- studio life ----------------------------- */
export const places = {
  danceTrio: media(
    "km-place-01",
    "Three students practising a dance routine together in the studio",
    464, 832, "50% 40%",
  ),
  danceDuo: media(
    "km-place-02",
    "Two students mid-dance-step in the studio, with a wall of student artwork behind",
    1280, 720, "50% 42%",
  ),
  kidsJump: media(
    "km-place-03",
    "Children jumping with joy in the studio, in front of a colourful painted wall",
    832, 464, "50% 45%",
  ),
  danceClassWide: media(
    "km-place-04",
    "Inside the Kala Mandir studio — mirrored walls and an open dance floor",
    1280, 720, "50% 40%",
  ),
  stretching: media(
    "km-place-06",
    "Young students stretching on the studio floor during a class",
    1280, 960, "50% 45%",
  ),
  portraitSession: media(
    "km-place-07",
    "A portrait study of a woman held up in the studio, with the seated model visible in the background",
    1012, 1800, "50% 40%",
  ),
  dandiya: media(
    "km-place-08",
    "Students in colourful embroidered lehengas holding decorated dandiya sticks during a group dance class, with mirrors and paintings behind",
    1582, 1600, "50% 42%",
  ),
  classicalPose: media(
    "km-place-09",
    "A student in a black costume with a green tie-and-dye drape holding a classical dance pose in the studio",
    900, 1600, "50% 25%",
  ),
  danceDuoFull: media(
    "km-place-10",
    "Two students in black dance-wear posing mid-routine in front of a dark curtain",
    1200, 1600, "50% 40%",
  ),
  danceDuoStill: media(
    "km-place-11",
    "Two students in black dance-wear posing after a routine in front of a dark curtain",
    1200, 1600, "50% 40%",
  ),
  artClass: media(
    "km-place-12",
    "A Kala Mandir art class in session — instructors presenting a landscape painting to children seated at tables",
    1600, 1200, "50% 45%",
  ),
  paintingsHeld: media(
    "km-place-13",
    "Young students holding up their colourful paintings together in front of the studio wall",
    1600, 1200, "50% 45%",
  ),
  kidsDrawing: media(
    "km-place-14",
    "Young students painting and drawing together at tables in the studio",
    1204, 1600, "50% 45%",
  ),
};

/* --------------------------------- studio -------------------------------- */
export const studio = {
  groupWithWork: media(
    "km-studio-01",
    "A group of young students in the studio holding up their colourful paintings, with the Kala Mandir logo and framed artwork on the wall behind",
    1400, 1050, "50% 45%",
  ),
  craftSession: media(
    "km-studio-02",
    "Students gathered around tables with an instructor, showing handmade paper craft figures with red cone hats",
    1400, 1050, "50% 42%",
  ),
  clayModelling: media(
    "km-studio-03",
    "A student modelling seated clay figures at a work table scattered with sculpting tools",
    1050, 1400, "50% 40%",
  ),
  pandaPastel: media(
    "km-studio-04",
    "A child's oil-pastel drawing of a panda sitting in grass against a blue and brown background",
    788, 1400, "50% 45%",
  ),
  floralPortrait: media(
    "km-studio-05",
    "A colourful canvas painting of a face partly covered by flowers and leaves, one blue eye showing",
    788, 1400, "50% 42%",
  ),
  dancePaintingEasel: media(
    "km-studio-06",
    "A painter at an easel working on a large oil painting of a couple dancing, palette of paints in the foreground",
    788, 1400, "50% 40%",
  ),
  warmUp: media(
    "km-studio-07",
    "Two students in activewear holding hands and squatting facing each other on the studio floor, framed dance paintings on the wall behind",
    1400, 1050, "50% 45%",
  ),
};

/* --------------------------------- poster -------------------------------- */
export const poster = {
  classPoster: media(
    "km-poster-01",
    "Kala Mandir Dance N Art Studio class poster listing dance and art classes, contact number and Sector 52, Noida address",
    1200, 1600, "50% 40%",
  ),
};

/** Hero fallback visual — festive, colourful, unmistakably Kala Mandir. */
export const heroFallback = places.dandiya;
