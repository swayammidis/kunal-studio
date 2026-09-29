/**
 * Interlude + wedding-day chapter sequence.
 *
 * Chapter lines are short editorial captions, not claims: they describe the
 * rhythm of a wedding day and use only language the studio already uses
 * (genuine moments, real emotions, timeless stories). The photographs are real
 * Studio Kunal work; captions deliberately do not name couples or places.
 */
import { homePhoto, img } from "./photos";

/** "More than photographs. A feeling." interlude. */
export const statement = {
  words: ["More", "than", "photographs."],
  resolve: "A feeling.",
  image: homePhoto(2),
  alt: "A couple beneath towering gothic arches, lit by a single warm lamp",
};

export const weddingDay = [
  {
    numeral: "I",
    title: "Before the Ceremony",
    line: "The quiet hours — details, nerves and the last look before everything begins.",
    image: img["nooreen-jugraj"][12],
    alt: "A bride in red being helped with her dupatta before the ceremony",
    position: "50% 30%",
  },
  {
    numeral: "II",
    title: "The People",
    line: "The family and friends who make the day yours.",
    image: img["nooreen-jugraj"][8],
    alt: "A couple standing with friends on a grassy hillside",
    position: "50% 40%",
  },
  {
    numeral: "III",
    title: "The Moments",
    line: "An eye for genuine moments — the ones no one planned.",
    image: homePhoto(15),
    alt: "A groom lifting his partner on the shoreline, both laughing",
    position: "50% 55%",
  },
  {
    numeral: "IV",
    title: "The Ceremony",
    line: "Traditions honoured with care, and the authenticity of every moment preserved.",
    image: homePhoto(11),
    alt: "A bride in a red lehenga and her groom in a sherwani, close together in a garden",
    position: "50% 35%",
  },
  {
    numeral: "V",
    title: "The Celebration",
    line: "Real emotions, as they happen.",
    image: homePhoto(7),
    alt: "A newly married couple walking down a flower-lined aisle, hands raised, guests cheering",
    position: "50% 35%",
  },
  {
    numeral: "VI",
    title: "The Party",
    line: "The energy and the colour of the night — captured as it felt.",
    image: img["aman-mrinal"][5],
    alt: "A couple sharing a kiss under warm neon light",
    position: "50% 40%",
  },
  {
    numeral: "VII",
    title: "Afterward",
    line: "What remains — timeless stories that last forever.",
    image: img["raman-akash"][11],
    alt: "A couple sitting together in soft window light",
    position: "50% 45%",
  },
] as const;
