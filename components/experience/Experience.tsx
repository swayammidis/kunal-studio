import { experience } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { pad } from "@/lib/utils";
import { StoryStage } from "./StoryStage";

export function Experience() {
  const total = pad(experience.length);
  return (
    <section id="experience" aria-labelledby="experience-title" className="theme-dark relative section-pad">
      <div className="wrap">
        <div className="grid lg:grid-cols-12 lg:gap-x-10">
          {/* Sticky stage — desktop only */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-[calc(var(--header-h)+4vh)] h-[calc(100svh-var(--header-h)-8vh)]">
              <div className="relative h-full w-full" data-story-stage>
                {experience.map((c, i) => (
                  <div
                    key={c.title}
                    data-stage-item={i}
                    data-state={i === 0 ? "shown" : "hidden"}
                    className="absolute inset-0 overflow-hidden transition-[clip-path] duration-[1300ms] ease-[cubic-bezier(0.77,0,0.18,1)] data-[state=hidden]:[clip-path:inset(100%_0_0_0)] data-[state=shown]:[clip-path:inset(0_0_0_0)]"
                  >
                    <Photo photo={c.image} alt={c.alt} sizes="(min-width:1024px) 48vw, 1px" className="h-full w-full" />
                  </div>
                ))}
                <div className="frame-marks m-4 text-ivory/70" aria-hidden>
                  <i />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-6">
                  <p className="t-label text-ivory/80" aria-hidden>
                    <span data-stage-counter>01</span> / {total}
                  </p>
                  <p className="t-label text-champ" data-stage-title aria-hidden>
                    {experience[0].title}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters */}
          <div className="lg:col-span-5 lg:col-start-8">
            <div data-chapter={0}>
            <SectionMark number="02" label="The Experience" />
            <SplitLines
              id="experience-title"
              className="t-h2 mt-8"
              lines={[[{ t: "Real emotions," }], [{ t: "lasting ", em: false }, { t: "memories.", em: true }]]}
            />
            <p className="t-lead mt-8 max-w-[30rem] text-ivory/70" data-reveal="fade">
              Documentary &amp; editorial style wedding photography, with a cinematic approach to every celebration.
            </p>
            </div>

            <ol className="mt-12 lg:mt-0">
              {experience.map((c, i) => (
                <li
                  key={c.title}
                  data-chapter={i}
                  className="border-t border-[var(--line-dark)] py-10 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:border-t-0 lg:py-0"
                >
                  <div data-reveal="mask" className="mb-8 lg:hidden">
                    <Photo photo={c.image} alt={c.alt} sizes="(min-width:640px) 80vw, 100vw" className="aspect-[4/5] sm:aspect-[4/3]" />
                  </div>
                  <div data-reveal="fade">
                    <p className="t-label flex items-center gap-4 text-champ">
                      <span className="tabular-nums">{pad(i + 1)}</span>
                      <span className="h-px w-10 bg-current opacity-60" aria-hidden />
                    </p>
                    <h3 className="t-h3 mt-5">{c.title}</h3>
                    <p className="t-body mt-5 max-w-[28rem] text-ivory/70">{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <StoryStage />
    </section>
  );
}
