"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data";
import { lockScroll } from "@/lib/scroll";
import { pad } from "@/lib/utils";

type Props = { project: Project; startIndex: number; onClose: () => void };

export function Lightbox({ project, startIndex, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [shown, setShown] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const total = project.gallery.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + total) % total), [total]);
  const close = useCallback(() => {
    setShown(false);
    window.setTimeout(onClose, 450);
  }, [onClose]);

  useEffect(() => {
    lockScroll(true);
    const raf = requestAnimationFrame(() => setShown(true));
    dialog.current?.focus();
    return () => {
      cancelAnimationFrame(raf);
      lockScroll(false);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = Array.from(dialog.current.querySelectorAll<HTMLElement>("button")).filter((b) => b.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, go]);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const strip = thumbs.current;
    const el = strip?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    if (strip && el) strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    touch.current = null;
  };

  // Only the current frame and its neighbours are mounted (and therefore downloaded).
  const neighbours = new Set([index, (index + 1) % total, (index - 1 + total) % total]);

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — gallery`}
      tabIndex={-1}
      className={`fixed inset-0 z-[95] flex flex-col bg-ink text-ivory outline-none transition-[opacity,clip-path] duration-[700ms] ease-[cubic-bezier(0.77,0,0.18,1)] ${
        shown ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-0 [clip-path:inset(6%_6%_6%_6%)]"
      }`}
    >
      {/* Top bar */}
      <div className="wrap flex h-[var(--header-h)] shrink-0 items-center justify-between gap-4 border-b border-[var(--line-dark)]">
        <div className="min-w-0">
          <p className="t-label text-champ">Our Stories</p>
          <h2 className="truncate font-serif text-xl sm:text-2xl">
            {project.title}
            {project.subtitle ? <span className="text-ivory/50"> — {project.subtitle}</span> : null}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <p className="t-label tabular-nums text-ivory/70" aria-live="polite">
            {pad(index + 1)} / {pad(total)}
          </p>
          <button type="button" onClick={close} className="btn btn-ghost-dark min-h-[44px] px-4" aria-label="Close gallery">
            <span className="max-sm:hidden">Close</span>
            <span aria-hidden>✕</span>
          </button>
        </div>
      </div>

      {/* Stage */}
      <div className="relative min-h-0 flex-1 touch-pan-y" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {project.gallery.map((p, i) =>
          neighbours.has(i) ? (
            <div
              key={p.src}
              className={`absolute inset-3 transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] sm:inset-6 lg:inset-x-28 ${
                i === index ? "scale-100 opacity-100" : "pointer-events-none scale-[1.015] opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <Image
                src={p.src}
                alt={`${project.title} — photograph ${i + 1} of ${total}`}
                fill
                sizes="100vw"
                quality={85}
                placeholder="blur"
                blurDataURL={p.blur}
                className="object-contain"
                draggable={false}
              />
            </div>
          ) : null,
        )}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous photograph"
          className="absolute left-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center border border-[var(--line-dark)] bg-ink/40 backdrop-blur transition-colors hover:bg-ivory hover:text-ink sm:grid lg:left-8"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next photograph"
          className="absolute right-3 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center border border-[var(--line-dark)] bg-ink/40 backdrop-blur transition-colors hover:bg-ivory hover:text-ink sm:grid lg:right-8"
        >
          →
        </button>
      </div>

      {/* Bottom: touch controls + thumbnails */}
      <div className="shrink-0 border-t border-[var(--line-dark)] pb-[env(safe-area-inset-bottom)]">
        <div className="wrap flex items-center justify-between py-2 sm:hidden">
          <button type="button" onClick={() => go(-1)} className="t-label h-11 px-2">
            ← Prev
          </button>
          <span className="t-label text-ivory/45">Swipe</span>
          <button type="button" onClick={() => go(1)} className="t-label h-11 px-2">
            Next →
          </button>
        </div>
        <div ref={thumbs} className="rail hidden gap-2 px-[var(--gutter)] py-3 sm:flex">
          {project.gallery.map((p, i) => (
            <button
              key={p.src}
              type="button"
              data-thumb={i}
              onClick={() => setIndex(i)}
              aria-label={`Show photograph ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-12 shrink-0 overflow-hidden transition-opacity duration-500 ${
                i === index ? "opacity-100 outline outline-1 outline-offset-2 outline-champ" : "opacity-40 hover:opacity-80"
              }`}
            >
              <Image src={p.src} alt="" fill sizes="48px" quality={60} className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
