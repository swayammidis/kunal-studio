import { brand, contact } from "@/data";
import { Photo } from "@/components/ui/Photo";
import { SectionMark } from "@/components/ui/SectionMark";
import { SplitLines } from "@/components/ui/SplitLines";
import { InstagramIcon, MailIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";
import { ContactForm } from "./ContactForm";

const channels = [
  { label: "Email", value: brand.email, href: `mailto:${brand.email}`, icon: MailIcon, track: "email_click" },
  { label: "WhatsApp", value: brand.whatsappDisplay, href: brand.whatsapp, icon: WhatsAppIcon, track: "whatsapp_click", external: true },
  { label: "Instagram", value: brand.instagramHandle, href: brand.instagram, icon: InstagramIcon, track: "instagram_click", external: true },
  { label: "YouTube", value: brand.youtubeHandle, href: brand.youtube, icon: YouTubeIcon, track: "youtube_click", external: true },
] as const;

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="theme-dark relative">
      <div className="grid lg:grid-cols-12">
        {/* Photograph — the final frame */}
        <div className="relative h-[46svh] min-h-[320px] overflow-hidden sm:h-[56svh] lg:sticky lg:top-0 lg:col-span-5 lg:h-[100svh]">
          <div className="absolute inset-x-0 -inset-y-[8%]" data-parallax="0.12">
            <Photo photo={contact.image} alt={contact.imageAlt} sizes="(min-width:1024px) 42vw, 100vw" className="h-full w-full" position="50% 35%" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink/40" />
          <div className="frame-marks m-5 text-ivory/60 lg:m-8" aria-hidden>
            <i />
          </div>
          <p className="t-script absolute bottom-6 left-6 text-[clamp(2.4rem,5vw,4rem)] text-ivory/90 lg:bottom-10 lg:left-10" aria-hidden>
            your story begins here
          </p>
        </div>

        {/* Words + form */}
        <div className="min-w-0 lg:col-span-7">
          <div className="px-[var(--gutter)] py-[clamp(64px,10vw,160px)] lg:px-[clamp(40px,6vw,120px)]">
            <SectionMark number="09" label="Get In Touch" />
            <SplitLines
              id="contact-title"
              className="t-h2 mt-8"
              lines={[[{ t: "We’re so glad" }], [{ t: "you " }, { t: "found us!", em: true }]]}
            />
            <div className="mt-8 max-w-[36rem] space-y-4 text-ivory/75">
              {contact.intro.map((p) => (
                <p key={p} className="t-body" data-reveal="fade">
                  {p}
                </p>
              ))}
            </div>

            <p className="t-label mt-8 flex items-center gap-2 text-champ" data-reveal="fade">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-champ" aria-hidden />
              {brand.availability} · Limited dates available
            </p>

            <div className="mt-12">
              <ContactForm />
            </div>

            {/* Direct channels */}
            <div className="mt-16">
              <p className="t-label text-ivory/50">Or reach us directly</p>
              <ul className="mt-5 grid border-t border-[var(--line-dark)] sm:grid-cols-2">
                {channels.map((c) => (
                  <li key={c.label} className="border-b border-[var(--line-dark)] sm:odd:border-r sm:odd:pr-6 sm:even:pl-6">
                    <a
                      href={c.href}
                      className="group flex items-center gap-4 py-5"
                      data-track={c.track}
                      {...("external" in c && c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <c.icon className="h-5 w-5 shrink-0 text-champ" />
                      <span className="min-w-0">
                        <span className="t-label block text-ivory/50">{c.label}</span>
                        <span className="mt-1 block truncate text-[0.95rem] text-ivory transition-colors group-hover:text-champ">{c.value}</span>
                      </span>
                      <span className="ml-auto transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
