"use client";

import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/animations/gsap";
import { scrollToId, setLenis } from "@/lib/scroll";
import { captureAttribution, track, type TrackEvent } from "@/lib/analytics";

/**
 * Global motion + interaction layer. Renders nothing.
 *
 * - Reveals: [data-reveal] elements get `.is-in` when they enter the viewport
 *   (CSS handles the actual transitions — see globals.css).
 * - Smooth scroll: Lenis on fine-pointer devices, synced with GSAP ScrollTrigger.
 * - Parallax: [data-parallax="<strength>"] scrubbed with ScrollTrigger.
 * - In-page anchors: smooth scroll + focus management.
 * - Tracking: clicks on [data-track] push conversion events.
 */
export function MotionRoot() {
  useEffect(() => {
    captureAttribution();
    const root = document.documentElement;
    const reduce = prefersReducedMotion();
    const cleanups: (() => void)[] = [];

    // ---- Reveals -----------------------------------------------------------
    if (!reduce) root.classList.add("motion");
    // Fully clipped (mask) or zero-scaled (draw) elements never report as
    // intersecting, so those are observed through their parent instead.
    const proxies = new Map<Element, Element[]>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (proxies.get(e.target) ?? [e.target]).forEach((el) => el.classList.add("is-in"));
          proxies.delete(e.target);
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    const observeAll = () =>
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        const needsProxy = el.dataset.reveal !== "lines" && el.dataset.reveal !== "fade";
        const target = needsProxy && el.parentElement ? el.parentElement : el;
        if (target !== el) {
          const list = proxies.get(target) ?? (target.hasAttribute("data-reveal") ? [target] : []);
          proxies.set(target, [...list, el]);
        }
        io.observe(target);
      });
    observeAll();
    // Late-mounted client islands (galleries, sliders) can opt in by dispatching this event.
    window.addEventListener("reveal:refresh", observeAll);
    cleanups.push(() => {
      io.disconnect();
      window.removeEventListener("reveal:refresh", observeAll);
    });

    // ---- Clicks: anchors + tracking ----------------------------------------
    const onClick = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      const tracked = target?.closest<HTMLElement>("[data-track]");
      if (tracked?.dataset.track) {
        track(tracked.dataset.track as TrackEvent, {
          label: tracked.dataset.trackLabel ?? tracked.textContent?.trim().slice(0, 60),
        });
      }
      const a = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey) return;
      const id = a.getAttribute("href")!.slice(1);
      if (!id) return;
      ev.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick);
    cleanups.push(() => document.removeEventListener("click", onClick));

    // ---- Scroll progress ---------------------------------------------------
    const bar = document.getElementById("scroll-progress");
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        if (bar) bar.style.transform = `scaleX(${p})`;
        root.dataset.scrolled = window.scrollY > 40 ? "true" : "false";
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // ---- Lenis + GSAP (loaded after first paint) ---------------------------
    let cancelled = false;
    const start = async () => {
      const [{ gsap, ScrollTrigger }, LenisMod] = await Promise.all([
        loadGsap(),
        reduce ? Promise.resolve(null) : import("lenis"),
      ]);
      if (cancelled) return;

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (LenisMod && finePointer) {
        const lenis = new LenisMod.default({ lerp: 0.09, wheelMultiplier: 0.95 });
        setLenis(lenis);
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        cleanups.push(() => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          setLenis(undefined);
        });
        // Honour a hash on first load.
        if (location.hash) requestAnimationFrame(() => scrollToId(location.hash.slice(1)));
      }

      if (!reduce) {
        const mm = gsap.matchMedia();
        mm.add(
          { desktop: "(min-width: 1024px)", tablet: "(min-width: 640px) and (max-width: 1023px)", mobile: "(max-width: 639px)" },
          (ctx) => {
            const { desktop, tablet } = ctx.conditions as Record<string, boolean>;
            const factor = desktop ? 1 : tablet ? 0.5 : 0.25;
            gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
              const strength = parseFloat(el.dataset.parallax || "0.12") * factor;
              gsap.fromTo(
                el,
                { yPercent: -strength * 50 },
                {
                  yPercent: strength * 50,
                  ease: "none",
                  scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
                },
              );
            });

            // Curtains: light sections open from a framed panel to full width as
            // they enter, and close again as they leave — cuts, not hard edges.
            const inset = desktop ? 5 : tablet ? 3 : 2.5;
            const framed = `inset(0% ${inset}% 0% ${inset}%)`;
            gsap.utils.toArray<HTMLElement>("[data-curtain]").forEach((el) => {
              const vh = window.innerHeight;
              const total = el.offsetHeight + vh;
              const enter = vh * 0.75;
              const exit = vh * 0.6;
              gsap
                .timeline({ scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } })
                .fromTo(el, { clipPath: framed }, { clipPath: "inset(0% 0% 0% 0%)", duration: enter, ease: "power1.out" })
                .to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: Math.max(1, total - enter - exit), ease: "none" })
                .to(el, { clipPath: framed, duration: exit, ease: "power1.in" });
            });
          },
        );
        cleanups.push(() => mm.revert());
      }
      // Images and fonts can shift trigger positions after load.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      cleanups.push(() => window.removeEventListener("load", refresh));
    };

    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1200 });
    else setTimeout(() => void start(), 300);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
