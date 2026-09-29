"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { brand, films } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { PlayIcon, YouTubeIcon } from "@/components/ui/Icons";
import { SectionMark } from "@/components/ui/SectionMark";
import { CtaLink } from "@/components/ui/CtaLink";
import { track } from "@/lib/analytics";
import { lockScroll } from "@/lib/scroll";
import { pad } from "@/lib/utils";

const total = pad(films.length);

export function Films() {
  const [featured, setFeatured] = useState(0);
  const [playing, setPlaying] = useState<number | null>(null);
  const strip = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const play = (i: number) => {
    opener.current = document.activeElement as HTMLElement | null;
    setFeatured(i);
    setPlaying(i);
    track("film_play", { film: films[i].id, position: i + 1 });
  };
  const close = useCallback(() => {
    setPlaying(null);
    opener.current?.focus();
  }, []);

  const onStrip = () => {
    const el = strip.current;
    if (!el || !bar.current) return;
    const max = el.scrollWidth - el.clientWidth;
    bar.current.style.transform = `scaleX(${max > 0 ? Math.max(0.08, el.scrollLeft / max) : 1})`;
  };
  const nudge = (dir: number) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.7, behavior: "smooth" });

  const f = films[featured];

  return (
    <section id="films" aria-labelledby="films-title" className="theme-char relative overflow-hidden section-pad">
      <div className="wrap">
        <div className="grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-8">
            <SectionMark number="04" label="Cinematic Films" />
            <h2 id="films-title" className="t-h2 mt-8" data-reveal="lines">
              <span className="ln">
                <span style={{ ["--i" as string]: 0 }}>Stories that move</span>
              </span>
              <span className="ln">
                <span style={{ ["--i" as string]: 1 }}>
                  beyond <em className="serif-em">photographs.</em>
                </span>
              </span>
            </h2>
          </div>
          <div className="lg:col-span-4" data-reveal="fade">
            <p className="t-body text-ivory/70">
              Seamless photography and cinematography services for couples worldwide — capturing timeless stories with authenticity and emotion.
            </p>
            <a href={brand.youtube} target="_blank" rel="noopener noreferrer" className="link-line t-label mt-6 text-ivory/80" data-track="youtube_click">
              <YouTubeIcon className="h-4 w-4" /> Watch on YouTube
            </a>
          </div>
        </div>

        {/* Featured film */}
        <div className="mt-12 lg:mt-20" data-reveal="mask">
          <button
            type="button"
            onClick={() => play(featured)}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-ink sm:aspect-video"
            aria-label={`Play film ${pad(f.number)} of ${total}`}
            data-cursor="Play film →"
          >
            {films.map((film, i) => (
              <div
                key={film.id}
                className={`absolute inset-0 transition-opacity duration-[900ms] ${i === featured ? "opacity-100" : "opacity-0"}`}
                aria-hidden
              >
                {Math.abs(i - featured) <= 1 || i === featured ? (
                  <Photo
                    photo={film.poster}
                    alt=""
                    sizes="(min-width:1680px) 1600px, 100vw"
                    className="h-full w-full"
                    imgClassName="transition-transform duration-[1800ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
            ))}
            <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/20" aria-hidden />
            <span className="frame-marks m-4 text-ivory/60 sm:m-6" aria-hidden>
              <i />
            </span>
            {/* Letterbox rules */}
            <span className="absolute inset-x-0 top-[9%] hidden h-px bg-ivory/10 sm:block" aria-hidden />
            <span className="absolute inset-x-0 bottom-[9%] hidden h-px bg-ivory/10 sm:block" aria-hidden />

            <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
              <span className="grid h-20 w-20 place-items-center rounded-full border border-ivory/70 text-ivory transition-[transform,background-color,color] duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110 group-hover:bg-ivory group-hover:text-ink sm:h-28 sm:w-28">
                <PlayIcon className="ml-1 h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="t-label">Play Film</span>
            </span>
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 sm:p-8">
              <span className="t-label text-ivory/80">
                Film {pad(f.number)} / {total}
              </span>
              <span className="t-label hidden text-ivory/60 sm:block">Studio Kunal · Cinematography</span>
            </span>
          </button>
        </div>

        {/* Film strip */}
        <div className="mt-10">
          <div className="sprockets" aria-hidden />
          <ol ref={strip} onScroll={onStrip} className="rail gap-3 py-3" aria-label="All films">
            {films.map((film, i) => (
              <li key={film.id} className="w-[62vw] max-w-[320px] sm:w-[34vw] lg:w-[22vw]">
                <button
                  type="button"
                  onClick={() => play(i)}
                  onMouseEnter={() => setFeatured(i)}
                  onFocus={() => setFeatured(i)}
                  className="group block w-full text-left"
                  aria-label={`Play film ${pad(film.number)} of ${total}`}
                  data-cursor="Play film →"
                >
                  <span className={`relative block aspect-video overflow-hidden transition-opacity duration-500 ${i === featured ? "opacity-100" : "opacity-55 group-hover:opacity-100"}`}>
                    <Photo photo={film.poster} alt="" sizes="(min-width:1024px) 22vw, 62vw" quality={60} className="h-full w-full" imgClassName="transition-transform duration-1000 group-hover:scale-105" />
                    <span className="absolute inset-0 grid place-items-center" aria-hidden>
                      <span className="grid h-10 w-10 place-items-center rounded-full border border-ivory/70 bg-ink/30 backdrop-blur-sm">
                        <PlayIcon className="ml-0.5 h-3.5 w-3.5" />
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 flex items-center justify-between">
                    <span className="t-label tabular-nums text-ivory/80">Film {pad(film.number)}</span>
                    <span className={`h-px bg-champ transition-[width] duration-700 ${i === featured ? "w-8" : "w-0"}`} aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="sprockets" aria-hidden />
          <div className="mt-6 flex items-center gap-4">
            <span className="relative h-px flex-1 bg-ivory/15" aria-hidden>
              <span ref={bar} className="absolute inset-0 origin-left scale-x-[0.08] bg-champ transition-transform duration-300" />
            </span>
            <button type="button" onClick={() => nudge(-1)} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)] transition-colors hover:bg-ivory hover:text-ink" aria-label="Scroll films left">
              ←
            </button>
            <button type="button" onClick={() => nudge(1)} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)] transition-colors hover:bg-ivory hover:text-ink" aria-label="Scroll films right">
              →
            </button>
          </div>
        </div>

        <div className="mt-14 flex justify-start sm:justify-end" data-reveal="fade">
          <CtaLink href="#contact" variant="ghost-dark" track="availability_cta" trackLabel="after_films">
            Let&apos;s Create Your Film
          </CtaLink>
        </div>
      </div>

      {playing !== null ? <VideoModal id={films[playing].id} number={films[playing].number} onClose={close} /> : null}
    </section>
  );
}

function VideoModal({ id, number, onClose }: { id: string; number: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    lockScroll(true);
    const raf = requestAnimationFrame(() => setShown(true));
    ref.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        // Keep focus inside the dialog (close button + iframe).
        const els = Array.from(ref.current?.querySelectorAll<HTMLElement>("button, iframe") ?? []);
        if (!els.length) return;
        if (e.shiftKey && document.activeElement === els[0]) {
          e.preventDefault();
          els[els.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === els[els.length - 1]) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={`Film ${pad(number)}`}
      className={`fixed inset-0 z-[95] flex flex-col bg-ink/95 backdrop-blur-sm transition-opacity duration-500 ${shown ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <p className="t-label text-ivory/70">
          Film {pad(number)} / {total}
        </p>
        <button type="button" onClick={onClose} className="btn btn-ghost-dark min-h-[44px] px-4" aria-label="Close film">
          <span className="max-sm:hidden">Close</span>
          <span aria-hidden>✕</span>
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center px-[var(--gutter)] pb-[max(var(--gutter),env(safe-area-inset-bottom))]" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={`relative aspect-video w-full max-w-[min(1400px,calc((100svh-var(--header-h)-48px)*16/9))] bg-black transition-transform duration-700 ${shown ? "scale-100" : "scale-95"}`}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`Studio Kunal Photography — film ${pad(number)}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
