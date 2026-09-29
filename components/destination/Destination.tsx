"use client";

import { useEffect, useRef } from "react";
import { destinations } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { CtaLink } from "@/components/ui/CtaLink";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { pad } from "@/lib/utils";
import { SectionMark } from "@/components/ui/SectionMark";

const ROUTE = "M20 90 C 150 10, 250 10, 300 60 S 470 110, 580 30";

function Route({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 120" className={className} fill="none" aria-hidden>
      <path data-route-geo d={ROUTE} stroke="currentColor" strokeOpacity="0.18" strokeDasharray="2 6" />
      <path data-route d={ROUTE} stroke="var(--champ)" strokeWidth="1" pathLength={1} strokeDasharray="1" strokeDashoffset="0" />
      {[
        [20, 90, "N.A."],
        [300, 60, "IN"],
        [580, 30, "DEST."],
      ].map(([x, y, t]) => (
        <g key={t as string}>
          <circle cx={x as number} cy={y as number} r="4.5" fill="var(--ink)" stroke="var(--champ)" />
          <text x={x as number} y={(y as number) + 26} fill="currentColor" fillOpacity="0.6" fontSize="11" letterSpacing="2.5" textAnchor="middle" fontFamily="var(--font-text)">
            {t}
          </text>
        </g>
      ))}
      {/* The plane travels the route with scroll (static at India without motion). */}
      <g data-plane transform="translate(300 60) rotate(12)">
        <path d="M-8 -5.5 L10 0 L-8 5.5 L-4 0 Z" fill="var(--champ)" />
      </g>
    </svg>
  );
}

export function Destination() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  // Desktop: pinned horizontal journey.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !section.current || !track.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-hparallax]", el).forEach((img) => {
          gsap.fromTo(img, { xPercent: -8 }, {
            xPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          });
        });
        flyRoutes(gsap, section.current!.querySelector("[data-route-desktop]"), {
          trigger: section.current,
          start: "top 60%",
          end: () => `+=${distance() * 0.8}`,
        });
      });
      mm.add("(max-width: 1023px)", () => {
        const svg = section.current!.querySelector<HTMLElement>("[data-route-mobile]");
        flyRoutes(gsap, svg, { trigger: svg, start: "top 85%", end: "top 25%" });
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  // Touch: progress indicator for the swipe rail.
  const onRailScroll = () => {
    const el = track.current;
    if (!el || !progress.current) return;
    const max = el.scrollWidth - el.clientWidth;
    progress.current.style.transform = `scaleX(${max > 0 ? Math.max(0.1, el.scrollLeft / max) : 1})`;
  };

  return (
    <section ref={section} id="destination" aria-label="Destination weddings — North America and India" className="theme-dark relative overflow-hidden lg:h-[100svh]">
      {/* Mobile / tablet intro */}
      <div className="wrap pb-10 pt-[clamp(72px,12vw,120px)] lg:hidden">
        <SectionMark number="05" label="Destination Weddings" />
        <h2 className="t-h2 mt-6" data-reveal="fade">
          Based across <em className="serif-em">North America &amp; India.</em>
        </h2>
        <p className="t-body mt-6 max-w-[30rem] text-ivory/70" data-reveal="fade">
          Studio Kunal Photography operates across North America and India, and we are always excited to travel for destination weddings and special events.
        </p>
        <div data-route-mobile>
          <Route className="mt-10 w-full max-w-[520px] text-ivory" />
        </div>
      </div>

      <div
        ref={track}
        onScroll={onRailScroll}
        className="flex gap-4 pb-4 max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto max-lg:px-[var(--gutter)] max-lg:[scrollbar-width:none] lg:h-full lg:gap-0 lg:pb-0 lg:will-change-transform"
        tabIndex={0}
        role="region"
        aria-label="Where we work — swipe to explore"
      >
        {/* Desktop intro panel */}
        <div className="hidden h-full w-[52vw] shrink-0 flex-col justify-center pl-[var(--gutter)] pr-[6vw] lg:flex">
          <SectionMark number="05" label="Destination Weddings" />
          <h2 className="t-h2 mt-8">
            Based across
            <br />
            <em className="serif-em">North America &amp; India.</em>
          </h2>
          <p className="t-body mt-8 max-w-[32rem] text-ivory/70">
            Studio Kunal Photography operates across North America and India, and we are always excited to travel for destination weddings and special events.
          </p>
          <div data-route-desktop>
            <Route className="mt-14 w-full max-w-[560px] text-ivory" />
          </div>
        </div>

        {destinations.map((d, i) => (
          <article
            key={d.label}
            className="relative w-[84vw] shrink-0 snap-center sm:w-[60vw] lg:h-full lg:w-[70vw] lg:py-[11vh] lg:pr-[3vw]"
            aria-label={d.label}
          >
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/5] lg:aspect-auto lg:h-full">
              <div data-hparallax className="absolute inset-y-0 -left-[10%] -right-[10%]">
                <Photo photo={d.image} alt={d.alt} sizes="(min-width:1024px) 80vw, 90vw" className="h-full w-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="frame-marks m-4 text-ivory/60" aria-hidden>
                <i />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 sm:p-8 lg:p-10">
                <div>
                  <p className="t-label text-champ">
                    {pad(i + 1)} — {d.index}
                  </p>
                  <h3 className="mt-3 font-serif text-[clamp(2.2rem,1.2rem+4vw,6.5rem)] leading-[0.92]">{d.label}</h3>
                </div>
                <p className="t-body hidden max-w-[16rem] text-right text-ivory/75 md:block">{d.line}</p>
              </div>
            </div>
          </article>
        ))}

        {/* Closing panel */}
        <div className="flex w-[70vw] shrink-0 snap-center flex-col justify-center sm:w-[44vw] lg:h-full lg:w-[38vw] lg:px-[4vw]">
          <p className="t-label text-champ">Global Perspective</p>
          <p className="t-h3 mt-6">
            A global perspective, preserving the <em className="serif-em">authenticity</em> of every moment.
          </p>
          <div className="mt-10">
            <CtaLink href="#stories" variant="ghost-dark" cursor="View work →">
              Explore Our Stories
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Swipe progress — touch layouts */}
      <div className="wrap pb-[clamp(72px,12vw,120px)] pt-6 lg:hidden" aria-hidden>
        <div className="flex items-center gap-4">
          <span className="t-label text-ivory/60">Swipe</span>
          <span className="relative h-px flex-1 bg-ivory/15">
            <span ref={progress} className="absolute inset-0 origin-left scale-x-[0.1] bg-champ transition-transform duration-300" />
          </span>
        </div>
      </div>
    </section>
  );
}

type Gsap = typeof import("gsap").gsap;

/** Draw the route and fly the plane along it, scrubbed by the given trigger. */
function flyRoutes(gsap: Gsap, scope: Element | null, st: Record<string, unknown>) {
  if (!scope) return;
  const line = scope.querySelector<SVGPathElement>("[data-route]");
  const geo = scope.querySelector<SVGPathElement>("[data-route-geo]");
  const plane = scope.querySelector<SVGGElement>("[data-plane]");
  if (!line || !geo || !plane) return;
  const length = geo.getTotalLength();
  const state = { p: 0 };
  gsap.fromTo(
    state,
    { p: 0 },
    {
      p: 1,
      ease: "none",
      scrollTrigger: { ...st, scrub: true },
      onUpdate: () => {
        const d = Math.max(0.001, Math.min(0.999, state.p)) * length;
        const a = geo.getPointAtLength(d);
        const b = geo.getPointAtLength(Math.min(length, d + 1));
        const angle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        plane.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);
        line.style.strokeDashoffset = String(1 - state.p);
      },
    },
  );
}
