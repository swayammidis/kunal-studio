import { brand, navLinks } from "@/data";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/Icons";

const social = [
  { label: "Instagram", href: brand.instagram, icon: InstagramIcon, track: "instagram_click" },
  { label: "WhatsApp", href: brand.whatsapp, icon: WhatsAppIcon, track: "whatsapp_click" },
  { label: "YouTube", href: brand.youtube, icon: YouTubeIcon, track: "youtube_click" },
] as const;

export function Footer() {
  return (
    <footer className="theme-dark relative overflow-hidden border-t border-[var(--line-dark)] pb-28 pt-16 lg:pb-10 lg:pt-24">
      <div className="wrap">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-label flex items-center gap-2 text-champ">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-champ" aria-hidden />
              {brand.availability}
            </p>
            <ul className="mt-6 space-y-2">
              {brand.descriptors.map((d) => (
                <li key={d} className="t-label text-ivory/55">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-6">
            <p className="t-label text-ivory/40">Navigate</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="font-serif text-xl text-ivory/85 transition-colors hover:text-champ">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3 lg:col-start-10">
            <p className="t-label text-ivory/40">Follow &amp; message</p>
            <ul className="mt-6 space-y-3">
              {social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-ivory/85 hover:text-champ" data-track={s.track}>
                    <s.icon className="h-5 w-5" />
                    <span className="font-serif text-xl">{s.label}</span>
                    <span className="transition-transform duration-500 group-hover:translate-x-1" aria-hidden>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${brand.email}`} className="mt-2 block break-all text-sm text-ivory/60 hover:text-champ" data-track="email_click">
                  {brand.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Wordmark */}
        <div className="mt-20 border-t border-[var(--line-dark)] pt-8 lg:mt-28">
          <p className="font-serif text-[clamp(3.4rem,15.5vw,16rem)] leading-[0.85] tracking-[-0.03em]" aria-label={brand.name}>
            Studio <em className="serif-em">Kunal</em>
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="t-label tracking-[0.5em] text-champ">Photography</p>
            <p className="t-label text-ivory/45">North America · India · Destination Weddings</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--line-dark)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ivory/45">{brand.copyright}</p>
          <a href="#top" className="t-label text-ivory/60 hover:text-ivory">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
