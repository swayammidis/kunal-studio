"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop-only cursor. A small dot follows the pointer; over elements with
 * [data-cursor="Label"] it expands into a captioned disc. Elements with
 * [data-magnetic] gently lean toward the pointer. Nothing here is required
 * to use the site — native focus and hover states remain.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const update = () => setEnabled(mq.matches && !reduce);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const el = dot.current!;
    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    let visible = false;
    let magnet: HTMLElement | null = null;

    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.2;
      cur.y += (pos.y - cur.y) * 0.2;
      el.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        el.dataset.visible = "true";
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        magnet.style.transform = `translate(${dx * 0.18}px, ${dy * 0.28}px)`;
      }
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      const text = labelled?.dataset.cursor ?? "";
      el.dataset.mode = labelled ? "label" : t.closest("a,button,[role=button],label,summary") ? "link" : "default";
      if (label.current) label.current.textContent = text;

      const m = t.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) {
        if (magnet) magnet.style.transform = "";
        magnet = m;
        if (magnet) magnet.style.transition = "transform 0.5s cubic-bezier(0.19,1,0.22,1)";
      }
    };

    const onLeave = () => {
      visible = false;
      el.dataset.visible = "false";
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
      if (magnet) magnet.style.transform = "";
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dot}
      aria-hidden
      data-mode="default"
      data-visible="false"
      className="group pointer-events-none fixed left-0 top-0 z-[100] mix-blend-normal"
    >
      <div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-[width,height,background-color,opacity,border-color] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          h-2.5 w-2.5 border border-transparent bg-ivory opacity-0 mix-blend-difference
          group-data-[visible=true]:opacity-100
          group-data-[mode=link]:h-11 group-data-[mode=link]:w-11 group-data-[mode=link]:border-ivory group-data-[mode=link]:bg-transparent
          group-data-[mode=label]:h-28 group-data-[mode=label]:w-28 group-data-[mode=label]:bg-ivory group-data-[mode=label]:mix-blend-normal
          group-data-[pressed=true]:scale-90"
      >
        <span
          ref={label}
          className="t-label whitespace-nowrap text-[0.6rem] text-ink opacity-0 transition-opacity duration-300 group-data-[mode=label]:opacity-100"
        />
      </div>
    </div>
  );
}
