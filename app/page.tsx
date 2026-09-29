import { SiteHeader } from "@/components/navigation/SiteHeader";
import { StickyCta } from "@/components/navigation/StickyCta";
import { Hero } from "@/components/hero/Hero";
import { Approach } from "@/components/approach/Approach";
import { Statement } from "@/components/statement/Statement";
import { Experience } from "@/components/experience/Experience";
import { WeddingDay } from "@/components/wedding-story/WeddingDay";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Films } from "@/components/films/Films";
import { Destination } from "@/components/destination/Destination";
import { Investment } from "@/components/investment/Investment";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { Faq } from "@/components/faq/Faq";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { GalleryHost } from "@/components/gallery/GalleryHost";
import { MotionRoot } from "@/components/animations/MotionRoot";
import { Cursor } from "@/components/animations/Cursor";

/**
 * The page is one continuous film:
 * Opening → Approach → "More than photographs" → Experience → A wedding day →
 * Stories → (reel) → Films → The world → Investment → Real couples → Questions → Let's connect.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Approach />
        <Statement />
        <Experience />
        <WeddingDay />
        <Portfolio />
        <Films />
        <Destination />
        <Investment />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <StickyCta />
      <GalleryHost />
      <MotionRoot />
      <Cursor />
    </>
  );
}
