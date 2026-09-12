"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X, Loader2 } from "lucide-react";
import type { AttendanceStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { setRsvpBarVisible } from "@/lib/rsvp-bar-state";
import { submitAttendance } from "@/app/rsvp/actions";

type Choice = "ATTENDING" | "NOT_ATTENDING";

/**
 * Floating confirmation bar. Two ways in:
 *  - First-time guest (no saved attendance yet): stays hidden until the
 *    guest actually reaches the end of the Resepsi card in
 *    <EventDetails/> (the `#acara-end` sentinel) — same one-way,
 *    IntersectionObserver-based reveal as Phase 1, kept for the same
 *    reason: a fast/programmatic scroll can jump straight past the
 *    sentinel without ever reporting an intersection, so a reveal that
 *    depended on a second crossing could miss it entirely.
 *  - Returning guest (already has a saved attendance): shows immediately
 *    on load, preselected to their last answer, so changing their mind
 *    doesn't require re-scrolling the whole page first.
 *
 * Either way, a successful confirm hides the bar for the rest of this
 * view — one confirmation per visit — and it only comes back on a later
 * reload, reflecting whatever is now saved.
 */
export function RSVPStickyBar({
  slug,
  name,
  initialAttendance,
}: {
  slug?: string;
  name?: string;
  initialAttendance: AttendanceStatus | null;
}) {
  const alreadyAnswered = initialAttendance != null;
  const [visible, setVisible] = useState(alreadyAnswered);
  const [choice, setChoice] = useState<Choice | null>(
    initialAttendance === "ATTENDING" || initialAttendance === "NOT_ATTENDING"
      ? initialAttendance
      : null
  );
  const [confirmed, setConfirmed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const prefersReducedMotion = useReducedMotion() ?? false;

  // A brief "thank you" replaces the buttons right where they were, then
  // the bar slides away on its own — long enough to register as a
  // response to the tap, short enough to still read as "gone after
  // confirming" rather than a persistent banner.
  useEffect(() => {
    if (!confirmed) return;
    const timer = setTimeout(() => setDismissed(true), 1800);
    return () => clearTimeout(timer);
  }, [confirmed]);

  useEffect(() => {
    if (alreadyAnswered) {
      setRsvpBarVisible(true);
      return () => setRsvpBarVisible(false);
    }

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
  }, [alreadyAnswered]);

  function handleChoice(next: Choice) {
    if (!name || isPending || confirmed) return;
    setChoice(next);
    setError(null);
    startTransition(async () => {
      const result = await submitAttendance(slug, name, next);
      if (result.status === "success") {
        setConfirmed(true);
      } else {
        setError(result.message ?? "Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  const show = visible && !dismissed;

  return (
    <AnimatePresence>
      {show && (
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
            {confirmed ? (
              <p className="flex items-center justify-center gap-2 py-2 text-center text-sm font-medium text-ink-900">
                <Check className="h-4 w-4 shrink-0 text-blossom-700" />
                Terima kasih telah mengonfirmasi kehadiran Anda.
              </p>
            ) : (
              <>
                <p className="text-center text-xs font-medium tracking-[0.15em] text-ink-700 uppercase">
                  {alreadyAnswered
                    ? "Ingin Mengubah Kehadiran?"
                    : "Konfirmasi Kehadiran"}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChoice("ATTENDING")}
                    disabled={isPending}
                    aria-pressed={choice === "ATTENDING"}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70",
                      choice === "ATTENDING"
                        ? "bg-blossom-700 text-white"
                        : "border border-blossom-400/60 text-ink-900 hover:bg-ink-700/10"
                    )}
                  >
                    {isPending && choice === "ATTENDING" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Hadir
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChoice("NOT_ATTENDING")}
                    disabled={isPending}
                    aria-pressed={choice === "NOT_ATTENDING"}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70",
                      choice === "NOT_ATTENDING"
                        ? "bg-blossom-700 text-white"
                        : "border border-blossom-400/60 text-ink-900 hover:bg-ink-700/10"
                    )}
                  >
                    {isPending && choice === "NOT_ATTENDING" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Tidak Hadir
                  </button>
                </div>
                {error && (
                  <p role="alert" className="mt-2 text-center text-xs text-red-600">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
