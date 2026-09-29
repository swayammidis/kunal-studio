"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { openGallery } from "@/components/gallery/events";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { getLenis } from "@/lib/scroll";
import { cx, pad } from "@/lib/utils";

type Props = { projects: Project[] };

/** Shared state for the stacked title / counter transitions. */
const stackState = (i: number, active: number) => (i === active ? "in" : i < active ? "past" : "next");

export function StoriesExhibit({ projects }: Props) {
  const total = projects.length;
  const [active, setActive] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const triggerRef = useRef<{ start: number; end: number } | null>(null);

  // ---- Desktop: pin the exhibit and map scroll progress to the active story.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !pinRef.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.75 * (total - 1)}`,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.round(self.progress * (total - 1)));
            // Horizontal drift of the ghost title track, continuous with scroll.
            const g = ghostRef.current;
            if (g) g.style.transform = `translate3d(${-self.progress * Math.max(0, g.scrollWidth - window.innerWidth)}px,0,0)`;
          },
          onRefresh: (self) => (triggerRef.current = { start: self.start, end: self.end }),
        });
        triggerRef.current = { start: st.start, end: st.end };
        return () => {
          triggerRef.current = null;
        };
      });
      revert = () => mm.revert();
    });
    return () => {
      cancelled = true;
      revert?.();
    };
  }, [total]);

  /** Jump to a story: scrolls to its position inside the pin, or just switches when not pinned. */
  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(total - 1, i));
      const t = triggerRef.current;
      if (t) {
        const y = t.start + ((t.end - t.start) * idx) / (total - 1);
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { duration: 1.2 });
        else window.scrollTo({ top: y, behavior: "smooth" });
      } else {
        setActive(idx);
      }
    },
    [total],
  );

  const current = projects[active];

  // The whole section takes on the active story's tone.
  useEffect(() => {
    const section = pinRef.current?.closest("section");
    if (section) section.style.backgroundColor = current.tone;
  }, [current.tone]);

  return (
    <>
      {/* ================= Desktop exhibit ================= */}
      <div
        ref={pinRef}
        className="relative hidden h-[100svh] lg:block"
      >
        {/* Ghost titles — the whole exhibition drifting sideways behind the frames */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[6vh] overflow-hidden" aria-hidden>
          <div ref={ghostRef} className="flex w-max gap-[6vw] whitespace-nowrap pl-[var(--gutter)] will-change-transform">
            {projects.map((p, i) => (
              <span
                key={p.slug}
                className={cx(
                  "font-serif text-[clamp(6rem,13vw,15rem)] leading-none tracking-[-0.03em] text-transparent transition-opacity duration-700 [-webkit-text-stroke:1px_rgb(242_237_228/0.14)]",
                  i === active ? "opacity-100" : "opacity-50",
                )}
              >
                {p.title}
              </span>
            ))}
          </div>
        </div>

        <div className="wrap relative grid h-full grid-cols-12 gap-x-8 pb-[5vh] pt-[calc(var(--header-h)+4vh)]">
          {/* Left: counter, title, index */}
          <div className="col-span-4 flex min-h-0 flex-col justify-between">
            <div>
              <div className="flex items-end gap-3 font-serif leading-none" aria-hidden>
                <span className="relative grid overflow-hidden text-[clamp(4.5rem,7vw,8rem)]">
                  {projects.map((p, i) => (
                    <span
                      key={p.slug}
                      className="[grid-area:1/1] transition-transform duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] data-[s=next]:translate-y-full data-[s=past]:-translate-y-full"
                      data-s={stackState(i, active)}
                    >
                      {pad(i + 1)}
                    </span>
                  ))}
                </span>
                <span className="t-label mb-3 text-ivory/50">/ {pad(total)}</span>
              </div>

              <div className={cx("relative mt-8 grid transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]", hover && "translate-x-3")} aria-live="polite">
                {projects.map((p, i) => (
                  <div
                    key={p.slug}
                    className="[grid-area:1/1] overflow-hidden"
                    aria-hidden={i !== active}
                  >
                    <div
                      className="transition-[transform,opacity] duration-[1000ms] ease-[cubic-bezier(0.19,1,0.22,1)] data-[s=next]:translate-y-[105%] data-[s=next]:opacity-0 data-[s=past]:-translate-y-[105%] data-[s=past]:opacity-0"
                      data-s={stackState(i, active)}
                    >
                      <h3 className="font-serif text-[clamp(2.6rem,4.2vw,4.75rem)] leading-[0.95] tracking-[-0.015em]">{p.title}</h3>
                      <p className="t-label mt-4 h-4 text-champ">{p.subtitle ?? "A Studio Kunal Story"}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => openGallery(current.slug)}
                className="btn btn-ghost-dark mt-10"
                data-cursor="View story →"
                data-magnetic
              >
                <span>View Story</span>
                <span className="arrow" aria-hidden>
                  →
                </span>
              </button>
            </div>

            {/* Index */}
            <nav aria-label="Stories index" className="mt-8">
              <ol className="border-t border-[var(--line-dark)]">
                {projects.map((p, i) => (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={i === active}
                      className={cx(
                        "group flex w-full items-center gap-4 border-b border-[var(--line-dark)] py-[0.55rem] text-left transition-colors duration-500",
                        i === active ? "text-ivory" : "text-ivory/40 hover:text-ivory/80",
                      )}
                    >
                      <span className="t-label w-6 tabular-nums">{pad(i + 1)}</span>
                      <span className="text-[0.82rem] tracking-[0.04em]">{p.title}</span>
                      <span
                        className={cx(
                          "ml-auto h-px bg-champ transition-[width] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]",
                          i === active ? "w-10" : "w-0 group-hover:w-4",
                        )}
                        aria-hidden
                      />
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Centre: featured frame */}
          <div className="col-span-5 flex min-h-0 items-center justify-center">
            <button
              type="button"
              onClick={() => openGallery(current.slug)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              className="group relative aspect-[4/5] h-full max-h-[78svh] max-w-full overflow-hidden"
              aria-label={`Open the ${current.title} gallery`}
              data-cursor="View story →"
            >
              {projects.map((p, i) => (
                <div
                  key={p.slug}
                  data-s={stackState(i, active)}
                  className="absolute inset-0 transition-[clip-path] duration-[1300ms] ease-[cubic-bezier(0.77,0,0.18,1)] data-[s=in]:z-[2] data-[s=next]:z-[3] data-[s=past]:z-[1] data-[s=in]:[clip-path:inset(0_0_0_0)] data-[s=next]:[clip-path:inset(100%_0_0_0)] data-[s=past]:[clip-path:inset(0_0_0_0)]"
                >
                  <Photo
                    photo={p.cover}
                    alt={`${p.title} — ${p.subtitle ?? "story"} by Studio Kunal Photography`}
                    sizes="(min-width:1024px) 34vw, 1px"
                    className="h-full w-full"
                    imgClassName={cx(
                      "transition-transform duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.035]",
                      i === active ? "scale-100" : "scale-110",
                    )}
                  />
                </div>
              ))}
              <span className="absolute inset-0 z-[4] bg-ink/0 transition-colors duration-700 group-hover:bg-ink/20" aria-hidden />
              <span className="frame-marks z-[5] m-4 text-ivory/70" aria-hidden>
                <i />
              </span>
              <span
                className="absolute bottom-6 right-6 z-[5] grid h-20 w-20 place-items-center rounded-full border border-ivory/60 text-lg text-ivory transition-[transform,background-color,color] duration-700 group-hover:rotate-[-45deg] group-hover:bg-ivory group-hover:text-ink"
                aria-hidden
              >
                →
              </span>
            </button>
          </div>

          {/* Right: supporting frames */}
          <div className="col-span-3 flex min-h-0 flex-col justify-between">
            <div className="relative ml-auto aspect-[4/5] w-[88%]">
              {projects.map((p, i) => (
                <div
                  key={p.slug}
                  className={cx(
                    "absolute inset-0 transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    i === active ? "opacity-100" : "translate-y-6 opacity-0",
                  )}
                  aria-hidden
                >
                  <Photo photo={p.supporting[0]} alt="" sizes="(min-width:1024px) 20vw, 1px" className="h-full w-full" />
                </div>
              ))}
            </div>
            <div className="relative aspect-square w-[62%]">
              {projects.map((p, i) => (
                <div
                  key={p.slug}
                  className={cx(
                    "absolute inset-0 transition-[opacity,transform] delay-150 duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    i === active ? "opacity-100" : "-translate-y-6 opacity-0",
                  )}
                  aria-hidden
                >
                  <Photo photo={p.supporting[1]} alt="" sizes="(min-width:1024px) 14vw, 1px" className="h-full w-full" />
                </div>
              ))}
            </div>
            {/* Progress */}
            <div className="flex items-center gap-4" aria-hidden>
              <span className="relative h-px flex-1 bg-ivory/15">
                <span
                  className="absolute inset-0 origin-left bg-champ transition-transform duration-700"
                  style={{ transform: `scaleX(${(active + 1) / total})` }}
                />
              </span>
              <span className="flex gap-2">
                <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} className="grid h-10 w-10 place-items-center border border-[var(--line-dark)] transition-opacity disabled:opacity-30" aria-label="Previous story" tabIndex={-1}>
                  ←
                </button>
                <button type="button" onClick={() => goTo(active + 1)} disabled={active === total - 1} className="grid h-10 w-10 place-items-center border border-[var(--line-dark)] transition-opacity disabled:opacity-30" aria-label="Next story" tabIndex={-1}>
                  →
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Touch / tablet rail ================= */}
      <MobileRail projects={projects} />
    </>
  );
}

function MobileRail({ projects }: Props) {
  const rail = useRef<HTMLOListElement>(null);
  const [idx, setIdx] = useState(0);
  const total = projects.length;

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 16;
    setIdx(Math.max(0, Math.min(total - 1, Math.round(el.scrollLeft / step))));
  };
  const step = (dir: number) => {
    const el = rail.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (el && card) el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: "smooth" });
  };

  return (
    <div className="lg:hidden">
      <ol ref={rail} onScroll={onScroll} className="rail gap-4 px-[var(--gutter)] pb-2" aria-label="Our stories">
        {projects.map((p, i) => (
          <li key={p.slug} className="w-[80vw] max-w-[440px] sm:w-[46vw]">
            <button type="button" onClick={() => openGallery(p.slug)} className="block w-full text-left" aria-label={`Open the ${p.title} gallery`}>
              <div className="relative">
                <Photo
                  photo={p.cover}
                  alt={`${p.title} — ${p.subtitle ?? "story"} by Studio Kunal Photography`}
                  sizes="(min-width:640px) 46vw, 80vw"
                  className="aspect-[4/5]"
                />
                <span className="frame-marks m-3 text-ivory/70" aria-hidden>
                  <i />
                </span>
                <span className="t-label absolute left-4 top-4 text-ivory/90">
                  {pad(i + 1)} / {pad(total)}
                </span>
              </div>
              <span className="mt-4 block font-serif text-[clamp(1.8rem,7vw,2.4rem)] leading-none">{p.title}</span>
              <span className="mt-3 flex items-center justify-between">
                <span className="t-label text-champ">{p.subtitle ?? "A Studio Kunal Story"}</span>
                <span className="t-label text-ivory/80">View story →</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="wrap mt-6 flex items-center gap-4">
        <span className="t-label tabular-nums text-ivory/70" aria-live="polite">
          {pad(idx + 1)} / {pad(total)}
        </span>
        <span className="relative h-px flex-1 bg-ivory/15" aria-hidden>
          <span className="absolute inset-0 origin-left bg-champ transition-transform duration-500" style={{ transform: `scaleX(${(idx + 1) / total})` }} />
        </span>
        <button type="button" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)]" aria-label="Previous story">
          ←
        </button>
        <button type="button" onClick={() => step(1)} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)]" aria-label="Next story">
          →
        </button>
      </div>
    </div>
  );
}
