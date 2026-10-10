"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { siteContent } from "@/lib/content";
import { formatDate, withBasePath } from "@/lib/utils";
import { markIntroDone, resetIntro } from "@/lib/intro-state";
import {
  enterInvitationMusic,
  registerAudioElement,
  retryIntroMusic,
  startIntroMusic,
} from "@/lib/audio-state";
import { CloudShape, cloudAspect } from "@/components/intro/CloudShape";
import type { CloudDepth, CloudVariant } from "@/components/intro/CloudShape";
import { SparkleField } from "@/components/layout/SparkleField";
import { Sparkle } from "@/components/ui/Sparkle";
import type { Guest } from "@/types";

type Phase = "intro" | "transitioning" | "done";

/**
 * The fly-through is real 3D perspective, not a flat scale-up: clouds
 * sit at z=0 at rest and animate toward the camera along the z-axis.
 *
 * It runs as CSS keyframe animations (`.intro-cloud--*` in globals.css),
 * not framer-motion: motion drives an independent `z` from JavaScript on
 * every frame, and on a slow phone that main-thread work is exactly what
 * made the flight stutter. CSS transform/opacity animations run on the
 * compositor thread instead, so a busy main thread (music starting, the
 * invitation behind getting ready) can't drop their frames.
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

// Per depth band, the fly-through's distance and timing live in the
// `.intro-cloud--back/mid/front` rules in globals.css:
//   back:  z 550 (~2.2x), 1.9s from 0.12s, resting opacity 0.72. The
//          distant layer barely moves: the parallax anchor.
//   mid:   z 820 (~5x),   1.6s from 0.06s, resting opacity 0.93.
//   front: z 935 (~15x),  1.35s from 0s, the near layer tears past first.
// Each fades out over the last 38% of its own flight.

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

export function CloudIntro({ guest }: { guest: Guest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const prefersReducedMotion = useReducedMotion();
  const { intro, couple, weddingDateISO } = siteContent;
  const greetingName = guest.groupLabel ?? guest.name;
  const introAudioRef = useRef<HTMLAudioElement>(null);

  // Cover-only track: tries to start on mount and is cut the instant
  // "Buka Undangan" is tapped (handleEnter). Most browsers block audible
  // playback until the page has seen a gesture, so the guest's first tap
  // on the cover retries it — except taps on the music toggle (which
  // decides for itself) and on the CTA (which hands over to the
  // invitation's track instead).
  useEffect(() => {
    const el = introAudioRef.current;
    if (!el) return;
    const unregister = registerAudioElement("intro", el);
    startIntroMusic();

    function onFirstGesture(event: Event) {
      const target = event.target as Element | null;
      if (target?.closest("[data-music-toggle], .intro-cta")) return;
      retryIntroMusic();
    }
    document.addEventListener("pointerdown", onFirstGesture);
    document.addEventListener("keydown", onFirstGesture);
    return () => {
      document.removeEventListener("pointerdown", onFirstGesture);
      document.removeEventListener("keydown", onFirstGesture);
      unregister();
    };
  }, []);

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
    // No focus() on the CTA here: `main` is inert while the cover is up,
    // so the first Tab reaches the button anyway, and focusing it on
    // mount made the browser paint its focus ring the instant the card
    // appeared — a hard rectangle around the button before anyone had
    // touched it, which then sat there through the fly-through.
    //
    // Clear any "already revealed" state left over from an earlier mount
    // so the sections behind this overlay start from their entrance.
    resetIntro();
  }, []);

  // Releasing the reveals is tied to the phase rather than fired inline
  // from handleEnter, so the reduced-motion path (which jumps straight
  // to "done") and the animated path both hand over at the same moment.
  useEffect(() => {
    if (phase === "done") {
      markIntroDone();
    }
  }, [phase]);

  function handleEnter() {
    if (phase !== "intro") return;
    // Fired from the click itself, not a later "done" effect: the ~2s
    // fly-through made the music feel like it lagged the tap, and a
    // direct call from the gesture is what browsers require for audible
    // playback. Stays silent if the guest paused the music on the cover.
    enterInvitationMusic();
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
    // `intro-flying` starts every part of the flight in globals.css.
    <div className={`fixed inset-0 z-50 overflow-hidden${transitioning ? " intro-flying" : ""}`}>
      <audio ref={introAudioRef} src={withBasePath("/audio/intro-music.mp3")} loop preload="auto" />

      {/* Sky clears before the clouds finish, so the last of them streak
          past against the revealed invitation sky. Both skies are cut
          from the same ramp — the intro just sits higher up it — so this
          reads as dropping out of the blue toward the horizon rather
          than as a cut to a different scene. */}
      <div className="dawn-sky intro-sky absolute inset-0" aria-hidden="true">
        {/* Sparkles in the deep band overhead — the same field that
            waits on the invitation sky underneath, in white while the
            sky behind them is still dark enough to carry it. */}
        <SparkleField className="dawn-sparkles text-starlight sparkle-glow" />
        {/* The light source the clouds are lit by. */}
        <div className="dawn-glow absolute inset-x-0 bottom-0 h-2/3" />
      </div>

      <div
        className="cloud-field absolute inset-0"
        aria-hidden="true"
        style={{ perspective: PERSPECTIVE, perspectiveOrigin: "50% 50%" }}
      >
        {CLOUDS.map((cloud, i) => (
          <div
            key={i}
            className={`intro-cloud intro-cloud--${cloud.depth} absolute`}
            style={{
              left: `${cloud.left}%`,
              bottom: `${cloud.bottom}%`,
              width: `calc(${cloud.width} * var(--cloud-scale) * 1%)`,
              aspectRatio: cloudAspect(cloud.variant),
            }}
          >
            {/* Idle drift lives on an inner element so its transform
                never fights the fly-through's translateZ above. */}
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
          </div>
        ))}
      </div>

      <div className="intro-card-layer relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* A solid card, not a frosted pane. The cloudscape is the
            scene and this is the printed invitation lying on top of it:
            an opaque ivory-to-blush ground with an inset hairline frame,
            the way a real card carries a double rule inside its edge.
            Going opaque is what lets the type sit dark-on-light at
            printed-invitation contrast — no `.text-halo` propping up
            light text against whatever cloud drifts behind a glyph —
            and the card is kept narrow so the art still reads around it
            on a phone. */}
        <motion.div
          // Reduced motion zeroes the duration rather than dropping the
          // `initial`, matching <Reveal>: the server can't know the
          // preference, so branching the initial state would hydrate a
          // reduced-motion client against markup it never rendered.
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion ? { duration: 0 } : { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
          }
          className="relative w-full max-w-[21.5rem] rounded-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#fefafc_54%,#f8eef5_100%)] px-8 py-9 text-center shadow-[0_2px_12px_rgba(19,57,97,0.12),0_36px_72px_-30px_rgba(19,57,97,0.7)] ring-1 ring-white/80"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[9px] rounded-[1.55rem] border border-blossom-400/45"
          />

          <div className="relative">
            {/* The sky's own four-pointed star, used here as the card's
                ornament so the intro and the invitation share a motif. */}
            <div className="flex items-center justify-center gap-1.5 text-blossom-400">
              <Sparkle size={6} />
              <Sparkle size={11} className="text-blossom-600" />
              <Sparkle size={6} />
            </div>

            <p className="mt-4 text-[0.65rem] font-semibold tracking-[0.42em] text-blossom-700 uppercase">
              {intro.eyebrow}
            </p>

            <p className="mt-4 font-serif-display text-sm tracking-wide text-ink-500 italic">
              {intro.subheading}
            </p>

            <h1 className="mt-1 font-script text-[2.85rem] leading-[1.15] text-ink-900 sm:text-5xl">
              {couple.brideName}
              <span className="block text-3xl text-blossom-600">&amp;</span>
              {couple.groomName}
            </h1>

            {/* Rule-flanked date: the one place the card states a fact,
                so it gets the horizontal rules rather than the eyebrow. */}
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-blossom-400/60" />
              <p className="font-serif-display text-[0.7rem] tracking-[0.28em] text-ink-700 uppercase">
                {/* Pinned to the wedding's own timezone: this is a client
                    component, so a browser-local format would render one
                    date on the server and a different one for a guest
                    abroad — a hydration mismatch as well as a wrong date. */}
                {formatDate(weddingDateISO, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Jakarta",
                })}
              </p>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-blossom-400/60" />
            </div>

            {greetingName && (
              <div className="mt-6 rounded-2xl bg-[#fbf0f6] px-5 py-4 ring-1 ring-blossom-400/40">
                <p className="text-[0.62rem] tracking-[0.22em] text-ink-500 uppercase">
                  Kepada Yth. Bpk/Ibu/Saudara/i
                </p>
                {/* Cormorant, not the Parisienne script the couple's
                    names use: a guest's name has to be read as a plain
                    fact ("is this me?"), and it is the one string here
                    that can be arbitrarily long, which the script cut
                    handles worst. */}
                <p className="mt-2 font-serif-display text-[1.4rem] leading-snug font-medium tracking-wide text-ink-900">
                  {greetingName}
                </p>
              </div>
            )}

            <motion.button
              type="button"
              // Reduced motion flattens the values instead of dropping
              // the props: motion adds a `tabindex` to any element with
              // a `while*` gesture, so a prop that exists on the server
              // and vanishes on the client hydrates as an attribute
              // mismatch.
              whileHover={prefersReducedMotion ? { scale: 1 } : { scale: 1.03 }}
              whileTap={prefersReducedMotion ? { scale: 1 } : { scale: 0.97 }}
              onClick={handleEnter}
              className="intro-cta mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blossom-700 to-blossom-600 px-8 py-3.5 text-[0.72rem] font-semibold tracking-[0.2em] text-white uppercase shadow-[0_16px_30px_-12px_rgba(179,74,125,0.75)] transition hover:shadow-[0_20px_38px_-10px_rgba(179,74,125,0.9)]"
            >
              <MailOpen className="h-4 w-4" />
              {intro.buttonLabel}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
