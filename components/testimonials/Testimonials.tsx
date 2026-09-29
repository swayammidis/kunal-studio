"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { testimonials, type Testimonial } from "@/content/site";
import { SectionMark } from "@/components/ui/SectionMark";
import { CtaLink } from "@/components/ui/CtaLink";
import { openGallery } from "@/lib/gallery";
import { cx, excerpt, pad } from "@/lib/utils";

const total = testimonials.length;

function initials(names: string) {
  return names
    .split("&")
    .map((n) => n.trim()[0])
    .join(" & ");
}

export function Testimonials() {
  const rail = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);

  const cardStep = () => {
    const el = rail.current;
    const first = el?.children[0] as HTMLElement | undefined;
    const second = el?.children[1] as HTMLElement | undefined;
    if (!first) return 1;
    return second ? second.offsetLeft - first.offsetLeft : first.offsetWidth;
  };

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / cardStep());
    setActive(Math.max(0, Math.min(total - 1, i)));
  };

  const goTo = (i: number) => {
    const el = rail.current;
    if (!el) return;
    const idx = Math.max(0, Math.min(total - 1, i));
    el.scrollTo({ left: idx * cardStep(), behavior: "smooth" });
    setActive(idx);
  };

  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="theme-dark relative overflow-hidden section-pad">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <SectionMark number="06" label="Testimonials" />
            <h2 id="testimonials-title" className="t-h2 mt-8" data-reveal="lines">
              <span className="ln">
                <span style={{ ["--i" as string]: 0 }}>Real emotions.</span>
              </span>
              <span className="ln">
                <span style={{ ["--i" as string]: 1 }}>Real stories.</span>
              </span>
              <span className="ln">
                <span style={{ ["--i" as string]: 2 }}>
                  Real <em className="serif-em">words.</em>
                </span>
              </span>
            </h2>
          </div>
          <Controls active={active} onPrev={() => goTo(active - 1)} onNext={() => goTo(active + 1)} className="hidden lg:flex" />
        </div>
      </div>

      <ol
        ref={rail}
        onScroll={onScroll}
        className="rail mt-12 gap-4 px-[var(--gutter)] [scroll-padding-inline:var(--gutter)] sm:gap-6 lg:mt-20"
        aria-label="Client testimonials"
      >
        {testimonials.map((t, i) => (
          <li
            key={t.names}
            className={cx(
              "w-[86vw] max-w-[980px] transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:w-[78vw] lg:w-[62vw]",
              i === active ? "opacity-100" : "opacity-40 lg:scale-[0.94]",
            )}
            aria-roledescription="slide"
            aria-label={`${pad(i + 1)} of ${pad(total)}: ${t.names}`}
          >
            <Card t={t} expanded={expanded === i} onToggle={() => setExpanded(expanded === i ? null : i)} onFocus={() => i !== active && goTo(i)} />
          </li>
        ))}
        <li className="w-px" aria-hidden />
      </ol>

      <div className="wrap mt-10 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <Controls active={active} onPrev={() => goTo(active - 1)} onNext={() => goTo(active + 1)} className="lg:hidden" />
        <div className="sm:ml-auto">
          <CtaLink href="#contact" variant="solid" track="availability_cta" trackLabel="after_testimonials">
            Check Our Availability
          </CtaLink>
        </div>
      </div>
    </section>
  );
}

function Controls({ active, onPrev, onNext, className }: { active: number; onPrev: () => void; onNext: () => void; className?: string }) {
  return (
    <div className={cx("flex w-full items-center gap-4 sm:w-auto sm:min-w-[340px]", className)}>
      <span className="t-label tabular-nums text-ivory/70" aria-live="polite">
        {pad(active + 1)} / {pad(total)}
      </span>
      <span className="relative h-px flex-1 bg-ivory/15" aria-hidden>
        <span className="absolute inset-0 origin-left bg-champ transition-transform duration-700" style={{ transform: `scaleX(${(active + 1) / total})` }} />
      </span>
      <button type="button" onClick={onPrev} disabled={active === 0} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)] transition-[opacity,background-color,color] hover:bg-ivory hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory" aria-label="Previous testimonial">
        ←
      </button>
      <button type="button" onClick={onNext} disabled={active === total - 1} className="grid h-11 w-11 place-items-center border border-[var(--line-dark)] transition-[opacity,background-color,color] hover:bg-ivory hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ivory" aria-label="Next testimonial">
        →
      </button>
    </div>
  );
}

function Card({ t, expanded, onToggle, onFocus }: { t: Testimonial; expanded: boolean; onToggle: () => void; onFocus: () => void }) {
  const { text: short, truncated } = excerpt(t.text, 260);
  const id = `t-${t.names.replace(/\W+/g, "-").toLowerCase()}`;

  return (
    <article className="grid h-full gap-6 border border-[var(--line-dark)] p-5 sm:p-8 md:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] md:gap-10 lg:p-10" onFocus={onFocus}>
      {/* Media */}
      <div className="flex items-center gap-4 md:block">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full md:aspect-[4/5] md:h-auto md:w-full md:rounded-none">
          {t.photo ? (
            <Image src={t.photo.src} alt={`${t.names}, photographed by Studio Kunal`} fill sizes="(min-width:768px) 22vw, 64px" className="object-cover" placeholder="blur" blurDataURL={t.photo.blur} />
          ) : (
            <div className="grid h-full w-full place-items-center bg-char-2 font-serif text-xl text-champ md:text-[clamp(2.5rem,4vw,4.5rem)]" aria-hidden>
              {initials(t.names)}
            </div>
          )}
        </div>
        <div className="md:hidden">
          <p className="font-serif text-2xl leading-none">{t.names}</p>
          <p className="t-label mt-2 text-ivory/50">Studio Kunal client</p>
        </div>
      </div>

      {/* Words */}
      <div className="flex min-w-0 flex-col">
        <span className="font-serif text-6xl leading-[0.5] text-champ" aria-hidden>
          “
        </span>
        <div id={id} className="mt-4">
          {expanded ? (
            <div className="space-y-4">
              {t.text.map((p, i) => (
                <p key={i} className={i === 0 ? "t-quote" : "t-body text-ivory/80"}>
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="t-quote">{short}</p>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <p className="hidden md:block">
            <span className="font-serif text-2xl">{t.names}</span>
          </p>
          <div className="flex flex-wrap items-center gap-5">
            {truncated ? (
              <button type="button" onClick={onToggle} aria-expanded={expanded} aria-controls={id} className="link-line t-label text-ivory">
                {expanded ? "Show less" : "Read full story"} <span aria-hidden>{expanded ? "↑" : "→"}</span>
              </button>
            ) : null}
            {t.slug ? (
              <button type="button" onClick={() => openGallery(t.slug!)} className="link-line t-label text-champ" data-cursor="View story →">
                View the gallery <span aria-hidden>→</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
