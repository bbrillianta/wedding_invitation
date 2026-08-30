import { SparkleField } from "@/components/layout/SparkleField";
import { CloudShape, cloudAspect } from "@/components/intro/CloudShape";
import type { CloudDepth, CloudVariant } from "@/components/intro/CloudShape";

/**
 * Low cloud bank sitting along the bottom of the sky, the same painted
 * cumulus the intro flies through seen from further off. Positions are
 * fixed rather than seeded so this layer stays cheap and predictable —
 * it's scenery behind the content, not a field to fly through. Sunk far
 * enough below the viewport that only a soft sliver shows, so it never
 * crosses a section's text.
 */
const HORIZON_CLOUDS: Array<{
  left: number;
  bottom: number;
  width: number;
  drift: number;
  depth: CloudDepth;
  variant: CloudVariant;
  flip?: boolean;
}> = [
  { left: 22, bottom: -28, width: 56, drift: 150, depth: "back", variant: 0 },
  { left: 86, bottom: -31, width: 50, drift: 178, depth: "back", variant: 6, flip: true },
];

/**
 * Fixed, full-viewport sky mounted once in the root layout: the pale
 * horizon end of the palette, a field of four-pointed sparkles, and a
 * bank of clouds low on the screen.
 *
 * Pure CSS animation (no canvas/JS) so it costs nothing on mobile and
 * respects prefers-reduced-motion via globals.css.
 */
export function StarfieldBackground() {
  return (
    <div className="starfield cloud-band" aria-hidden="true">
      {/* White, matching the intro's sparkles — `sparkle-glow`'s halo is
          what keeps them visible against the pale lower sky rather than
          a blue tint standing in for white. */}
      <SparkleField className="text-starlight sparkle-glow" />

      {HORIZON_CLOUDS.map((cloud, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 opacity-65"
          style={{
            left: `${cloud.left}%`,
            bottom: `${cloud.bottom}%`,
            width: `calc(${cloud.width} * var(--cloud-scale) * 1%)`,
            aspectRatio: cloudAspect(cloud.variant),
          }}
        >
          {/* Drift lives on an inner element so its animated transform
              never clobbers the centring translate above. */}
          <div
            className="cloud-drift h-full w-full"
            style={{
              animationDuration: `${cloud.drift}s`,
              animationDelay: `-${cloud.drift / 3}s`,
            }}
          >
            <CloudShape variant={cloud.variant} depth={cloud.depth} flip={cloud.flip} />
          </div>
        </div>
      ))}
    </div>
  );
}
