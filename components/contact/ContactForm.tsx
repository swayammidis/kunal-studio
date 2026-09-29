"use client";

import { useId, useRef, useState } from "react";
import { brand, contact } from "@/content/site";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<"name" | "contact", string>>;

const coverageOptions = ["Photography", "Cinematography", "Both"] as const;
const eventSuggestions = ["Wedding", "Pre-wedding shoot", "Engagement", "Proposal", "Special event"];

function buildMailto(data: Record<string, string>) {
  const body = [
    `Name: ${data.name}`,
    `Email / Phone: ${data.contact}`,
    `Event date: ${data.date || "-"}`,
    `Event location: ${data.location || "-"}`,
    `Type of event: ${data.eventType || "-"}`,
    `Coverage: ${data.coverage || "-"}`,
    "",
    data.vision || "",
  ].join("\n");
  return `mailto:${brand.email}?subject=${encodeURIComponent(`Wedding inquiry — ${data.name}`)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [fallback, setFallback] = useState<string>("");

  const validate = (data: Record<string, string>): Errors => {
    const e: Errors = {};
    if (!data.name?.trim()) e.name = "Please tell us your name.";
    const c = data.contact?.trim() ?? "";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c);
    const isPhone = /^[+()\-\s\d]{7,}$/.test(c);
    if (!c) e.contact = "Please share an email or phone number.";
    else if (!isEmail && !isPhone) e.contact = "Please enter a valid email or phone number.";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    const data = Object.fromEntries(Array.from(fd.entries()).map(([k, v]) => [k, String(v)]));
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      const firstKey = Object.keys(e)[0];
      form.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("not-delivered");
      setStatus("sent");
      track("contact_form_submit", { coverage: data.coverage, event_type: data.eventType });
    } catch {
      setFallback(buildMailto(data));
      setStatus("error");
      track("contact_form_error");
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-[var(--line-dark)] p-8 sm:p-12" role="status">
        <p className="t-label text-champ">Inquiry received</p>
        <p className="t-h3 mt-5">{contact.success}</p>
        <p className="t-body mt-4 text-ivory/70">{contact.intro[1]}</p>
      </div>
    );
  }

  const field = (name: keyof Errors) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
  });

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby={`${uid}-req`}>
      <p id={`${uid}-req`} className="t-label text-ivory/45 sm:col-span-2">
        Fields marked * are required
      </p>

      {/* Honeypot — hidden from people, visible to naive bots */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={`${uid}-name`} className="t-label text-ivory/70">
          Name *
        </label>
        <input id={`${uid}-name`} name="name" type="text" autoComplete="name" required className="field" placeholder="Your names" {...field("name")} />
        {errors.name ? (
          <p id={`${uid}-name-err`} className="mt-2 text-sm text-[#e0a88c]">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${uid}-contact`} className="t-label text-ivory/70">
          Email / Phone number *
        </label>
        <input id={`${uid}-contact`} name="contact" type="text" inputMode="email" autoComplete="email" required className="field" placeholder="How can we reach you?" {...field("contact")} />
        {errors.contact ? (
          <p id={`${uid}-contact-err`} className="mt-2 text-sm text-[#e0a88c]">
            {errors.contact}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${uid}-date`} className="t-label text-ivory/70">
          Event date
        </label>
        <input id={`${uid}-date`} name="date" type="date" className="field min-h-[3.2rem] [color-scheme:dark]" />
      </div>

      <div>
        <label htmlFor={`${uid}-location`} className="t-label text-ivory/70">
          Event location
        </label>
        <input id={`${uid}-location`} name="location" type="text" autoComplete="off" className="field" placeholder="City, country" />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-type`} className="t-label text-ivory/70">
          Type of event
        </label>
        <input id={`${uid}-type`} name="eventType" type="text" list={`${uid}-types`} className="field" placeholder="Wedding, pre-wedding, engagement…" />
        <datalist id={`${uid}-types`}>
          {eventSuggestions.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <fieldset className="sm:col-span-2">
        <legend className="t-label text-ivory/70">Photography / Cinematography / Both</legend>
        <div className="mt-4 grid grid-cols-1 border border-[var(--line-dark)] min-[400px]:grid-cols-3">
          {coverageOptions.map((o, i) => (
            <label key={o} className={cx("relative min-w-0 cursor-pointer", i > 0 && "border-t border-[var(--line-dark)] min-[400px]:border-l min-[400px]:border-t-0")}>
              <input type="radio" name="coverage" value={o} className="peer sr-only" />
              <span className="t-label flex min-h-[52px] items-center justify-center px-2 text-center text-[0.62rem] text-ivory/60 transition-colors duration-500 peer-checked:bg-ivory peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-champ sm:text-[0.6875rem]">
                {o}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-vision`} className="t-label text-ivory/70">
          Tell us about your vision
        </label>
        <textarea id={`${uid}-vision`} name="vision" rows={4} className="field resize-y" placeholder="Your celebrations, your story, anything you'd like us to know." />
      </div>

      <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "sending"} className="btn btn-solid w-full sm:w-auto disabled:opacity-60" data-cursor="Send →" data-magnetic>
          <span>{status === "sending" ? "Sending…" : "Send Inquiry"}</span>
          <span className="arrow" aria-hidden>
            →
          </span>
        </button>
        <p className="t-label text-ivory/45">Or email {brand.email}</p>
      </div>

      <div aria-live="assertive" className="sm:col-span-2">
        {status === "error" ? (
          <div className="border border-[#e0a88c]/40 p-5 text-sm leading-relaxed text-ivory/85">
            We couldn&apos;t send your inquiry just now.{" "}
            <a href={fallback} className="underline underline-offset-4" data-track="email_click">
              Send it by email instead
            </a>{" "}
            (your details are pre-filled) or{" "}
            <a href={brand.whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4" data-track="whatsapp_click">
              message us on WhatsApp
            </a>
            .
          </div>
        ) : null}
      </div>
    </form>
  );
}
