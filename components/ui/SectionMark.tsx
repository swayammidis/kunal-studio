import { cx } from "@/lib/utils";

type Props = {
  number: string;
  label: string;
  className?: string;
};

/** "03 —— OUR STORIES" section marker with a drawn rule. */
export function SectionMark({ number, label, className }: Props) {
  return (
    <div className={cx("flex items-center gap-4", className)} data-reveal="fade">
      <span className="t-label tabular-nums">{number}</span>
      <span className="h-px w-12 bg-current opacity-50" data-reveal="draw" aria-hidden />
      <span className="t-label">{label}</span>
    </div>
  );
}
