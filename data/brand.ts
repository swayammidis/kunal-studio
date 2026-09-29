/**
 * Brand, navigation, hero and contact content.
 *
 * Taken from the current studiokunalphotography.com website. Do not add awards,
 * statistics, venues, prices or reviews that are not published by the studio.
 */
import { homePhoto } from "./photos";

export const brand = {
  name: "Studio Kunal Photography",
  shortName: "Studio Kunal",
  url: "https://studiokunalphotography.com",
  email: "kkunalphotoarts@gmail.com",
  whatsapp: "https://wa.me/19057822743",
  whatsappDisplay: "+1 905 782 2743",
  instagram: "https://www.instagram.com/studiokunal_photography/",
  instagramHandle: "@studiokunal_photography",
  youtube: "https://www.youtube.com/@StudioKunalPhotographyCanada",
  youtubeHandle: "@StudioKunalPhotographyCanada",
  availability: "Bookings Open for 2026–2027",
  descriptors: [
    "Documentary & Editorial Style Wedding Photography",
    "Cinematic Storytelling",
    "Timeless Memories",
    "Limited Dates Available",
  ],
  copyright: "All copyright reserved by Studio Kunal Photography",
} as const;

export const navLinks = [
  { id: "about", label: "About" },
  { id: "stories", label: "Our Stories" },
  { id: "films", label: "Films" },
  { id: "destination", label: "Destination" },
  { id: "investment", label: "Investment" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

export const hero = {
  eyebrow: ["International Wedding", "Photography & Filmmaking"],
  // Rendered line by line. `em` marks the italic accent word.
  headline: [
    [{ t: "From North America" }],
    [{ t: "to " }, { t: "India,", em: true }],
    [{ t: "we capture stories" }],
    [{ t: "that last " }, { t: "forever.", em: true }],
  ],
  support:
    "A cinematic approach with an eye for genuine moments, transforming real emotions into lasting memories.",
  imageDesktop: homePhoto(1),
  imageMobile: homePhoto(12),
};

export const contact = {
  intro: [
    "Feel free to fill out the form below or reach out to us directly via email. If you’re looking to book an appointment, please share as many details as you can about your requirements—this helps us understand your vision better.",
    "We’ll do our best to get back to you as soon as possible and look forward to connecting with you.",
  ],
  success: "Your message was successfully sent!",
  image: homePhoto(27),
  imageAlt: "Bride and groom embracing on a stone landing in a gothic hall",
};

export const menuImage = homePhoto(24);
