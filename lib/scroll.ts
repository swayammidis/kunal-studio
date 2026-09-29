import type Lenis from "lenis";

type LenisWindow = Window & { __lenis?: Lenis };

export function getLenis(): Lenis | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as LenisWindow).__lenis;
}

export function setLenis(lenis: Lenis | undefined) {
  (window as LenisWindow).__lenis = lenis;
}

/** Smoothly scroll to an element id, using Lenis when it is running. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { duration: 1.6 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }
  // Move focus for keyboard / screen reader users without re-scrolling.
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export function lockScroll(lock: boolean) {
  const lenis = getLenis();
  if (lenis) {
    if (lock) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}
