/**
 * 04 Cinematic Films — the YouTube films from the Cinematic Films page (untitled on the site).
 *
 * Taken from the current studiokunalphotography.com website. Do not add awards,
 * statistics, venues, prices or reviews that are not published by the studio.
 */
import { img } from "./photos";

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

