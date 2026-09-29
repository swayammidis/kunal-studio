import { about } from "@/content/site";
import { Photo } from "@/components/ui/Photo";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { CtaLink } from "@/components/ui/CtaLink";
import { pad } from "@/lib/utils";

export function About() {
  const { collage } = about;
  return (
    <section id="about" aria-labelledby="about-title" className="theme-light relative overflow-hidden section-pad">
      <div className="wrap">
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-10">
          {/* Copy */}
          <div className="lg:col-span-5 lg:pt-10">
            <SectionMark number="01" label="Our Approach" />
            <SplitLines
              id="about-title"
              className="t-h2 mt-8"
              lines={[[{ t: "Timeless" }], [{ t: "storytelling.", em: true }]]}
            />
            <div className="mt-10 max-w-[34rem] space-y-5 text-ink/80 lg:mt-14">
              <p className="t-lead text-ink" data-reveal="fade">
                <strong className="font-medium">Studio Kunal Photography</strong>{" "}
                {about.paragraphs[0].replace("Studio Kunal Photography ", "")}
              </p>
              {about.paragraphs.slice(1).map((p, i) => (
                <p key={i} className="t-body" data-reveal="fade" style={{ ["--d" as string]: `${0.08 * (i + 1)}s` }}>
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10" data-reveal="fade">
              <CtaLink href="#stories" variant="ghost-light" cursor="View work">
                Explore Our Stories
              </CtaLink>
            </div>
          </div>

          {/* Collage */}
          <div className="relative lg:col-span-7" aria-label="Selected photographs">
            <div className="relative mx-auto aspect-[1/1.12] w-full max-w-[760px] lg:aspect-[1/1.18]">
              {/* Main colour frame */}
              <div className="absolute right-0 top-0 w-[64%] lg:w-[60%]" data-parallax="0.08">
                <div data-reveal="mask">
                  <Photo
                    photo={collage.main}
                    alt="Couple embracing outdoors, the bride in a white and red saree"
                    sizes="(min-width:1024px) 34vw, 64vw"
                    className="aspect-[2/3]"
                  />
                </div>
                <p className="t-label mt-3 flex justify-between text-ink/55">
                  <span>Pl. I</span>
                  <span>Genuine emotions</span>
                </p>
              </div>

              {/* Black & white arch, with offset outline */}
              <div className="absolute left-0 top-[16%] w-[42%] lg:left-[2%] lg:w-[36%]" data-parallax="0.22">
                <div className="absolute -inset-3 border border-[var(--line-light)] sm:-inset-4" data-reveal="fade" aria-hidden />
                <div data-reveal="mask" style={{ ["--d" as string]: "0.15s" }}>
                  <Photo
                    photo={collage.arch}
                    alt="Black and white photograph of a couple beneath gothic stone arches"
                    sizes="(min-width:1024px) 22vw, 42vw"
                    className="aspect-[3/4]"
                    imgClassName="grayscale"
                  />
                </div>
              </div>

              {/* Ceremony frame overlapping the main image */}
              <div className="absolute bottom-0 left-[20%] w-[40%] lg:left-[24%] lg:w-[34%]" data-parallax="0.16">
                <div data-reveal="mask" style={{ ["--d" as string]: "0.3s" }}>
                  <Photo
                    photo={collage.ceremony}
                    alt="Black and white photograph of a wedding couple surrounded by family"
                    sizes="(min-width:1024px) 20vw, 40vw"
                    className="aspect-[4/5] ring-8 ring-ivory sm:ring-[12px]"
                    imgClassName="grayscale"
                  />
                </div>
              </div>

              <p className="vertical-label t-label absolute -left-1 bottom-[4%] hidden text-ink/50 sm:block" aria-hidden>
                Documentary · Editorial · Cinematic
              </p>

              <p
                className="t-script pointer-events-none absolute left-0 top-[1%] -rotate-6 text-[clamp(1.9rem,4.4vw,3.5rem)] text-bronze sm:left-[2%] sm:top-[3%]"
                data-reveal="fade"
                style={{ ["--d" as string]: "0.6s" }}
                aria-hidden
              >
                real emotions, lasting memories
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="mt-[clamp(80px,10vw,160px)]">
          <div className="h-px w-full bg-ink/20" data-reveal="draw" aria-hidden />
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
            {about.principles.map((p, i) => (
              <li
                key={p.title}
                className="relative border-b border-[var(--line-light)] py-8 sm:py-10 sm:pr-6 sm:odd:pl-0 sm:even:pl-6 lg:border-b-0 lg:[&:nth-child(3)]:pl-6"
                data-reveal="fade"
                style={{ ["--d" as string]: `${i * 0.1}s` }}
              >
                {i > 0 ? (
                  <span
                    className={`absolute left-0 top-0 hidden h-full w-px bg-ink/15 ${i === 2 ? "lg:block" : "sm:block"}`}
                    data-reveal="draw-y"
                    aria-hidden
                  />
                ) : null}
                <span className="t-label tabular-nums text-bronze">{pad(i + 1)}</span>
                <h3 className="t-h3 mt-5 text-[clamp(1.6rem,1.1rem+1.3vw,2.4rem)]">{p.title}</h3>
                <p className="t-body mt-4 max-w-[22rem] text-ink/65">{p.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
