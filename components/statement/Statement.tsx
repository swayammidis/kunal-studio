"use client";

import { useEffect, useRef } from "react";
import { statement } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";

/**
 * Interlude between the approach (ivory) and the experience (ink).
 * A sticky stage: the ground darkens, a small framed photograph opens to full
 * bleed, and the words arrive one by one — More / than / photographs. — before
 * resolving into "A feeling." The static markup is the final composed state,
 * so it reads correctly without JavaScript or with reduced motion.
 */
export function Statement() {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      const el = section.current;
      if (cancelled || !el) return;
      const stage = el.querySelector<HTMLElement>("[data-st-stage]");
      const image = el.querySelector<HTMLElement>("[data-st-image]");
      const words = gsap.utils.toArray<HTMLElement>("[data-st-word]", el);
      const resolve = el.querySelector<HTMLElement>("[data-st-resolve]");
      const label = el.querySelector<HTMLElement>("[data-st-label]");
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const { desktop } = ctx.conditions as { desktop: boolean };
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // The stage begins on ivory: keep the header in its light treatment until it darkens.
            onUpdate: (self) => {
              if (self.isActive) document.documentElement.dataset.header = self.progress < 0.1 ? "light" : "dark";
            },
          },
        });
        tl.fromTo(stage, { backgroundColor: "#f2ede4" }, { backgroundColor: "#0d0c0b", duration: 0.18 }, 0)
          .fromTo(label, { color: "#0d0c0b" }, { color: "#cdb894", duration: 0.18 }, 0)
          .fromTo(
            image,
            { clipPath: desktop ? "inset(24% 34% 24% 34%)" : "inset(22% 14% 22% 14%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "power1.inOut" },
            0.08,
          );
        words.forEach((w, i) => {
          tl.fromTo(w, { autoAlpha: 0, yPercent: 40 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.24 + i * 0.12);
        });
        tl.to(words, { autoAlpha: 0.28, duration: 0.1 }, 0.68).fromTo(
          resolve,
          { autoAlpha: 0, yPercent: 30 },
          { autoAlpha: 1, yPercent: 0, duration: 0.12 },
          0.7,
        );
        tl.to({}, { duration: 0.18 });
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <section ref={section} aria-label="More than photographs — a feeling" className="relative h-[240svh] bg-ink md:h-[280svh]">
      <div data-st-stage className="sticky top-0 h-[100svh] overflow-hidden bg-ink">
        <div data-st-image className="absolute inset-0">
          <Photo photo={statement.image} alt={statement.alt} sizes="100vw" className="h-full w-full" position="50% 45%" />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
        </div>

        <p data-st-label className="t-label absolute left-[var(--gutter)] top-[calc(var(--header-h)+24px)] text-champ">
          Interlude
        </p>

        <div className="relative flex h-full flex-col items-center justify-center px-[var(--gutter)] text-center text-ivory">
          <p className="font-serif text-[clamp(3rem,1rem+9vw,10.5rem)] leading-[0.9] tracking-[-0.03em]">
            {statement.words.map((w) => (
              <span key={w} data-st-word className="mx-[0.12em] inline-block">
                {w}
              </span>
            ))}
          </p>
          <p data-st-resolve className="mt-6 font-serif text-[clamp(2.4rem,1rem+6vw,7rem)] italic leading-none text-champ">
            {statement.resolve}
          </p>
        </div>
      </div>
    </section>
  );
}
