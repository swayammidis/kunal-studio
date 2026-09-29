"use client";

import { useEffect } from "react";
import { loadGsap } from "@/lib/animations/gsap";

/** Wipes the second pinned frame in once the quote considerations reach mid-screen. */
export function InvestmentStage() {
  useEffect(() => {
    let kill: (() => void) | undefined;
    let cancelled = false;
    loadGsap().then(({ ScrollTrigger }) => {
      const list = document.querySelector("[data-inv-considers]");
      const frame = document.querySelector<HTMLElement>('[data-inv-frame="1"]');
      if (cancelled || !list || !frame) return;
      const st = ScrollTrigger.create({
        trigger: list,
        start: "top 55%",
        onEnter: () => (frame.dataset.state = "shown"),
        onLeaveBack: () => (frame.dataset.state = "hidden"),
      });
      kill = () => st.kill();
    });
    return () => {
      cancelled = true;
      kill?.();
    };
  }, []);
  return null;
}
