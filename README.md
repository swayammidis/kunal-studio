# Studio Kunal Photography — landing page

Google Ads landing page for Studio Kunal Photography: international wedding photography and cinematography across North America, India and destination weddings.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger and Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Environment

Copy `.env.example` to `.env.local`:

| Variable | Purpose |
| --- | --- |
| `INQUIRY_WEBHOOK_URL` | Where Get In Touch inquiries are POSTed as JSON (Formspree, Make, Zapier, Apps Script, CRM…). If it is unset, the form shows a pre-filled email / WhatsApp fallback so no lead is lost. |
| `NEXT_PUBLIC_GTM_ID` | Optional Google Tag Manager container. GA4 and Google Ads conversion tags are configured inside GTM. |

## Conversion tracking

Events are pushed to `window.dataLayer` (and `gtag` if present) from [lib/analytics.ts](lib/analytics.ts). No tracking IDs are hard-coded. Map these in GTM:

| Event | Fired when |
| --- | --- |
| `hero_cta` | Hero / navigation / sticky bar "Let's Connect" and "See Our Magic" (`label` says which) |
| `portfolio_open` | A story gallery is opened (`project`) |
| `film_play` | A film is played (`film`, `position`) |
| `custom_quote` | "Get a Custom Quote" |
| `availability_cta` | "Check Availability" / "Let's Create Your Film" CTAs |
| `whatsapp_click`, `email_click`, `instagram_click`, `youtube_click` | Contact channels |
| `contact_form_submit` | Inquiry delivered successfully — **use this as the primary Google Ads conversion** |
| `contact_form_error` | Delivery failed and the email/WhatsApp fallback was shown |

Any element can be tracked declaratively with `data-track="<event>"`.

## Content

All copy lives in [content/site.ts](content/site.ts) and was taken from the current studiokunalphotography.com pages: home, portfolio, investment, testimonials and get-in-touch. Do not add awards, statistics, venues, prices, packages or reviews that the studio has not published.

The films are the nine YouTube videos from the current Cinematic Films page. Their posters are YouTube thumbnails, and the players load only when someone presses play.

## Images

Web-ready masters live in `public/images`. `next/image` serves responsive AVIF/WebP variants from them. [content/images.json](content/images.json) holds each image's dimensions and a blur placeholder.

To add or replace photos:

1. Put the originals in `assets-src/` (git-ignored) and list them in `assets-src/manifest.json`.
2. Run `node scripts/optimize-images.mjs` to regenerate `public/images` and `content/images.json`.

## Architecture

```
app/                 layout (fonts, SEO, JSON-LD), page, globals.css, api/inquiry, robots, sitemap
content/             site.ts (all copy + data), images.json (generated)
components/
  navigation/        SiteHeader (fixed header + full-screen mobile menu), StickyCta (mobile)
  hero/              Hero — art-directed <picture>, CSS-only intro animation
  about/             01 Our Approach — collage + principles
  experience/        02 The Experience — sticky storytelling stage
  destinations/      North America → India → Destination (pinned horizontal on desktop, swipe on touch)
  portfolio/         03 Our Stories — pinned exhibit, mobile rail, lazy fullscreen Lightbox
  films/             04 Cinematic Films — featured poster, film strip, video modal
  investment/        05 Investment
  testimonials/      06 Testimonials — snap rail with expandable stories
  faq/               07 FAQ — accessible accordion
  contact/           08 Get In Touch — form + direct channels
  footer/
  animations/        MotionRoot (reveals, Lenis, parallax, anchors, tracking), Cursor
  ui/                SplitLines, SectionMark, Photo, CtaLink, Icons
lib/                 analytics, gallery event bus, scroll helpers, lazy GSAP loader
```

- Sections are Server Components. Client components are limited to interactive islands: header, galleries, sliders, films, FAQ, form, cursor and the motion layer.
- GSAP, ScrollTrigger and Lenis are imported dynamically after first paint. The lightbox is only downloaded the first time a story is opened.
- The hero headline and photograph animate with CSS alone, so there is no loading screen and no dependency on JavaScript.
- Scroll reveals apply only after JS adds `html.motion`, so content stays visible without JavaScript.
- `prefers-reduced-motion` disables smooth scrolling, pinning, parallax and reveals.
- The custom cursor and magnetic buttons run only on fine-pointer screens 1024px and wider.
