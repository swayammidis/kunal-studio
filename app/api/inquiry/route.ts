/**
 * Inquiry endpoint for the Get In Touch form.
 *
 * Delivery is provider-agnostic: set INQUIRY_WEBHOOK_URL to any endpoint that
 * accepts a JSON POST (Formspree, Make, Zapier, a Google Apps Script, a CRM…).
 * When it is not configured the endpoint answers 503 and the form offers a
 * pre-filled email / WhatsApp fallback, so no inquiry is silently lost.
 */
const MAX = { short: 200, long: 5000 };

type Inquiry = {
  name: string;
  contact: string;
  date?: string;
  location?: string;
  eventType?: string;
  coverage?: string;
  vision?: string;
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Campaign attribution (utm_*, gclid, …) captured on landing — flat string map only. */
function cleanAttribution(v: unknown): Record<string, string> {
  if (!v || typeof v !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(v as Record<string, unknown>).slice(0, 30)) {
    if (/^[a-z_]{1,40}$/.test(k) && typeof val === "string") out[k] = val.slice(0, 300);
  }
  return out;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid-json" }, { status: 400 });
  }

  // Honeypot: pretend success for bots.
  if (clean(body.company, MAX.short)) return Response.json({ ok: true });

  const inquiry: Inquiry = {
    name: clean(body.name, MAX.short),
    contact: clean(body.contact, MAX.short),
    date: clean(body.date, 40),
    location: clean(body.location, MAX.short),
    eventType: clean(body.eventType, MAX.short),
    coverage: clean(body.coverage, 40),
    vision: clean(body.vision, MAX.long),
  };

  if (!inquiry.name || !inquiry.contact) {
    return Response.json({ ok: false, error: "missing-fields" }, { status: 422 });
  }

  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[inquiry] INQUIRY_WEBHOOK_URL is not set — inquiry not delivered:", inquiry.name);
    return Response.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        ...inquiry,
        attribution: cleanAttribution(body.attribution),
        source: "studiokunalphotography.com landing page",
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error("[inquiry] delivery failed", err);
    return Response.json({ ok: false, error: "delivery-failed" }, { status: 502 });
  }
}
