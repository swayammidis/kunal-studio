/**
 * Conversion tracking hooks.
 *
 * Events are pushed to `window.dataLayer` (Google Tag Manager) and forwarded to
 * `gtag` when present. No IDs are hard-coded: add GTM / GA4 / Google Ads tags
 * via NEXT_PUBLIC_GTM_ID (see app/layout.tsx) and map these event names to
 * conversions in the tag manager.
 */
export type TrackEvent =
  | "hero_cta"
  | "portfolio_open"
  | "film_play"
  | "custom_quote"
  | "whatsapp_click"
  | "email_click"
  | "instagram_click"
  | "youtube_click"
  | "availability_cta"
  | "contact_form_submit"
  | "contact_form_error";

type DataLayerWindow = Window & {
  dataLayer?: Record<string, unknown>[];
  gtag?: (...args: unknown[]) => void;
};

export function track(event: TrackEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}
