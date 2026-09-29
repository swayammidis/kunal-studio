"use client";

import { useState } from "react";
import { faqIntro, faqs } from "@/content/site";
import { SectionMark } from "@/components/ui/SectionMark";
import { cx, pad } from "@/lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="theme-light relative section-pad">
      <div className="wrap grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+6vh)]">
            <SectionMark number="07" label="Frequently Asked Questions" />
            <h2 id="faq-title" className="t-h2 mt-8" data-reveal="lines">
              <span className="ln">
                <span style={{ ["--i" as string]: 0 }}>Your questions,</span>
              </span>
              <span className="ln">
                <span style={{ ["--i" as string]: 1 }}>
                  our <em className="serif-em">answers.</em>
                </span>
              </span>
            </h2>
            <p className="t-body mt-8 max-w-[26rem] text-ink/70" data-reveal="fade">
              {faqIntro}
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="h-px w-full bg-ink/20" data-reveal="draw" aria-hidden />
          <ul>
            {faqs.map((f, i) => {
              const isOpen = open === i;
              const panelId = `faq-panel-${i}`;
              const btnId = `faq-btn-${i}`;
              return (
                <li key={f.q} className="border-b border-[var(--line-light)]" data-reveal="fade" style={{ ["--d" as string]: `${i * 0.06}s` }}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-start gap-5 py-7 text-left sm:gap-8 sm:py-9"
                    >
                      <span className={cx("t-label mt-2 w-6 shrink-0 tabular-nums transition-colors duration-500", isOpen ? "text-bronze" : "text-ink/45")}>{pad(i + 1)}</span>
                      <span
                        className={cx(
                          "flex-1 font-serif text-[clamp(1.35rem,1rem+1.2vw,2.15rem)] leading-[1.12] transition-colors duration-700",
                          isOpen ? "text-ink" : "text-ink/75 group-hover:text-ink",
                        )}
                      >
                        {f.q}
                      </span>
                      <span className="relative mt-2 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/25 transition-colors duration-500 group-hover:border-ink" aria-hidden>
                        <span className="absolute h-px w-3.5 bg-current" />
                        <span className={cx("absolute h-3.5 w-px bg-current transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]", isOpen ? "rotate-90 scale-y-0" : "")} />
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} className="acc-panel" data-open={isOpen}>
                    <div>
                      <p className="t-body max-w-[40rem] pb-9 pl-11 text-ink/75 sm:pl-14">{f.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
