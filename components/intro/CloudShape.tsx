import Image from "next/image";
import { withBasePath } from "@/lib/utils";

/**
 * Real painted cloud artwork (couple-supplied, trimmed to its own bounds
 * and converted to WebP — see `public/images/clouds/`), rather than
 * hand-built SVG. Every earlier attempt at drawing these procedurally —
 * a scalloped mask, then a lobe cluster with unified shading — converged
 * on an approximation of a painted cloud's construction without ever
 * being one; matching specific reference art is what raster images are
 * for.
 *
 * Depth (`back`/`mid`/`front`) is expressed the same way it was for the
 * SVG version: a CSS filter standing in for aerial perspective (paler
 * and flatter the further away, softened by a touch of blur) rather
 * than any change to the source art, so the same seven images serve at
 * every distance.
 */

export type CloudVariant = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CloudDepth = "back" | "mid" | "front";

type CloudArt = {
  src: string;
  /** Natural pixel size, after trimming to the art's own bounds. */
  width: number;
  height: number;
};

const SHAPES: Record<CloudVariant, CloudArt> = {
  // Wide low bank, lavender tail trailing off to one side.
  0: { src: "/images/clouds/cloud-01-banner.webp", width: 1899, height: 783 },
  // Rounded compact dome, pink crown into a lavender base.
  1: { src: "/images/clouds/cloud-02-dome.webp", width: 1676, height: 865 },
  // Tall triangular peak — reads well as the tallest mass in a bank.
  2: { src: "/images/clouds/cloud-03-peak.webp", width: 1496, height: 921 },
  // Glossy, more sharply lit dome — a distinct accent, used sparingly.
  3: { src: "/images/clouds/cloud-04-glossy.webp", width: 1399, height: 900 },
  // Long two-pronged trailing tail, widest of the set.
  4: { src: "/images/clouds/cloud-05-trail.webp", width: 2119, height: 612 },
  // The biggest mass — the dominant cloud a bank builds up to.
  5: { src: "/images/clouds/cloud-06-tower.webp", width: 1516, height: 938 },
  // Rounded dome, mirror-companion to variant 1 with its own silhouette.
  6: { src: "/images/clouds/cloud-07-drift.webp", width: 1716, height: 812 },
};

/** Every cloud element must be sized to its variant's own aspect ratio. */
export function cloudAspect(variant: CloudVariant): string {
  const { width, height } = SHAPES[variant];
  return `${width} / ${height}`;
}

/**
 * Aerial perspective as a filter stack, not a recolour: distance mutes
 * contrast and saturation and adds a whisper of blur, which is what
 * separates a far cloud from a near one when both are the same
 * artwork. `front` is the art exactly as painted.
 */
const DEPTH_FILTER: Record<CloudDepth, string | undefined> = {
  back: "brightness(1.14) saturate(0.42) contrast(0.92) blur(0.6px)",
  mid: "brightness(1.05) saturate(0.74) contrast(0.97)",
  front: undefined,
};

export function CloudShape({
  variant,
  depth,
  flip,
}: {
  variant: CloudVariant;
  depth: CloudDepth;
  /** Mirrors the artwork, so one image can read as two different clouds. */
  flip?: boolean;
}) {
  const { src } = SHAPES[variant];
  return (
    <div
      className="relative h-full w-full"
      aria-hidden="true"
      style={{
        filter: DEPTH_FILTER[depth],
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <Image
        src={withBasePath(src)}
        alt=""
        fill
        sizes="(max-width: 700px) 70vw, 45vw"
        className="object-contain"
      />
    </div>
  );
}
