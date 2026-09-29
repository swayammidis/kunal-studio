import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Instrument_Serif, Inter_Tight, Mrs_Saint_Delafield } from "next/font/google";
import { brand, faqs, hero } from "@/content/site";
import "./globals.css";

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const text = Inter_Tight({
  variable: "--font-text",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const hand = Mrs_Saint_Delafield({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const title = "Studio Kunal Photography | Wedding Photography & Cinematography";
const description =
  "International wedding photography and cinematography across North America, India and destination weddings.";

export const metadata: Metadata = {
  metadataBase: new URL(brand.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: brand.url,
    siteName: brand.name,
    title,
    description,
    images: [{ url: hero.imageDesktop.src, width: hero.imageDesktop.width, height: hero.imageDesktop.height, alt: "Bride and groom on a grand staircase — Studio Kunal Photography" }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [hero.imageDesktop.src],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${brand.url}/#business`,
    name: brand.name,
    url: brand.url,
    image: `${brand.url}${hero.imageDesktop.src}`,
    email: brand.email,
    description:
      "Studio Kunal Photography is an international photography company dedicated to capturing timeless stories with authenticity and emotion — wedding photography and cinematography across North America and India, and destination weddings worldwide.",
    areaServed: ["North America", "India"],
    knowsAbout: ["Wedding photography", "Wedding cinematography", "Destination weddings", "Documentary wedding photography", "Editorial wedding photography"],
    sameAs: [brand.instagram, brand.youtube],
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${hand.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        {GTM_ID ? (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
