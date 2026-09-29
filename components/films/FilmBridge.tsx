"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";

// Covers + one supporting frame per story, interleaved — the portfolio as a reel.
const frames = projects.flatMap((p) => [
  { photo: p.cover, key: `${p.slug}-c` },
  { photo: p.supporting[0], key: `${p.slug}-s` },
]);

/**
 * Transition from Our Stories into Cinematic Films: the photographs run past
 * as a strip of film, driven by scroll. Decorative (the stories are already
 * available above), so it is hidden from assistive technology.
 */
export function FilmBridge() {
  const track = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !track.current || !band.current) return;
      const tween = gsap.fromTo(
        track.current,
        { x: 0 },
        {
          x: () => -(track.current!.scrollWidth - window.innerWidth) * 0.6,
          ease: "none",
          scrollTrigger: { trigger: band.current, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
      revert = () => tween.scrollTrigger?.kill() ?? tween.kill();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <div ref={band} className="relative overflow-hidden bg-gradient-to-b from-transparent to-char py-10 sm:py-14" aria-hidden>
      <div className="wrap mb-5 flex items-center justify-between">
        <span className="t-label text-ivory/45">Contact sheet — Our Stories</span>
        <span className="t-label text-champ">Cinematic Films ↓</span>
      </div>
      <div className="border-y border-[var(--line-dark)] bg-ink py-2">
        <div className="sprockets" />
        <div ref={track} className="flex w-max gap-2 py-2 will-change-transform">
          {frames.map((f) => (
            <div key={f.key} className="relative h-[28vw] max-h-[260px] min-h-[140px] w-[20vw] min-w-[110px] max-w-[190px] shrink-0">
              <Photo photo={f.photo} alt="" sizes="190px" quality={60} className="h-full w-full" imgClassName="grayscale-[35%]" />
            </div>
          ))}
        </div>
        <div className="sprockets" />
      </div>
    </div>
  );
}
