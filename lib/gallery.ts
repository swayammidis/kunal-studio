/** Decoupled gallery opener: any component can open a project's fullscreen gallery. */
export type GalleryRequest = { slug: string; index?: number };

export const GALLERY_EVENT = "gallery:open";

export function openGallery(slug: string, index = 0) {
  window.dispatchEvent(new CustomEvent<GalleryRequest>(GALLERY_EVENT, { detail: { slug, index } }));
}
