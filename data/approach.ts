/**
 * 01 Our Approach + 02 The Experience + Destination content.
 *
 * Taken from the current studiokunalphotography.com website. Do not add awards,
 * statistics, venues, prices or reviews that are not published by the studio.
 */
import { homePhoto, img } from "./photos";

export const about = {
  paragraphs: [
    "Studio Kunal Photography is an international photography company dedicated to capturing timeless stories with authenticity and emotion.",
    "With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories.",
    "We are proudly based across North America and India, offering seamless photography and cinematography services for couples worldwide.",
    "With a deep understanding of diverse cultures, traditions, and wedding celebrations, we bring a global perspective while preserving the authenticity of every moment.",
  ],
  principles: [
    { title: "Timeless Storytelling", line: "Capturing timeless stories with authenticity and emotion." },
    { title: "Genuine Emotions", line: "An eye for genuine moments, transforming real emotions into lasting memories." },
    { title: "Cinematic Excellence", line: "A cinematic approach to photography and cinematography." },
    { title: "Global Perspective", line: "A global perspective, preserving the authenticity of every moment." },
  ],
  collage: {
    main: homePhoto(5),
    arch: homePhoto(9),
    ceremony: homePhoto(16),
    portrait: homePhoto(8),
  },
};

export const experience = [
  {
    title: "Authentic Moments",
    text: "With a cinematic approach and an eye for genuine moments, we transform real emotions into lasting memories.",
    image: homePhoto(23),
    alt: "Black and white photograph of a bride laughing during her wedding celebration",
  },
  {
    title: "Cultural Understanding",
    text: "With a deep understanding of diverse cultures, traditions, and wedding celebrations, we bring a global perspective while preserving the authenticity of every moment.",
    image: img["house-of-rituals"][4],
    alt: "Groom during a wedding ceremony ritual, guests seated behind",
  },
  {
    title: "Documentary Photography",
    text: "We believe every couple and every celebration is unique, so we take the time to learn about your inspiration, preferences, and story.",
    image: homePhoto(16),
    alt: "Black and white documentary photograph of a couple surrounded by family during their wedding",
  },
  {
    title: "Editorial Photography",
    text: "By combining your vision with our artistic approach, we carefully curate memories that feel natural, timeless, and truly personal.",
    image: img["fashion-vault"][3],
    alt: "Editorial bridal portrait in a red lehenga against carved golden doors",
  },
  {
    title: "Cinematic Storytelling",
    text: "Seamless photography and cinematography services for couples worldwide — capturing timeless stories with authenticity and emotion.",
    image: img["varinder-param"][4],
    alt: "Couple framed by a palace archway at sunset",
  },
  {
    title: "Destination Weddings",
    text: "We love capturing weddings in different locations and cultures, and we are always excited to travel for destination weddings and special events.",
    image: homePhoto(4),
    alt: "Couple standing in front of a calm open horizon",
  },
] as const;

export const destinations = [
  {
    label: "North America",
    index: "N.A.",
    line: "Proudly based across North America.",
    image: homePhoto(17),
    alt: "Couple walking hand in hand across an open field",
  },
  {
    label: "India",
    index: "IN",
    line: "Proudly based across India.",
    image: img["raman-akash"][0],
    alt: "Couple in white standing in front of carved wooden doors",
  },
  {
    label: "Destination Weddings",
    index: "Dest.",
    line: "Always excited to travel for destination weddings and special events.",
    image: img["varinder-param"][0],
    alt: "Couple on a palace terrace under a dusk sky",
  },
] as const;

