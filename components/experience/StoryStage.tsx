"use client";

import { useEffect } from "react";
import { experience } from "@/data";
import { pad } from "@/lib/utils";

/**
 * Progressive enhancement for the sticky storytelling stage: watches which
 * chapter sits in the middle of the viewport and wipes the matching photograph
 * into the stage. Earlier frames stay beneath so scrolling back retracts them.
 */
export function StoryStage() {
  useEffect(() => {
    const stage = document.querySelector<HTMLElement>("[data-story-stage]");
    if (!stage) return;
    const items = Array.from(stage.querySelectorAll<HTMLElement>("[data-stage-item]"));
    const counter = stage.querySelector<HTMLElement>("[data-stage-counter]");
    const title = stage.querySelector<HTMLElement>("[data-stage-title]");
    const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));

    const setActive = (active: number) => {
      items.forEach((el, i) => (el.dataset.state = i <= active ? "shown" : "hidden"));
      if (counter) counter.textContent = pad(active + 1);
      if (title) title.textContent = experience[active].title;
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.chapter));
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return null;
}
