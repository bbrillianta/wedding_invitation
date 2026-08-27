"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useIntroDone } from "@/lib/intro-state";

/**
 * Scroll-triggered entrance for a chunk of the night-theme invitation.
 *
 * Wraps its children in a single animated element that starts offset
 * and transparent, then settles once it scrolls into view — so the page
 * reveals itself section by section instead of arriving fully formed.
 *
 * Server components can use this freely: it takes `children` as an
 * opaque slot, so wrapping a server-rendered section in it doesn't pull
 * that section into the client bundle.
 */

const ELEMENTS = { div: motion.div, li: motion.li } as const;

export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  duration = 0.7,
  y = 24,
  x = 0,
  scale = 1,
}: {
  children: React.ReactNode;
  className?: string;
  /** Rendered tag — `li` keeps list semantics intact inside an <ol>/<ul>. */
  as?: keyof typeof ELEMENTS;
  delay?: number;
  duration?: number;
  /** Start offset in px. Positive `y` rises from below. */
  y?: number;
  x?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  // A negative bottom margin holds the trigger back until the element is
  // properly on screen rather than just clipping the fold, which is what
  // keeps the entrance from being half-missed on a fast scroll.
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const introDone = useIntroDone();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const Element = ELEMENTS[as];
  const show = prefersReducedMotion || (introDone && inView);

  return (
    <Element
      // Motion's element types are per-tag; the union of div/li refs is
      // wider than either accepts, and only the DOM node is read.
      ref={ref as React.RefObject<never>}
      className={className}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y, x, scale },
        visible: { opacity: 1, y: 0, x: 0, scale: 1 },
      }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : // Decelerating ease: the movement is quick to start and
            // slow to settle, which reads as arriving rather than sliding.
            { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </Element>
  );
}
