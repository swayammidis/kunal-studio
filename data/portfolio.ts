/**
 * 03 Our Stories — the real Studio Kunal portfolio projects.
 *
 * Taken from the current studiokunalphotography.com website. Do not add awards,
 * statistics, venues, prices or reviews that are not published by the studio.
 */
import { img, type Photo } from "./photos";

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

