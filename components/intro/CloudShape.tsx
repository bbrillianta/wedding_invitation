/**
 * Dusk clouds, drawn as soft-edged volumetric masses rather than a
 * silhouette of circles.
 *
 * The trick is that nothing here is *drawn* as a cloud — each variant is
 * a mask built from overlapping ellipses whose alpha falls off toward
 * their own edges. Where lobes overlap, the mask saturates to fully
 * opaque, so the interior is solid while the rim stays feathered and
 * irregular. A single rect carrying a vertical gradient is then painted
 * through that mask, which is what gives every cloud one continuous
 * shading ramp instead of per-puff seams: cool and shadowed on top,
 * warm where the low sun still catches the underside.
 *
 * Masks and gradients are rendered once by <CloudDefs/> and referenced
 * by `url(#…)` from every cloud instance — `url()` resolves across the
 * whole document, so ~40 clouds share three masks and a handful of
 * gradients rather than each carrying its own copy.
 */

export type CloudVariant = 0 | 1 | 2;
export type CloudDepth = "back" | "mid" | "front";

/**
 * Lobes are authored in a 200x110 box for legibility and normalized to
 * the 0..1 objectBoundingBox units the mask needs. Because width and
 * height normalize independently against that same 200:110 element
 * aspect, `rx === ry` here still renders as a true circle on screen —
 * squashing only happens where a lobe deliberately sets ry < rx.
 */
const BOX_W = 200;
const BOX_H = 110;

type Lobe = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  /** Wisps fade from their centre, so they read as ragged vapour. */
  wisp?: boolean;
};

const SHAPES: Record<CloudVariant, Lobe[]> = {
  // Wide and layered — a long cumulus bank with a flat, dragging base.
  0: [
    { cx: 100, cy: 86, rx: 82, ry: 17 },
    { cx: 98, cy: 72, rx: 66, ry: 26 },
    { cx: 40, cy: 76, rx: 24, ry: 24 },
    { cx: 62, cy: 64, rx: 30, ry: 30 },
    { cx: 84, cy: 70, rx: 25, ry: 25 },
    { cx: 99, cy: 54, rx: 33, ry: 33 },
    { cx: 124, cy: 66, rx: 27, ry: 27 },
    { cx: 147, cy: 75, rx: 22, ry: 22 },
    { cx: 166, cy: 82, rx: 17, ry: 17 },
    { cx: 24, cy: 87, rx: 17, ry: 11, wisp: true },
    { cx: 182, cy: 88, rx: 18, ry: 9, wisp: true },
    { cx: 114, cy: 45, rx: 14, ry: 14, wisp: true },
  ],
  // Taller and off-centre — a building cumulus with the mass to one side.
  1: [
    { cx: 102, cy: 88, rx: 80, ry: 16 },
    { cx: 104, cy: 72, rx: 68, ry: 24 },
    { cx: 52, cy: 76, rx: 21, ry: 21 },
    { cx: 74, cy: 64, rx: 28, ry: 28 },
    { cx: 93, cy: 48, rx: 31, ry: 31 },
    { cx: 116, cy: 43, rx: 27, ry: 27 },
    { cx: 134, cy: 60, rx: 28, ry: 28 },
    { cx: 156, cy: 74, rx: 23, ry: 23 },
    { cx: 32, cy: 85, rx: 18, ry: 12, wisp: true },
    { cx: 174, cy: 84, rx: 15, ry: 12, wisp: true },
    { cx: 104, cy: 30, rx: 15, ry: 13, wisp: true },
  ],
  // Low and broken — flatter stratocumulus that trails off at both ends.
  2: [
    { cx: 100, cy: 88, rx: 84, ry: 15 },
    { cx: 100, cy: 78, rx: 72, ry: 20 },
    { cx: 46, cy: 78, rx: 24, ry: 21 },
    { cx: 72, cy: 71, rx: 27, ry: 24 },
    { cx: 100, cy: 65, rx: 30, ry: 27 },
    { cx: 128, cy: 73, rx: 25, ry: 22 },
    { cx: 154, cy: 81, rx: 20, ry: 17 },
    { cx: 88, cy: 58, rx: 18, ry: 16, wisp: true },
    { cx: 18, cy: 88, rx: 20, ry: 9, wisp: true },
    { cx: 182, cy: 88, rx: 20, ry: 9, wisp: true },
  ],
};

/**
 * Fraction of each solid lobe's radii repainted as flat white underneath
 * the feathered pass. Without it the mask only ever reaches full alpha
 * at lobe centres, so the hollows *between* lobes stay semi-transparent
 * and the sky shows through as a dark notch in the cloud's middle. This
 * inner pass floods those hollows while leaving the outer third of every
 * lobe to the gradients, which is where the soft silhouette comes from.
 */
const CORE_FILL = 0.68;

/**
 * Body ramps double as aerial perspective: the far layer is washed out
 * toward the sky's own colours, the near layer keeps its full range.
 * Every ramp runs shadowed-cool at the top to warm-lit at the base.
 */
const BODY: Record<CloudDepth, Array<[number, string]>> = {
  back: [
    [0, "#71737f"],
    [0.45, "#948f9b"],
    [0.78, "#c1a99e"],
    [1, "#d6bda9"],
  ],
  mid: [
    [0, "#63667c"],
    [0.42, "#8f8a9c"],
    [0.76, "#d0ad99"],
    [1, "#eec7a0"],
  ],
  front: [
    [0, "#5b5f78"],
    [0.4, "#8d879e"],
    [0.74, "#dab092"],
    [1, "#f8d2a4"],
  ],
};

export function CloudDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <defs>
        {/* Core lobes hold solid through the middle then feather out;
            wisps start fading almost immediately. */}
        <radialGradient id="cloud-core">
          <stop offset="0" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.95" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cloud-wisp">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        {(Object.keys(BODY) as CloudDepth[]).map((depth) => (
          <linearGradient key={depth} id={`cloud-body-${depth}`} x1="0" y1="0" x2="0.12" y2="1">
            {BODY[depth].map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        ))}

        {(Object.keys(SHAPES) as unknown as CloudVariant[]).map((variant) => (
          <mask
            key={variant}
            id={`cloud-mask-${variant}`}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
          >
            {SHAPES[variant]
              .filter((lobe) => !lobe.wisp)
              .map((lobe, i) => (
                <ellipse
                  key={`fill-${i}`}
                  cx={lobe.cx / BOX_W}
                  cy={lobe.cy / BOX_H}
                  rx={(lobe.rx * CORE_FILL) / BOX_W}
                  ry={(lobe.ry * CORE_FILL) / BOX_H}
                  fill="#fff"
                />
              ))}
            {SHAPES[variant].map((lobe, i) => (
              <ellipse
                key={`edge-${i}`}
                cx={lobe.cx / BOX_W}
                cy={lobe.cy / BOX_H}
                rx={lobe.rx / BOX_W}
                ry={lobe.ry / BOX_H}
                fill={lobe.wisp ? "url(#cloud-wisp)" : "url(#cloud-core)"}
              />
            ))}
          </mask>
        ))}
      </defs>
    </svg>
  );
}

export function CloudShape({ variant, depth }: { variant: CloudVariant; depth: CloudDepth }) {
  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      className="h-full w-full overflow-visible"
      aria-hidden="true"
    >
      <rect
        width="1"
        height="1"
        fill={`url(#cloud-body-${depth})`}
        mask={`url(#cloud-mask-${variant})`}
      />
    </svg>
  );
}
