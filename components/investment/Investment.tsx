import { investment } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { CtaLink } from "@/components/ui/CtaLink";
import { pad } from "@/lib/utils";

export function Investment() {
  return (
    <section id="investment" aria-labelledby="investment-title" className="theme-light relative overflow-hidden section-pad">
      <div className="wrap">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <SectionMark number="05" label="Investment" />
            <SplitLines
              id="investment-title"
              className="t-h2 mt-8"
              lines={[
                [{ t: "Your story" }],
                [{ t: "deserves a" }],
                [{ t: "personalized", em: true }],
                [{ t: "experience." }],
              ]}
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16">
              <p className="t-lead text-ink" data-reveal="fade">
                {investment.paragraphs[0]}
              </p>
              <div className="space-y-5 text-ink/75">
                {investment.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className="t-body" data-reveal="fade" style={{ ["--d" as string]: `${0.1 * (i + 1)}s` }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative -mr-[var(--gutter)] h-[70vw] max-h-[720px] overflow-hidden sm:h-[56vw] lg:h-full lg:max-h-none lg:min-h-[560px]" data-reveal="mask">
              <div className="absolute inset-x-0 -inset-y-[10%]" data-parallax="0.14">
                <Photo
                  photo={investment.image}
                  alt={investment.imageAlt}
                  sizes="(min-width:1024px) 42vw, 100vw"
                  className="h-full w-full"
                  position="40% 50%"
                />
              </div>
            </div>
            <p className="t-label mt-3 text-ink/50">No fixed packages — every quote is curated.</p>
          </div>
        </div>

        {/* Quote considerations + CTA */}
        <div className="mt-16 grid gap-10 border-t border-[var(--line-light)] pt-10 lg:mt-24 lg:grid-cols-12 lg:gap-x-10">
          <p className="t-label text-bronze lg:col-span-3">Each quote considers</p>
          <ol className="lg:col-span-6">
            {investment.considers.map((c, i) => (
              <li
                key={c}
                className="flex items-baseline gap-5 border-b border-[var(--line-light)] py-4 first:pt-0"
                data-reveal="fade"
                style={{ ["--d" as string]: `${i * 0.06}s` }}
              >
                <span className="t-label w-6 tabular-nums text-ink/45">{pad(i + 1)}</span>
                <span className="font-serif text-[clamp(1.4rem,1.1rem+0.9vw,2rem)] leading-tight">{c}</span>
              </li>
            ))}
          </ol>
          <div className="flex items-end lg:col-span-3 lg:justify-end">
            <CtaLink href="#contact" variant="ink" track="custom_quote" trackLabel="investment">
              Get a Custom Quote
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
