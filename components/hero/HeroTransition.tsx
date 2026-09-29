"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";

/**
 * Opening shot → first chapter.
 * As the visitor scrolls, the full-bleed photograph closes into an editorial
 * frame, the words lift away and the ground turns to ivory, handing over
 * seamlessly to "01 — Our Approach". Desktop pins briefly; touch devices get a
 * shorter, unpinned version.
 */
export function HeroTransition() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      const hero = document.getElementById("top");
      const media = hero?.querySelector<HTMLElement>("[data-hero-media]");
      const content = hero?.querySelector<HTMLElement>("[data-hero-content]");
      const caption = hero?.querySelector<HTMLElement>("[data-hero-caption]");
      const marks = hero?.querySelector<HTMLElement>("[data-hero-marks]");
      const layer = hero?.querySelector<HTMLElement>("[data-hero-layer]");
      const shades = hero ? Array.from(hero.querySelectorAll<HTMLElement>("[data-hero-shade]")) : [];
      if (cancelled || !hero || !media || !content) return;
      const root = document.documentElement;
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 1024px)", touch: "(max-width: 1023px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: desktop ? "+=75%" : "bottom top",
            pin: desktop,
            scrub: desktop ? 0.8 : true,
            onUpdate: (self) => {
              // Header switches to its light treatment once the ground is ivory.
              if (desktop && self.isActive) root.dataset.header = self.progress > 0.7 ? "light" : "dark";
            },
          },
        });
        tl.to(content, { yPercent: desktop ? -18 : -10, autoAlpha: 0, duration: 0.5 }, 0)
          .to(marks ?? [], { autoAlpha: 0, duration: 0.3 }, 0)
          .to(layer ?? [], { yPercent: -60, autoAlpha: 0, duration: 0.45 }, 0)
          .fromTo(
            media,
            { clipPath: "inset(0% 0% 0% 0%)" },
            { clipPath: desktop ? "inset(13% 9% 9% 9%)" : "inset(6% 5% 6% 5%)", duration: 1 },
            0,
          )
          .to(shades, { opacity: 0.08, duration: 0.6 }, 0.25)
          .to(hero, { backgroundColor: "#f2ede4", duration: 0.7 }, 0.3);
        if (caption) tl.fromTo(caption, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.7);
        return () => {
          root.dataset.header = "dark";
        };
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
