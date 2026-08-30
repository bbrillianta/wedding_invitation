import { cn } from "@/lib/utils";

/**
 * Four-pointed sparkle with concave sides — the star shape the sky
 * uses everywhere (background field, intro sky, section dividers,
 * favicon). Drawn in a 24x24 box centred on (12, 12) so it can be
 * dropped into any viewBox with a translate/scale. The control points
 * sit far out along each ray, which is what keeps the rays thin and
 * needle-like rather than reading as a fat plus sign.
 */
export const SPARKLE_PATH =
  "M12 0C12.45 8.5 15.5 11.55 24 12c-8.5.45-11.55 3.5-12 12-.45-8.5-3.5-11.55-12-12C8.5 11.55 11.55 8.5 12 0z";

export function Sparkle({
  size,
  className,
  style,
}: {
  /** Rendered width/height in px. */
  size: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("overflow-visible", className)}
      style={style}
    >
      <path d={SPARKLE_PATH} />
    </svg>
  );
}
