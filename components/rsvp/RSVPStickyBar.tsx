"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { setRsvpBarVisible } from "@/lib/rsvp-bar-state";

type Choice = "hadir" | "tidak-hadir" | null;

/**
 * Floating confirmation bar, not an in-page section: it only appears
 * once the guest has actually reached the end of the Resepsi card in
 * <EventDetails/> (the `#acara-end` sentinel), on mobile's single-column
 * stack and desktop's side-by-side grid alike, then stays up for the
 * rest of the page — a one-way reveal rather than something that hides
 * again on scrolling back up, which sidesteps a real edge case: a fast
 * or programmatic scroll can jump straight past the sentinel without
 * the browser ever reporting it as intersecting, so an observer that
 * depended on a *second* crossing to hide the bar could fire once and
 * then never update again.
 *
 * No backend yet — a tap just highlights the choice locally. Wiring
 * this to the database-backed RSVP flow is a Phase 2 follow-up.
 */
export function RSVPStickyBar() {
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<Choice>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const sentinel = document.getElementById("acara-end");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const reached = entry.isIntersecting || entry.boundingClientRect.top < 0;
        if (!reached) return;
        setVisible(true);
        setRsvpBarVisible(true);
        observer.disconnect();
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      setRsvpBarVisible(false);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="group"
          aria-label="Konfirmasi kehadiran"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-white/70 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(31,84,147,0.25)] backdrop-blur-sm"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mx-auto max-w-md px-4 py-3">
            <p className="text-center text-xs font-medium tracking-[0.15em] text-ink-700 uppercase">
              Konfirmasi Kehadiran
            </p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChoice("hadir")}
                aria-pressed={choice === "hadir"}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition",
                  choice === "hadir"
                    ? "bg-blossom-700 text-white"
                    : "border border-blossom-400/60 text-ink-900 hover:bg-ink-700/10"
                )}
              >
                <Check className="h-4 w-4" />
                Hadir
              </button>
              <button
                type="button"
                onClick={() => setChoice("tidak-hadir")}
                aria-pressed={choice === "tidak-hadir"}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition",
                  choice === "tidak-hadir"
                    ? "bg-blossom-700 text-white"
                    : "border border-blossom-400/60 text-ink-900 hover:bg-ink-700/10"
                )}
              >
                <X className="h-4 w-4" />
                Tidak Hadir
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
