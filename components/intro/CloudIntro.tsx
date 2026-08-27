"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { siteContent } from "@/lib/content";
import { markIntroDone, resetIntro } from "@/lib/intro-state";
import { startBackgroundMusic } from "@/lib/audio-state";
import { CloudDefs, CloudShape } from "@/components/intro/CloudShape";
import type { CloudDepth, CloudVariant } from "@/components/intro/CloudShape";
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
  { z: number; duration: number; delay: number; opacity: number; size: [number, number] }
> = {
  // z 550 -> ~2.2x, the distant layer barely moves: parallax anchor.
  // Its low opacity is the other half of the aerial perspective the
  // washed-out `back` gradient already starts.
  back: { z: 550, duration: 1.9, delay: 0.12, opacity: 0.72, size: [15, 21] },
  // z 820 -> ~5x
  mid: { z: 820, duration: 1.6, delay: 0.06, opacity: 0.9, size: [21, 29] },
  // z 935 -> ~15x, the near layer tears past the camera first.
  front: { z: 935, duration: 1.35, delay: 0, opacity: 1, size: [29, 40] },
};

const TRANSITION_MS = 2050;

type Cloud = {
  left: number;
  top: number;
  width: number;
  depth: CloudDepth;
  variant: CloudVariant;
  driftDuration: number;
  driftDelay: number;
  /** Pre-baked `filter` value; see `lightingFor`. */
  lighting: string;
};

/**
 * The light is under the horizon, so how lit a cloud is depends on how
 * far down the sky it sits: the ones overhead fall away to cool, nearly
 * silhouetted shapes, while the ones near the horizon take the warm
 * glow full on. CloudShape's gradients handle top-to-bottom shading
 * *within* one cloud; this handles the difference *between* clouds,
 * which is what stops the field reading as one shape stamped out forty
 * times. `top` spans the field's -12..112 overhang, not just 0..100.
 */
function lightingFor(top: number): string {
  const t = Math.min(1, Math.max(0, (top + 12) / 124));
  const brightness = (0.78 + t * 0.36).toFixed(3);
  const saturate = (0.78 + t * 0.28).toFixed(3);
  return `brightness(${brightness}) saturate(${saturate})`;
}

/** Deterministic PRNG so the server and client render an identical field. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Dense field built from a jittered grid that overhangs every edge, so
 * clouds wrap the whole viewport instead of dotting it. `left`/`top`
 * are the cloud's centre (the element is translated by -50%), which is
 * what makes the keep-clear test around the welcome panel meaningful:
 * clouds centred behind the panel skip the near layer, so the frosted
 * card never has a hard, high-contrast cloud rim cutting across it.
 * They keep their normal size, though — the panel carries readability
 * on its own now, so the field no longer needs a bald patch.
 */
function buildClouds(): Cloud[] {
  const rand = mulberry32(20261128);
  const COLS = 7;
  const ROWS = 6;
  const clouds: Cloud[] = [];

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const x = -12 + (col * 124) / (COLS - 1) + (rand() - 0.5) * 16;
      const y = -12 + (row * 124) / (ROWS - 1) + (rand() - 0.5) * 16;

      const behindPanel = Math.abs(x - 50) < 30 && Math.abs(y - 50) < 24;
      const roll = rand();
      const depth: CloudDepth = behindPanel
        ? roll < 0.6
          ? "back"
          : "mid"
        : roll < 0.32
          ? "back"
          : roll < 0.72
            ? "mid"
            : "front";

      const [minSize, maxSize] = DEPTH[depth].size;

      clouds.push({
        left: x,
        top: y,
        width: minSize + rand() * (maxSize - minSize),
        depth,
        variant: (Math.floor(rand() * 3) % 3) as CloudVariant,
        driftDuration: 70 + rand() * 70,
        driftDelay: -rand() * 70,
        lighting: lightingFor(y),
      });
    }
  }

  // Nearest clouds last so they paint over the distant layer.
  const order: Record<CloudDepth, number> = { back: 0, mid: 1, front: 2 };
  return clouds.sort((a, b) => order[a.depth] - order[b.depth]);
}

const CLOUDS = buildClouds();

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
  // Music starts here too — the sky is fully dusk-free by "done", so
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
      <CloudDefs />

      {/* Sky clears before the clouds finish, so the last of them streak
          past against the revealed night sky. Dusk already sits most of
          the way to midnight, so this reads as the light going out
          rather than a hard cut from day to night. */}
      <motion.div
        className="dusk-sky absolute inset-0"
        aria-hidden="true"
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 1, delay: transitioning ? 0.45 : 0 }}
      >
        {/* Early stars in the darkest part of the sky — the first hint of
            the starfield waiting underneath. */}
        <div className="dusk-stars absolute inset-0" />
        {/* The light source the cloud undersides are lit by. */}
        <div className="dusk-glow absolute inset-x-0 bottom-0 h-2/3" />
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
                top: `${cloud.top}%`,
                width: `calc(${cloud.width} * var(--cloud-scale) * 1%)`,
                aspectRatio: "200 / 110",
              }}
              // x/y stay put at -50% (centring `left`/`top`) while z
              // animates; keeping them in the same transform avoids a
              // plain CSS translate being clobbered by motion.
              initial={{ x: "-50%", y: "-50%", z: 0, opacity: depth.opacity }}
              animate={
                transitioning
                  ? {
                      x: "-50%",
                      y: "-50%",
                      z: depth.z,
                      opacity: [depth.opacity, depth.opacity, 0],
                    }
                  : { x: "-50%", y: "-50%", z: 0, opacity: depth.opacity }
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
                  animationDelay: `${cloud.driftDelay}s`,
                  filter: cloud.lighting,
                }}
              >
                <CloudShape variant={cloud.variant} depth={cloud.depth} />
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
        {/* Frosted panel: the copy sits over a cloud field of unknown
            brightness, so it carries its own backdrop rather than
            relying on text shadows. The tint stays opaque enough to
            stand on its own where `backdrop-filter` is unsupported. */}
        <div className="w-full max-w-sm rounded-3xl border border-gold-400/25 bg-midnight-950/60 px-8 py-10 text-center shadow-[0_24px_60px_-20px_rgba(5,7,15,0.9)] backdrop-blur-md">
          <p className="text-xs tracking-[0.35em] text-gold-300 uppercase">
            {intro.eyebrow}
          </p>

          {greetingName && (
            <p className="mt-4 text-sm tracking-[0.2em] text-starlight uppercase">
              Dear {greetingName}
            </p>
          )}

          <p className="mt-3 text-sm text-starlight-dim">{intro.subheading}</p>

          <h1 className="mt-2 font-script text-5xl text-starlight sm:text-6xl">
            {couple.brideName} <span className="text-gold-300">&amp;</span>{" "}
            {couple.groomName}
          </h1>

          <button
            ref={buttonRef}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnter();
            }}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-8 py-3 text-sm font-medium text-midnight-950 shadow-lg transition hover:bg-gold-300"
          >
            {intro.buttonLabel}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
