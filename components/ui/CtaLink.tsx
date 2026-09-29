import type { TrackEvent } from "@/lib/analytics";
import { cx } from "@/lib/utils";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ink" | "ghost-dark" | "ghost-light";
  track?: TrackEvent;
  trackLabel?: string;
  cursor?: string;
  className?: string;
  external?: boolean;
};

/**
 * Anchor-styled CTA. In-page links (#id) are intercepted by the motion layer
 * for smooth scrolling; clicks are tracked through data attributes so this
 * stays a Server Component.
 */
export function CtaLink({ href, children, variant = "ghost-dark", track, trackLabel, cursor = "Let’s connect →", className, external }: Props) {
  return (
    <a
      href={href}
      className={cx("btn", `btn-${variant}`, className)}
      data-track={track}
      data-track-label={trackLabel}
      data-cursor={cursor}
      data-magnetic
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <span className="arrow" aria-hidden>
        →
      </span>
    </a>
  );
}
