/**
 * Google Ads / campaign attribution.
 *
 * On landing, UTM parameters and click identifiers are read from the URL and
 * kept for the visit (sessionStorage) and as first touch (localStorage, 90 days).
 * They are attached to every tracked event and to the inquiry payload, so leads
 * can be matched to campaigns (including offline conversion import via gclid).
 *
 * In-page navigation only ever changes the #hash, so the original query string
 * stays in the address bar for the whole visit.
 */
export const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_KEYS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  first_seen?: string;
};

const SESSION_KEY = "sk_attribution";
const FIRST_TOUCH_KEY = "sk_attribution_first";
const FIRST_TOUCH_TTL = 90 * 24 * 60 * 60 * 1000;

function safeGet(storage: Storage, key: string): Attribution | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function safeSet(storage: Storage, key: string, value: Attribution) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, blocked) — attribution stays in memory only */
  }
}

let memory: Attribution | null = null;

/** Read campaign parameters from the current URL. Call once on load. */
export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const k of ATTRIBUTION_KEYS) {
    const v = params.get(k);
    if (v) fromUrl[k] = v.slice(0, 200);
  }
  const hasCampaign = Object.keys(fromUrl).length > 0;
  const existing = safeGet(sessionStorage, SESSION_KEY);

  const current: Attribution =
    hasCampaign || !existing
      ? {
          ...fromUrl,
          landing_page: window.location.pathname + window.location.search,
          referrer: document.referrer ? document.referrer.slice(0, 300) : undefined,
          first_seen: new Date().toISOString(),
        }
      : existing;
  safeSet(sessionStorage, SESSION_KEY, current);

  const first = safeGet(localStorage, FIRST_TOUCH_KEY);
  const expired = first?.first_seen ? Date.now() - Date.parse(first.first_seen) > FIRST_TOUCH_TTL : true;
  if (hasCampaign && (!first || expired)) safeSet(localStorage, FIRST_TOUCH_KEY, current);

  memory = current;
  return current;
}

/** Attribution for the current visit (plus first touch, prefixed `first_`). */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const current = memory ?? safeGet(sessionStorage, SESSION_KEY) ?? {};
  const first = safeGet(localStorage, FIRST_TOUCH_KEY) ?? {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(current)) if (v) out[k] = v;
  for (const k of ATTRIBUTION_KEYS) if (first[k]) out[`first_${k}`] = first[k]!;
  return out;
}
