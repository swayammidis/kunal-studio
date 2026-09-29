import { weddingDay } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { SplitLines } from "@/components/ui/SplitLines";
import { cx } from "@/lib/utils";
import { WeddingDayMotion } from "./WeddingDayMotion";

const total = weddingDay.length;

/**
 * A wedding day in seven chapters. Each chapter is a full-screen sticky frame;
 * the next slides over the last like a cut in a film. Pure CSS stacking, so it
 * works everywhere — WeddingDayMotion only adds the settle-back on desktop.
 */
export function WeddingDay() {
  return (
    <section id="wedding-day" aria-labelledby="wedding-day-title" className="theme-dark relative">
      <div className="wrap grid gap-y-8 pb-[clamp(56px,8vw,120px)] pt-[clamp(88px,12vw,180px)] lg:grid-cols-12 lg:items-end lg:gap-x-10">
        <div className="lg:col-span-7">
          <p className="t-label flex items-center gap-4 text-champ" data-reveal="fade">
            <span>A wedding day</span>
            <span className="h-px w-12 bg-current opacity-50" aria-hidden />
            <span>In {total} chapters</span>
          </p>
          <SplitLines
            id="wedding-day-title"
            className="t-h2 mt-8"
            lines={[[{ t: "One day," }], [{ t: "seven ", em: false }, { t: "chapters.", em: true }]]}
          />
        </div>
        <p className="t-body text-ivory/70 lg:col-span-4 lg:col-start-9" data-reveal="fade">
          From the quiet hours before the ceremony to everything that follows — documentary where it matters, editorial where it shines,
          cinematic throughout.
        </p>
      </div>

      <ol data-day-list>
        {weddingDay.map((c, i) => (
          <li key={c.title} data-day-chapter className="sticky top-0 h-[100svh] overflow-hidden bg-ink" aria-label={`Chapter ${c.numeral}: ${c.title}`}>
            <div data-day-inner className="relative h-full w-full will-change-transform">
              <div data-day-image className="absolute inset-0">
                <Photo photo={c.image} alt={c.alt} sizes="100vw" className="h-full w-full" position={c.position} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-ink/40" />
              <div data-day-dim className="pointer-events-none absolute inset-0 bg-ink opacity-0" aria-hidden />

              {/* Top rail: chapter marker + progress through the day */}
              <div className="wrap absolute inset-x-0 top-[calc(var(--header-h)+20px)] flex items-center justify-between gap-6">
                <p className="t-label text-ivory/80">
                  Chapter {c.numeral} <span className="text-ivory/40">/ {weddingDay[total - 1].numeral}</span>
                </p>
                <ol className="flex items-center gap-1.5" aria-hidden>
                  {weddingDay.map((_, j) => (
                    <li key={j} className={cx("h-px w-5 sm:w-8", j <= i ? "bg-champ" : "bg-ivory/25")} />
                  ))}
                </ol>
              </div>

              {/* Caption */}
              <div className="wrap absolute inset-x-0 bottom-0 pb-[clamp(88px,12vh,120px)] lg:pb-[clamp(40px,8vh,96px)]">
                <div className="grid items-end gap-6 lg:grid-cols-12 lg:gap-x-10">
                  <p
                    className="numeral pointer-events-none text-ivory lg:col-span-3"
                    aria-hidden
                  >
                    {c.numeral}
                  </p>
                  <div className="lg:col-span-6">
                    <h3 className="font-serif text-[clamp(2.4rem,1rem+5vw,6rem)] leading-[0.92] tracking-[-0.02em]">{c.title}</h3>
                    <p className="t-lead mt-4 max-w-[32rem] text-ivory/80">{c.line}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <WeddingDayMotion />
    </section>
  );
}
