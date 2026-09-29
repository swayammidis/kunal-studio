import { projects } from "@/content/site";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { CtaLink } from "@/components/ui/CtaLink";
import { StoriesExhibit } from "./StoriesExhibit";

export function Portfolio() {
  return (
    <section id="stories" aria-labelledby="stories-title" className="theme-dark relative transition-colors duration-[1200ms]">
      <div className="wrap pb-12 pt-[clamp(88px,12vw,180px)] lg:pb-6">
        <div className="grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-10">
          <div className="lg:col-span-7">
            <SectionMark number="03" label="Our Stories" />
            <SplitLines
              id="stories-title"
              className="t-h2 mt-8"
              lines={[[{ t: "Our work," }], [{ t: "your ", em: false }, { t: "stories.", em: true }]]}
            />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="t-body text-ivory/70" data-reveal="fade">
              Eight stories, each told through documentary, editorial and cinematic frames. Open any story to view the full gallery.
            </p>
            <p className="t-label mt-5 hidden text-ivory/45 lg:block" data-reveal="fade">
              Scroll to move through the exhibition
            </p>
          </div>
        </div>
      </div>

      <StoriesExhibit projects={projects} />

      <div className="wrap flex flex-col items-start justify-between gap-6 border-t border-[var(--line-dark)] py-10 sm:flex-row sm:items-center lg:mt-0">
        <p className="t-h3 max-w-[36rem] text-[clamp(1.5rem,1rem+1.4vw,2.3rem)]">
          Imagine <em className="serif-em">your story</em> here.
        </p>
        <CtaLink href="#contact" variant="solid" track="availability_cta" trackLabel="after_portfolio">
          Check Availability
        </CtaLink>
      </div>
    </section>
  );
}
