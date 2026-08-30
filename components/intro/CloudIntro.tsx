"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { markIntroDone, resetIntro } from "@/lib/intro-state";
import { startBackgroundMusic } from "@/lib/audio-state";
import { CloudShape, cloudAspect } from "@/components/intro/CloudShape";
import type { CloudDepth, CloudVariant } from "@/components/intro/CloudShape";
import { SparkleField } from "@/components/layout/SparkleField";
import type { Guest } from "@/types";

type Phase = "intro" | "transitioning" | "done";

/**
 * The fly-through is real 3D perspective, not a flat scale-up: clouds
 * sit at z=0 at rest and animate toward the camera along the z-axis.
 * With `perspective: PERSPECTIVE` on the field, that makes each cloud
 * expand *and* sweep outward from the vanishing point at a rate set by
 * its own depth — which is what sells "flying through" rather than
 * "clouds growing".
 *
 * Apparent scale at a given z is PERSPECTIVE / (PERSPECTIVE - z), so z
 * must stay meaningfully below PERSPECTIVE (at z = PERSPECTIVE the
 * cloud is at the camera plane and the scale blows up to infinity).
 */
const PERSPECTIVE = 1000;

const DEPTH: Record<
  CloudDepth,
  { z: number; duration: number; delay: number; opacity: number }
> = {
  // z 550 -> ~2.2x, the distant layer barely moves: parallax anchor.
  // Its lower opacity is the other half of the aerial perspective the
  // washed-out `back` gradient already starts.
  back: { z: 550, duration: 1.9, delay: 0.12, opacity: 0.72 },
  // z 820 -> ~5x
  mid: { z: 820, duration: 1.6, delay: 0.06, opacity: 0.93 },
  // z 935 -> ~15x, the near layer tears past the camera first.
  front: { z: 935, duration: 1.35, delay: 0, opacity: 1 },
};

const TRANSITION_MS = 2050;

type Cloud = {
  /** Horizontal centre, in viewport-width percent. */
  left: number;
  /** Offset of the element's bottom edge, in viewport-height percent. */
  bottom: number;
  /** Width in viewport-width percent, before `--cloud-scale`. */
  width: number;
  depth: CloudDepth;
  variant: CloudVariant;
  driftDuration: number;
  /** Mirrors the drawing, so one shape can serve as two. */
  flip?: boolean;
  /**
   * Casts a soft shadow *upward*, onto whatever sits behind. Only the
   * foreground carries it; it is a real filter and not free.
   */
  shadow?: boolean;
};

/**
 * A hand-composed cloudscape rather than a scattered field.
 *
 * These are discrete clouds now, each a piece of real artwork (see
 * CloudShape), so the sky is built by *placing* them: a bank across the
 * bottom that rises from a low, trailing tail on the left up to its
 * tallest mass on the right — the reference art's composition — with a
 * couple of small clouds drifting alone in the clear blue above it.
 * Overlap between neighbours is what makes the bank read as one
 * continuous cloudscape instead of a row of separate cut-outs, so it is
 * deliberate, not incidental.
 *
 * Order matters: this array is painted back-to-front, so a later entry
 * always occludes an earlier one.
 */
const CLOUDS: Cloud[] = [
  // Alone in the blue: small, pale, well apart from the bank.
  { left: 17, bottom: 75, width: 13, depth: "back", variant: 1, driftDuration: 222 },
  { left: 83, bottom: 81, width: 10, depth: "back", variant: 6, driftDuration: 206, flip: true },
  { left: 47, bottom: 66, width: 8, depth: "back", variant: 3, driftDuration: 240 },

  // Far skyline. Heights climb left to right and stay uneven — evenly
  // spaced tiers read as horizontal stripes rather than as a sky.
  { left: -8, bottom: 30, width: 30, depth: "back", variant: 0, driftDuration: 196 },
  { left: 18, bottom: 22, width: 26, depth: "back", variant: 2, driftDuration: 188, flip: true },
  { left: 42, bottom: 33, width: 28, depth: "back", variant: 6, driftDuration: 202 },
  { left: 66, bottom: 43, width: 30, depth: "back", variant: 5, driftDuration: 178 },
  { left: 90, bottom: 51, width: 26, depth: "back", variant: 1, driftDuration: 192, flip: true },
  { left: 113, bottom: 45, width: 24, depth: "back", variant: 4, driftDuration: 210, flip: true },

  // Middle bank, filling the gaps and continuing the climb.
  { left: -10, bottom: 9, width: 38, depth: "mid", variant: 4, driftDuration: 168 },
  { left: 16, bottom: 3, width: 34, depth: "mid", variant: 1, driftDuration: 182 },
  { left: 41, bottom: 13, width: 36, depth: "mid", variant: 6, driftDuration: 160, flip: true },
  { left: 67, bottom: 23, width: 40, depth: "mid", variant: 2, driftDuration: 176 },
  { left: 95, bottom: 29, width: 38, depth: "mid", variant: 5, driftDuration: 166, flip: true },
  { left: 121, bottom: 21, width: 30, depth: "mid", variant: 0, driftDuration: 172, flip: true },

  // Foreground: largest, lowest, closes the bottom edge so no gap shows
  // the sky through as a hole punched in the bank. The tower (variant 5)
  // sits right of centre as the tallest mass, per the reference.
  { left: -6, bottom: -10, width: 48, depth: "front", variant: 0, driftDuration: 138, shadow: true },
  { left: 22, bottom: -14, width: 46, depth: "front", variant: 1, driftDuration: 128, shadow: true, flip: true },
  { left: 50, bottom: -8, width: 50, depth: "front", variant: 6, driftDuration: 132, shadow: true },
  { left: 78, bottom: 0, width: 58, depth: "front", variant: 5, driftDuration: 118, shadow: true },
  { left: 108, bottom: -6, width: 46, depth: "front", variant: 2, driftDuration: 124, shadow: true, flip: true },
  { left: 132, bottom: -16, width: 40, depth: "front", variant: 4, driftDuration: 114, shadow: true, flip: true },
];

export function CloudIntro({ guest }: { guest?: Guest | null }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { intro, couple } = siteContent;
  const greetingName = guest?.groupLabel ?? guest?.name;

  useEffect(() => {
    document.body.style.overflow = phase === "done" ? "" : "hidden";
    const mainEl = document.getElementById("invitation-content");
    if (phase === "done") {
      mainEl?.removeAttribute("inert");
    } else {
      mainEl?.setAttribute("inert", "");
    }
    return () => {
      document.body.style.overflow = "";
      mainEl?.removeAttribute("inert");
    };
  }, [phase]);

  useEffect(() => {
    buttonRef.current?.focus();
    // Clear any "already revealed" state left over from an earlier mount
    // so the sections behind this overlay start from their entrance.
    resetIntro();
  }, []);

  // Releasing the reveals is tied to the phase rather than fired inline
  // from handleEnter, so the reduced-motion path (which jumps straight
  // to "done") and the animated path both hand over at the same moment.
  // Music starts here too — the intro sky is fully gone by "done", so
  // sound and sight change over together instead of audio leading the
  // reveal.
  useEffect(() => {
    if (phase === "done") {
      markIntroDone();
      startBackgroundMusic();
    }
  }, [phase]);

  function handleEnter() {
    if (phase !== "intro") return;
    if (prefersReducedMotion) {
      setPhase("done");
      return;
    }
    setPhase("transitioning");
    window.setTimeout(() => setPhase("done"), TRANSITION_MS);
  }

  if (phase === "done") return null;

  const transitioning = phase === "transitioning";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" onClick={handleEnter}>
      {/* Sky clears before the clouds finish, so the last of them streak
          past against the revealed invitation sky. Both skies are cut
          from the same ramp — the intro just sits higher up it — so this
          reads as dropping out of the blue toward the horizon rather
          than as a cut to a different scene. */}
      <motion.div
        className="dawn-sky absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: transitioning ? 0.45 : 0 }}
      >
        {/* Sparkles in the deep band overhead — the same field that
            waits on the invitation sky underneath, in white while the
            sky behind them is still dark enough to carry it. */}
        <SparkleField className="dawn-sparkles text-starlight sparkle-glow" />
        {/* The light source the clouds are lit by. */}
        <div className="dawn-glow absolute inset-x-0 bottom-0 h-2/3" />
      </motion.div>

      <div
        className="cloud-field absolute inset-0"
        aria-hidden="true"
        style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%" }}
      >
        {CLOUDS.map((cloud, i) => {
          const depth = DEPTH[cloud.depth];
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${cloud.left}%`,
                bottom: `${cloud.bottom}%`,
                width: `calc(${cloud.width} * var(--cloud-scale) * 1%)`,
                aspectRatio: cloudAspect(cloud.variant),
              }}
              // x stays put at -50% (centring `left`) while z animates;
              // keeping both in the same transform avoids a plain CSS
              // translate being clobbered by motion.
              initial={{ x: "-50%", z: 0, opacity: depth.opacity }}
              animate={
                transitioning
                  ? {
                      x: "-50%",
                      z: depth.z,
                      opacity: [depth.opacity, depth.opacity, 0],
                    }
                  : { x: "-50%", z: 0, opacity: depth.opacity }
              }
              transition={
                transitioning
                  ? {
                      z: { duration: depth.duration, delay: depth.delay, ease: "easeIn" },
                      opacity: {
                        duration: depth.duration,
                        delay: depth.delay,
                        times: [0, 0.62, 1],
                      },
                    }
                  : { duration: 0.4 }
              }
            >
              {/* Idle drift lives on an inner element so its transform
                  never fights the motion-driven translateZ above. */}
              <div
                className="cloud-drift h-full w-full"
                style={{
                  animationDuration: `${cloud.driftDuration}s`,
                  animationDelay: `-${cloud.driftDuration / 3}s`,
                  filter: cloud.shadow
                    ? "drop-shadow(0 -9px 13px rgba(140, 98, 165, 0.34))"
                    : undefined,
                }}
              >
                <CloudShape variant={cloud.variant} depth={cloud.depth} flip={cloud.flip} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
        animate={transitioning ? { opacity: 0, scale: 1.5 } : { opacity: 1, scale: 1 }}
        transition={{ duration: transitioning ? 0.7 : 0.4, ease: "easeIn" }}
      >
        {/* Barely-there panel: a whisper of tint and just enough blur to
            take the edge off, so the clouds behind it stay visible — it
            takes up most of the screen on a phone, and a heavily blurred
            or solid card there hides more of the art than it's worth.
            Legibility comes from `.text-halo` on the copy itself rather
            than from the panel's own opacity or blur, which is what lets
            both go this low without the text fighting whatever cloud
            happens to be behind it. */}
        <div className="w-full max-w-sm rounded-3xl border border-white/40 bg-white/18 px-8 py-10 text-center shadow-[0_20px_50px_-24px_rgba(31,84,147,0.45)] backdrop-blur-[2px]">
          <p className="text-halo text-xs font-bold tracking-[0.35em] text-blossom-700 uppercase">
            {intro.eyebrow}
          </p>

          {greetingName && (
            <p className="text-halo mt-4 text-sm tracking-[0.2em] text-ink-700 uppercase">
              Kepada Yth. {greetingName}
            </p>
          )}

          <p className="text-halo mt-3 text-sm font-bold text-ink-500">{intro.subheading}</p>

          <h1 className="text-halo mt-2 font-script text-5xl text-ink-900 sm:text-6xl">
            {couple.brideName}
            <span className="block text-blossom-600">&amp;</span>
            {couple.groomName}
          </h1>

          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-blossom-700 px-8 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-blossom-600"
          >
            {intro.buttonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
