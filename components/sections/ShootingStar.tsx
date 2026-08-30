"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIntroDone } from "@/lib/intro-state";

/**
 * A single shooting star streaking through the Hero section's
 * background — fires the moment the cloud intro hands off (the same
 * "Buka Undangan" handoff <Reveal> waits on, since Hero is already in
 * view behind the intro overlay rather than something scrolled to).
 * Conditionally mounting on `introDone` is what makes it replay on a
 * second "open invitation": CloudIntro resets that flag to false on
 * mount, which unmounts this, then flips it true again on handoff,
 * remounting it clean — same repeat-per-visit behavior as the intro
 * itself. Skipped entirely under `prefers-reduced-motion`.
 */
export function ShootingStar() {
  const introDone = useIntroDone();
  const prefersReducedMotion = useReducedMotion();

  if (!introDone || prefersReducedMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Steep, top-to-bottom fall leaning slightly left — matches the
          reference trajectory sketched over the hero, passing behind
          the couple's names rather than crossing the corner. */}
      <motion.div
        className="absolute"
        style={{ top: "0%", left: "60%", rotate: 114 }}
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ x: "-22vw", y: "78vh", opacity: [0, 1, 1, 0] }}
        transition={{
          // Quick out of the gate, then visibly easing off rather than
          // the real-meteor accelerate-in most shooting stars use.
          x: { duration: 1.6, delay: 0.3, ease: "easeOut" },
          y: { duration: 1.6, delay: 0.3, ease: "easeOut" },
          // Fades in fast, holds, then a long, slow fade over the back
          // half of the flight instead of cutting off at the tail end.
          opacity: { duration: 1.6, delay: 0.3, times: [0, 0.08, 0.45, 1] },
        }}
      >
        <div className="relative h-px w-28 rounded-full bg-gradient-to-r from-transparent to-starlight">
          <span className="absolute top-1/2 -right-1 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-starlight shadow-[0_0_10px_3px_rgba(255,255,255,0.85)]" />
        </div>
      </motion.div>
    </div>
  );
}
