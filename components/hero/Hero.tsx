import { getImageProps } from "next/image";
import { brand, hero } from "@/content/site";
import { SplitLines } from "@/components/ui/SplitLines";
import { CtaLink } from "@/components/ui/CtaLink";

const alt = "A bride in a flowing white gown seated on a grand stone staircase while her groom looks on — Studio Kunal Photography";

export function Hero() {
  const common = { alt, sizes: "100vw" };
  const {
    props: { srcSet: landscape },
  } = getImageProps({ ...common, src: hero.imageDesktop.src, width: hero.imageDesktop.width, height: hero.imageDesktop.height, quality: 75 });
  const {
    props: { srcSet: portrait, ...rest },
  } = getImageProps({ ...common, src: hero.imageMobile.src, width: hero.imageMobile.width, height: hero.imageMobile.height, quality: 75 });

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Photograph — visible on first paint, slow settle via CSS */}
      <div className="absolute inset-0 -z-10" aria-hidden={false}>
        <picture>
          <source media="(min-aspect-ratio: 1/1)" srcSet={landscape} />
          <source srcSet={portrait} />
          <img
            {...rest}
            alt={alt}
            loading="eager"
            fetchPriority="high"
            className="hero-img absolute inset-0 h-full w-full object-cover object-[50%_40%]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/10 to-transparent max-lg:hidden" />
      </div>

      {/* Viewfinder marks */}
      <div
        className="hero-fade pointer-events-none absolute inset-x-[var(--gutter)] bottom-[clamp(16px,3vw,32px)] top-[calc(var(--header-h)+8px)] text-ivory/50"
        style={{ ["--d" as string]: "1.4s" }}
        aria-hidden
      >
        <div className="frame-marks">
          <i />
        </div>
      </div>

      <p
        className="hero-fade vertical-label t-label absolute right-[calc(var(--gutter)+14px)] top-1/2 hidden -translate-y-1/2 text-ivory/60 lg:block"
        style={{ ["--d" as string]: "1.5s" }}
        aria-hidden
      >
        North America — India — Destination
      </p>

      <div className="wrap relative flex flex-1 flex-col justify-end pb-6 pt-[calc(var(--header-h)+2.5rem)] sm:pb-8">
        <div className="grid items-end gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-8 lg:pl-6 xl:pl-10">
            <p className="hero-fade t-label mb-5 flex items-center gap-3 text-champ sm:mb-7" style={{ ["--d" as string]: "0.15s" }}>
              <span className="hero-rule block h-px w-10 bg-champ" style={{ ["--d" as string]: "0.2s" }} aria-hidden />
              <span>
                {hero.eyebrow[0]} <br className="sm:hidden" />
                {hero.eyebrow[1]}
              </span>
            </p>
            <SplitLines as="h1" id="hero-title" mode="hero" lines={hero.headline} className="t-display" />
          </div>

          <div className="lg:col-span-4 lg:pb-3 lg:pr-10">
            <p className="hero-fade t-body max-w-[26rem] text-ivory/85 [@media(max-height:620px)]:hidden" style={{ ["--d" as string]: "0.95s" }}>
              {hero.support}
            </p>
            <div className="hero-fade mt-6 flex flex-col gap-3 min-[420px]:flex-row lg:flex-col xl:flex-row" style={{ ["--d" as string]: "1.1s" }}>
              <CtaLink href="#stories" variant="solid" track="hero_cta" trackLabel="see_our_magic" cursor="View work">
                See Our Magic
              </CtaLink>
              <CtaLink href="#contact" variant="ghost-dark" track="hero_cta" trackLabel="lets_connect">
                Let&apos;s Connect
              </CtaLink>
            </div>
          </div>
        </div>

        {/* Metadata strip */}
        <div className="hero-fade mt-8 sm:mt-12" style={{ ["--d" as string]: "1.3s" }}>
          <div className="hero-rule h-px w-full bg-ivory/20" style={{ ["--d" as string]: "1s" }} aria-hidden />
          <div className="flex items-center justify-between gap-6 pt-4 lg:pl-6 xl:pl-10">
            <p className="t-label flex items-center gap-2 whitespace-nowrap text-ivory">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-champ" aria-hidden />
              {brand.availability}
            </p>
            <ul className="hidden items-center gap-8 text-ivory/60 xl:flex">
              {brand.descriptors.slice(1).map((d) => (
                <li key={d} className="t-label whitespace-nowrap">
                  {d}
                </li>
              ))}
            </ul>
            <a href="#about" className="t-label hidden items-center gap-3 text-ivory/70 sm:flex" aria-label="Scroll to our approach">
              <span>Scroll</span>
              <span className="relative block h-8 w-px overflow-hidden bg-ivory/15" aria-hidden>
                <span className="scroll-cue-line absolute inset-0 bg-ivory" />
              </span>
            </a>
          </div>
          <p className="t-label mt-3 text-ivory/55 xl:hidden">Documentary &amp; Editorial · Cinematic Storytelling · Limited Dates</p>
        </div>
      </div>
    </section>
  );
}
