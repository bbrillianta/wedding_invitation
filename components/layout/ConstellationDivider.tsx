import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SPARKLE_PATH } from "@/components/ui/Sparkle";

/**
 * Thin hairline strung between a few four-pointed sparkles, used
 * between sections instead of a plain <hr> to carry the sky theme into
 * the content. It widens into place on scroll, which gives the gap
 * between two sections a beat of its own instead of a static rule.
 *
 * Colour is inherited from the wrapper so the same divider can sit on
 * the pale invitation sky (rose, the default) and on the hero's deep
 * blue (passed in as a light tone).
 */
export function ConstellationDivider({
  className,
  delay = 0,
}: {
  className?: string;
  /** Lets the hero slot this into its own entrance stagger. */
  delay?: number;
}) {
  return (
    <Reveal
      className={cn("flex justify-center py-2 text-blossom-600", className)}
      y={0}
      scale={0.7}
      delay={delay}
      duration={0.9}
    >
      <svg
        width="220"
        height="24"
        viewBox="0 0 220 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M0 12 H70 M150 12 H220 M70 12 L95 4 L120 16 L150 12"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.55"
        />
        {/* Each sparkle is the shared 24x24 glyph scaled about its own
            centre and dropped onto a node of the line. */}
        {[
          { x: 70, y: 12, s: 0.62 },
          { x: 95, y: 4, s: 0.46 },
          { x: 120, y: 16, s: 0.85 },
          { x: 150, y: 12, s: 0.46 },
        ].map((node) => (
          <path
            key={`${node.x}-${node.y}`}
            d={SPARKLE_PATH}
            fill="currentColor"
            transform={`translate(${node.x} ${node.y}) scale(${node.s}) translate(-12 -12)`}
          />
        ))}
      </svg>
    </Reveal>
  );
}
