"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";

/**
 * As each chapter is covered by the next, it settles back (scale + dim) and its
 * photograph drifts — the feeling of a cut rather than a page scroll.
 * Reduced on small screens; skipped entirely for reduced motion.
 */
export function WeddingDayMotion() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      const chapters = gsap.utils.toArray<HTMLElement>("[data-day-chapter]");
      if (cancelled || chapters.length < 2) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", touch: "(max-width: 1023px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        chapters.forEach((chapter, i) => {
          const inner = chapter.querySelector("[data-day-inner]");
          const dim = chapter.querySelector("[data-day-dim]");
          const image = chapter.querySelector("[data-day-image]");
          // Entering: the photograph drifts up into place.
          gsap.fromTo(
            image,
            { yPercent: desktop ? 8 : 4, scale: 1.08 },
            { yPercent: 0, scale: 1, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "top top", scrub: true } },
          );
          // Leaving: settle back beneath the next chapter.
          const next = chapters[i + 1];
          if (!next) return;
          gsap.to(inner, {
            scale: desktop ? 0.9 : 0.95,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
          gsap.to(dim, {
            opacity: 0.65,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true },
          });
        });
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return null;
}
