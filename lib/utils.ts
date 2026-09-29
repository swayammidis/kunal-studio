export const pad = (n: number) => String(n).padStart(2, "0");

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

/** First sentences up to roughly `max` characters, never cutting mid-sentence when avoidable. */
export function excerpt(paragraphs: readonly string[], max = 240) {
  const full = paragraphs.join(" ");
  if (full.length <= max) return { text: full, truncated: false };
  const sentences = full.match(/[^.!?]+[.!?]+["”]?\s*/g) ?? [full];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length > max && out) break;
    out += s;
  }
  if (out.length > max * 1.6) out = out.slice(0, max).replace(/\s+\S*$/, "") + "…";
  return { text: out.trim(), truncated: true };
}
