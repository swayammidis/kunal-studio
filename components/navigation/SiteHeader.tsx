"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { brand, menuImage, navLinks } from "@/data";
import { lockScroll, scrollToId } from "@/lib/scroll";
import { pad } from "@/lib/utils";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";

const desktopLinks = navLinks.filter((l) => l.id !== "contact" && l.id !== "destination");

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggle.current?.focus();
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>("a,button"));
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Match the header to the section beneath it (ivory glass over light sections).
  useEffect(() => {
    const root = document.documentElement;
    const light = Array.from(document.querySelectorAll(".theme-light"));
    const visible = new Set<Element>();
    let io: IntersectionObserver | undefined;
    const setup = () => {
      io?.disconnect();
      const line = 36;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
          root.dataset.header = visible.size ? "light" : "dark";
        },
        { rootMargin: `-${line}px 0px -${Math.max(0, window.innerHeight - line - 1)}px 0px` },
      );
      light.forEach((el) => io!.observe(el));
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  // Close the overlay if the viewport grows into desktop layout.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    close(false);
    // Wait for the scroll lock to release before scrolling.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
  };

  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-4 z-[80] bg-ivory px-4 py-3 text-ink t-label">
        Skip to content
      </a>

      <header className="site-header header-intro fixed inset-x-0 top-0 z-[60] text-ivory transition-colors duration-700" data-menu={open ? "open" : undefined}>
        <div
          className="site-header-bg absolute inset-0 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-700"
          aria-hidden
        />
        <div className="wrap relative flex h-[var(--header-h)] items-center justify-between gap-6">
          <a href="#top" className="relative z-[2] flex flex-col leading-none" aria-label="Studio Kunal Photography — back to top">
            <span className="font-serif text-[1.35rem] tracking-[0.02em] sm:text-[1.5rem]">Studio Kunal</span>
            <span className="site-header-accent t-label mt-1 text-[0.56rem] tracking-[0.42em] text-champ transition-colors duration-700">Photography</span>
          </a>

          <nav aria-label="Primary" className="hidden min-[1100px]:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {desktopLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="t-label relative py-2 opacity-75 transition-opacity duration-500 hover:opacity-100 after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-700 hover:after:scale-x-100">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[2] flex items-center gap-3">
            <a href="#contact" className="btn btn-ghost-dark site-header-cta hidden min-h-[44px] px-5 sm:inline-flex" data-track="hero_cta" data-track-label="nav_connect" data-cursor="Let’s connect →" data-magnetic>
              <span>Let&apos;s Connect</span>
              <span className="arrow" aria-hidden>
                →
              </span>
            </a>
            <button
              ref={toggle}
              type="button"
              className="flex h-11 items-center gap-3 pl-2 min-[1100px]:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => {
                setSeen(true);
                setOpen((v) => !v);
              }}
            >
              <span className="t-label">{open ? "Close" : "Menu"}</span>
              <span className="relative block h-3 w-6" aria-hidden>
                <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
                <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-champ" id="scroll-progress" aria-hidden />
      </header>

      {/* Mobile / tablet full-screen editorial menu */}
      <div
        id="mobile-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-0 z-[55] flex flex-col bg-ink transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.77,0,0.18,1)] min-[1100px]:hidden ${
          open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <div className={`absolute inset-0 transition-[opacity,transform] duration-[1400ms] ${open ? "scale-100 opacity-30" : "scale-110 opacity-0"}`} aria-hidden>
          {seen ? (
            <Image src={menuImage.src} alt="" fill sizes="100vw" quality={60} className="object-cover grayscale" placeholder="blur" blurDataURL={menuImage.blur} />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/70 to-ink" />
        </div>

        <nav aria-label="Mobile" className="wrap relative flex flex-1 flex-col justify-center pt-[var(--header-h)]">
          <ul className="flex flex-col">
            {navLinks.map((l, i) => (
              <li key={l.id} className="overflow-hidden border-b border-[var(--line-dark)]">
                <a
                  href={`#${l.id}`}
                  onClick={go(l.id)}
                  className="flex items-baseline gap-5 py-[clamp(0.5rem,1.6vh,1rem)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
                  style={{
                    transform: open ? "none" : "translateY(100%)",
                    opacity: open ? 1 : 0,
                    transitionDelay: open ? `${280 + i * 60}ms` : "0ms",
                  }}
                >
                  <span className="t-label w-6 tabular-nums text-champ">{pad(i + 1)}</span>
                  <span className="font-serif text-[clamp(2rem,8.5vw,3.6rem)] leading-none">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="wrap relative flex flex-wrap items-end justify-between gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 transition-opacity duration-700"
          style={{ opacity: open ? 1 : 0, transitionDelay: open ? "700ms" : "0ms" }}
        >
          <div>
            <p className="t-label text-champ">{brand.availability}</p>
            <a href={`mailto:${brand.email}`} className="mt-2 block text-sm text-ivory/80" data-track="email_click">
              {brand.email}
            </a>
          </div>
          <div className="flex gap-2">
            <a href={brand.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center border border-[var(--line-dark)]" data-track="instagram_click">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid h-11 w-11 place-items-center border border-[var(--line-dark)]" data-track="whatsapp_click">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href={brand.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-11 w-11 place-items-center border border-[var(--line-dark)]" data-track="youtube_click">
              <YouTubeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
