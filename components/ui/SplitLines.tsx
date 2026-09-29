import type { ElementType, ReactNode } from "react";

export type Segment = { t: string; em?: boolean };
export type Line = string | readonly Segment[];

type Props = {
  lines: readonly Line[];
  as?: ElementType;
  className?: string;
  /** "scroll" reveals when the element enters the viewport; "hero" plays immediately via CSS. */
  mode?: "scroll" | "hero" | "none";
  id?: string;
};

/**
 * Server-rendered line splitter. Each line is wrapped in an overflow mask so it
 * can rise into place. The full sentence stays in the DOM as normal text.
 */
export function SplitLines({ lines, as: Tag = "h2", className, mode = "scroll", id }: Props) {
  return (
    <Tag
      id={id}
      className={[className, mode === "hero" ? "hero-lines" : ""].filter(Boolean).join(" ")}
      data-reveal={mode === "scroll" ? "lines" : undefined}
    >
      {lines.map((line, i) => (
        <span className="ln" key={i}>
          <span style={{ ["--i" as string]: i }}>{renderLine(line)}</span>
        </span>
      ))}
    </Tag>
  );
}

function renderLine(line: Line): ReactNode {
  if (typeof line === "string") return line;
  return line.map((seg, i) =>
    seg.em ? (
      <em key={i} className="serif-em">
        {seg.t}
      </em>
    ) : (
      <span key={i}>{seg.t}</span>
    ),
  );
}
