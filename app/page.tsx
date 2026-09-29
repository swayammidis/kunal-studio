import { SiteHeader } from "@/components/navigation/SiteHeader";
import { StickyCta } from "@/components/navigation/StickyCta";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Experience } from "@/components/experience/Experience";
import { Destinations } from "@/components/destinations/Destinations";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { GalleryHost } from "@/components/portfolio/GalleryHost";
import { Films } from "@/components/films/Films";
import { Investment } from "@/components/investment/Investment";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { Faq } from "@/components/faq/Faq";
import { Contact } from "@/components/contact/Contact";
import { Footer } from "@/components/footer/Footer";
import { MotionRoot } from "@/components/animations/MotionRoot";
import { Cursor } from "@/components/animations/Cursor";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Destinations />
        <Portfolio />
        <Films />
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
