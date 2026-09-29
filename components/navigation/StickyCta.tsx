"use client";

import { useEffect, useState } from "react";
import { brand } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Mobile / tablet only: a quiet bottom bar that appears after the hero and
 * steps aside while the contact section is on screen.
 */
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contact");
    const footer = document.querySelector("footer");
    const inView = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting);
        else if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      setAtContact(inView.size > 0);
    }, { threshold: 0 });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !atContact;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line-dark)] bg-ink/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="wrap flex items-center gap-3 py-3">
        <div className="hidden min-w-0 flex-1 xs:block">
          <p className="t-label truncate text-champ">{brand.availability}</p>
        </div>
        <a
          href={brand.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-12 w-12 shrink-0 place-items-center border border-[var(--line-dark)]"
          aria-label="Message us on WhatsApp"
          data-track="whatsapp_click"
          data-track-label="sticky_bar"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
        <a href="#contact" className="btn btn-solid min-h-12 flex-1 px-4 xs:flex-none" data-track="hero_cta" data-track-label="sticky_bar">
          <span>Let&apos;s Connect</span>
          <span className="arrow" aria-hidden>
            →
          </span>
        </a>
      </div>
    </div>
  );
}
