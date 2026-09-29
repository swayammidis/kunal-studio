/**
 * Studio Kunal Photography — site content.
 *
 * Every string in this file is taken from the current studiokunalphotography.com
 * website (home, portfolio, investment, testimonials, get-in-touch pages).
 * Do not add awards, statistics, venues, prices or reviews that are not published
 * by the studio.
 */
import images from "./images.json";

export type Photo = { src: string; width: number; height: number; blur: string };

const home = images.home as Photo[];
const img = images as unknown as Record<string, Photo[]> & { films: Record<string, Photo> };

/** 1-indexed helper for the homepage image set. */
export const homePhoto = (n: number) => home[n - 1];

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

export type Project = {
  slug: string;
  title: string;
  subtitle?: string;
  cover: Photo;
  supporting: [Photo, Photo];
  gallery: Photo[];
  tone: string;
};

const project = (
  slug: string,
  title: string,
  subtitle: string | undefined,
  coverIdx: number,
  supportIdx: [number, number],
  tone: string,
): Project => ({
  slug,
  title,
  subtitle,
  cover: img[slug][coverIdx],
  supporting: [img[slug][supportIdx[0]], img[slug][supportIdx[1]]],
  gallery: img[slug],
  tone,
});

export const projects: Project[] = [
  project("varinder-param", "Varinder & Param", "Noor Mahal", 4, [1, 6], "#15100c"),
  project("aman-mrinal", "Aman & Mrinal", undefined, 1, [0, 4], "#0f1214"),
  project("nooreen-jugraj", "Nooreen & Jugraj", undefined, 0, [4, 6], "#111310"),
  project("deep-payal", "Deep & Payal", undefined, 1, [4, 5], "#14110e"),
  project("house-of-rituals", "The House of Rituals", "India", 0, [3, 6], "#131111"),
  project("fashion-vault", "The Fashion Vault", undefined, 3, [2, 5], "#160f0c"),
  project("akshita-rajat", "Akshita & Rajat", undefined, 4, [0, 3], "#101113"),
  project("raman-akash", "Raman & Akash", "Love Straight Outta Panjab", 2, [0, 3], "#14100c"),
];

export const films = [
  "qhmxcS6rbzY",
  "GE4RwB_Ezf8",
  "PK30ZglbXJQ",
  "EEFd2OHEV6A",
  "V50vQEXenaE",
  "MkhER4Ob6dA",
  "ZT4f1XDbmDg",
  "4djvYWzA-LY",
  "YBAhqOTVLH4",
].map((id, i) => ({ id, number: i + 1, poster: img.films[id] }));

export const investment = {
  paragraphs: [
    "We believe every celebration is unique, and so is our approach to pricing.",
    "Rather than offering fixed packages, we provide customized pricing tailored to your needs, vision, and event details.",
    "Each quote is thoughtfully curated based on your requirements, location, and the story you want us to capture — ensuring you receive a personalized experience that truly reflects your moments.",
  ],
  considers: ["Your needs", "Your vision", "Event details", "Location", "The story you want us to capture"],
  image: img["fashion-vault"][6],
  imageAlt: "Bride seated beneath a red canopy in front of ornate golden doors",
};

export type Testimonial = { names: string; text: string[]; slug?: string; photo?: Photo };

export const testimonials: Testimonial[] = [
  {
    names: "Deep & Payal",
    slug: "deep-payal",
    photo: img["deep-payal"][0],
    text: [
      "We cannot thank our photographer enough for the incredible work he did throughout our entire wedding journey — from the pre-wedding shoot to Haldi, Mehndi, wedding ceremonies, and reception. Every single picture came out absolutely beautiful, clear, and full of life. Whenever we look at the photos, it genuinely feels like we are reliving those moments all over again.",
      "What made the experience even more special was how smooth and stress-free the entire process was. He guided us so calmly and patiently through every event, always letting us know what to do and making us feel comfortable in front of the camera. His professionalism, creativity, and positive energy truly stood out.",
      "More than just a photographer, he became like family to us during this journey. The care, dedication, and effort he put into capturing every emotion and detail meant so much to us and our families.",
      "A huge thank you for giving us memories that we will cherish forever. We are beyond grateful and would highly recommend him to anyone looking for someone who captures not just pictures, but emotions and moments perfectly.",
      "Thank you kunal ❤️❤️",
    ],
  },
  {
    names: "Hiral & Hardik",
    text: [
      "Absolutely loved their work. Fantastic art, very efficient, consistent and joy to work with. I would highly recommend Studio Kunal if you’re looking for reliable, superb and professional services. Awesome photos and videos. Loved it.",
    ],
  },
  {
    names: "Antarjot & Harleen",
    text: [
      "We had an incredible experience with Studio Kunal for both our pre-wedding and wedding shoots. Not only did he capture every moment beautifully, but he also went above and beyond by personally taking care of the dresses we selected, ensuring they looked perfect in every shot. He even curated the songs for our highlight videos, adding a personal touch that made our memories even more special. On top of that, he helped plan a surprise proposal with my husband, which was an unforgettable moment for me. His creativity, attention to detail, and professionalism truly made the whole experience amazing. Highly recommend him for any occasion.",
    ],
  },
  {
    names: "Akshita & Rajat",
    slug: "akshita-rajat",
    photo: img["akshita-rajat"][4],
    text: [
      "Amazing job by Kunal! He did a fantastic job with our pre-wedding photoshoot in Toronto. Kunal was very professional, patient, and made us feel comfortable throughout the shoot. He captured every moment beautifully and the pictures turned out perfect. His attention to detail and creativity really shows in his work. Highly recommend Kunal Studio Photography for anyone looking to capture their special moments!",
    ],
  },
  {
    names: "Simran & Amogh",
    text: [
      "I couldn’t be happier with the energy and enthusiasm Kunal brought to my proposal shoot! He was incredibly kind and made the entire experience feel so natural and enjoyable. Despite it being our first time taking professional photos, Kunal went above and beyond to ensure both my fiancé and I felt completely comfortable. His warmth and professionalism truly made this special moment even more memorable. Highly recommend!",
    ],
  },
  {
    names: "Jennifer & Vinayak",
    text: [
      "We had the pleasure of working with Kunal and his Team for our wedding, and they truly exceeded all expectations. From photography to videography, they captured every moment with incredible creativity and attention to detail.",
      "One of the standout aspects of their work was the artistic flair they brought to both the photos and video. Every frame felt thoughtful and beautifully composed, telling the story of our special day in a way that felt personal and cinematic.",
      "The editing was exceptional—natural, elegant, and perfectly timed. We were also really impressed with their turnaround time; everything was delivered promptly without compromising on quality.",
      "Most importantly, Kunal and his team were professional, warm, and easy to work with throughout the entire process. They made us feel completely at ease in front of the camera and blended seamlessly into the day.",
      "We’re so grateful to have had them document such an important chapter of our lives, and we would wholeheartedly recommend them to anyone looking for a talented and reliable wedding team.",
      "Thank you, Kunal and his team, for turning our memories into something truly timeless.",
    ],
  },
  {
    names: "Nisha & Jonpreet",
    text: [
      "“Oh my God, we absolutely love the photos! 😍”",
      "From the moment we saw the preview images, we were completely blown away. Every picture captured the emotions and special moments so beautifully. The attention to detail, the natural expressions, and the way everything was framed truly shows your passion and talent.",
      "Working with you and the team was such a wonderful experience, and the results speak for themselves. We honestly can’t stop looking at the photos and reliving those moments again and again. We’re already so impressed with the previews and can’t wait to see the full gallery!",
    ],
  },
  {
    names: "Rubal & Ajwinder",
    text: [
      "We had the pleasure of working with Studio Kunal Photography for our pre-wedding shoot, and the experience was nothing short of amazing! Kunal and his team are true professionals with a keen eye for detail and a creative approach that made every shot feel magical.",
      "From the very beginning, they made us feel comfortable and guided us through poses and locations, ensuring we looked our absolute best. The team was punctual, patient, and went above and beyond to capture the essence of our relationship in every frame.",
      "The photos turned out breathtakingly beautiful, with stunning edits that perfectly captured the emotions and atmosphere of the moment. They truly have a gift for storytelling through their lens, and their work exceeded all our expectations.",
      "If you’re looking for a photographer who is talented, friendly, and dedicated to delivering exceptional results, Studio Kunal Photography is the way to go. Highly recommended for any couple looking to create lasting memories!",
    ],
  },
];

export const faqIntro =
  "Frequently asked questions from clients and answers to them. If you have any questions, let us know either while filling up the form or during the consultation.";

export const faqs = [
  {
    q: "What is the delivery timeline for photos and videos?",
    a: "Our standard delivery timeline for the final gallery is 10–12 weeks after your event. This allows us to carefully review, select, and professionally edit each image to ensure the highest quality and storytelling experience.",
  },
  {
    q: "What photography style do we follow?",
    a: "Our approach is centered around understanding your vision first. We believe every couple and every celebration is unique, so we take the time to learn about your inspiration, preferences, and story. By combining your vision with our artistic approach, we carefully curate memories that feel natural, timeless, and truly personal.",
  },
  {
    q: "Do you offer customised packages?",
    a: "Yes. Every event is different, which is why we provide customised packages tailored to your needs, vision, and celebration. Once we understand your event details, we create a proposal that best fits your requirements.",
  },
  {
    q: "Do we travel for destination weddings?",
    a: "Yes, absolutely. We love capturing weddings in different locations and cultures. Studio Kunal Photography operates across North America and India, and we are always excited to travel for destination weddings and special events.",
  },
  {
    q: "How can a client book us for their event?",
    a: "You can simply fill out the Get in Touch form on our website with your event details. Once we receive your inquiry, we will connect with you to discuss your requirements and guide you through the booking process.",
  },
];

export const contact = {
  intro: [
    "Feel free to fill out the form below or reach out to us directly via email. If you’re looking to book an appointment, please share as many details as you can about your requirements—this helps us understand your vision better.",
    "We’ll do our best to get back to you as soon as possible and look forward to connecting with you.",
  ],
  success: "Your message was successfully sent!",
  image: homePhoto(7),
  imageAlt: "Bride and groom walking down a flower-lined aisle surrounded by guests",
};

export const menuImage = homePhoto(24);
