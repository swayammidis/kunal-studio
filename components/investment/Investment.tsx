import { investment } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { CtaLink } from "@/components/ui/CtaLink";
import { pad } from "@/lib/utils";
import { InvestmentStage } from "./InvestmentStage";

/**
 * 06 Investment — no prices or packages (the studio quotes individually).
 * Desktop: the photograph is pinned while the words scroll past; when the
 * quote considerations arrive, a second frame wipes in.
 */
export function Investment() {
  return (
    <section id="investment" aria-labelledby="investment-title" className="theme-light relative" data-curtain>
      <div className="grid lg:grid-cols-12">
        {/* Pinned photograph */}
        <div className="relative h-[72vw] max-h-[640px] overflow-hidden sm:h-[56vw] lg:sticky lg:top-0 lg:col-span-5 lg:h-[100svh] lg:max-h-none">
          <div className="absolute inset-0" data-inv-frame="0">
            <Photo photo={investment.image} alt={investment.imageAlt} sizes="(min-width:1024px) 42vw, 100vw" className="h-full w-full" position="40% 50%" />
          </div>
          <div
            className="absolute inset-0 hidden transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.77,0,0.18,1)] data-[state=hidden]:[clip-path:inset(100%_0_0_0)] data-[state=shown]:[clip-path:inset(0_0_0_0)] lg:block"
            data-inv-frame="1"
            data-state="hidden"
          >
            <Photo photo={investment.imageSecond} alt={investment.imageSecondAlt} sizes="(min-width:1024px) 42vw, 1px" className="h-full w-full" position="50% 30%" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" aria-hidden />
          <div className="frame-marks m-5 text-ivory/70 lg:m-8" aria-hidden>
            <i />
          </div>
          <p className="t-label absolute bottom-6 left-6 text-ivory/85 lg:bottom-10 lg:left-10">No fixed packages — every quote is curated</p>
        </div>

        {/* Words */}
        <div className="min-w-0 lg:col-span-7">
          <div className="px-[var(--gutter)] py-[clamp(72px,11vw,180px)] lg:px-[clamp(40px,6vw,120px)]">
            <SectionMark number="06" label="Investment" />
            <SplitLines
              id="investment-title"
              className="t-h2 mt-8"
              lines={[[{ t: "Your story" }], [{ t: "deserves a" }], [{ t: "personalized", em: true }], [{ t: "experience." }]]}
            />

            <div className="mt-12 max-w-[40rem] space-y-6 lg:mt-16">
              <p className="t-lead text-ink" data-reveal="fade">
                {investment.paragraphs[0]}
              </p>
              {investment.paragraphs.slice(1).map((p, i) => (
                <p key={i} className="t-body text-ink/75" data-reveal="fade" style={{ ["--d" as string]: `${0.1 * (i + 1)}s` }}>
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-16 lg:mt-24" data-inv-considers>
              <p className="t-label text-bronze">Each quote considers</p>
              <div className="mt-6 h-px w-full bg-ink/20" data-reveal="draw" aria-hidden />
              <ol>
                {investment.considers.map((c, i) => (
                  <li key={c} className="flex items-baseline gap-5 border-b border-[var(--line-light)] py-4" data-reveal="fade" style={{ ["--d" as string]: `${i * 0.06}s` }}>
                    <span className="t-label w-6 tabular-nums text-ink/45">{pad(i + 1)}</span>
                    <span className="font-serif text-[clamp(1.4rem,1.1rem+0.9vw,2rem)] leading-tight">{c}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10">
                <CtaLink href="#contact" variant="ink" track="custom_quote" trackLabel="investment">
                  Get a Custom Quote
                </CtaLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvestmentStage />
    </section>
  );
}
