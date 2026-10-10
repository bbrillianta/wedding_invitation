"use client";

import { useEffect, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, X, Loader2, Minus, Plus, ChevronLeft } from "lucide-react";
import type { AttendanceStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import { setRsvpBarVisible } from "@/lib/rsvp-bar-state";
import { submitAttendance } from "@/app/rsvp/actions";

type Choice = "ATTENDING" | "NOT_ATTENDING";

/**
 * Floating confirmation bar. First-time and returning guests reveal the
 * same way: it stays hidden until the guest actually reaches the end of
 * the Resepsi card in <EventDetails/> (the `#acara-end` sentinel) — a
 * one-way, IntersectionObserver-based reveal, since a fast/programmatic
 * scroll can jump straight past the sentinel without ever reporting an
 * intersection, so a reveal that depended on a second crossing could
 * miss it entirely. A returning guest (already has a saved attendance)
 * is preselected to their last answer and labeled "Ingin Mengubah
 * Kehadiran?" instead of "Konfirmasi Kehadiran" once it appears.
 *
 * "Hadir" opens a guest-count step (skipped when the guest's party size
 * is capped at 1); "Tidak Hadir" submits straight away.
 *
 * Either way, a successful confirm hides the bar for the rest of this
 * view — one confirmation per visit — and it only comes back on a later
 * reload, reflecting whatever is now saved.
 */
export function RSVPStickyBar({
  slug,
  name,
  initialAttendance,
  initialGuestCount,
  maxGuests,
}: {
  slug?: string;
  name?: string;
  initialAttendance: AttendanceStatus | null;
  initialGuestCount: number;
  maxGuests: number;
}) {
  const alreadyAnswered = initialAttendance != null;
  const initialChoice: Choice | null =
    initialAttendance === "ATTENDING" || initialAttendance === "NOT_ATTENDING"
      ? initialAttendance
      : null;
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(initialChoice);
  const [askingCount, setAskingCount] = useState(false);
  const [guestCount, setGuestCount] = useState(
    Math.min(Math.max(1, initialGuestCount), maxGuests)
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
    const sentinel = document.getElementById("acara-end");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const reached = entry.isIntersecting || entry.boundingClientRect.top < 0;
        if (!reached) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function submit(next: Choice, count: number) {
    if (!name || isPending || confirmed) return;
    setChoice(next);
    setError(null);
    startTransition(async () => {
      const result = await submitAttendance(slug, name, next, count);
      if (result.status === "success") {
        setConfirmed(true);
      } else {
        setError(result.message ?? "Terjadi kesalahan. Silakan coba lagi.");
      }
    });
  }

  function handleAttending() {
    if (maxGuests <= 1) {
      submit("ATTENDING", 1);
      return;
    }
    setChoice("ATTENDING");
    setError(null);
    setAskingCount(true);
  }

  const show = visible && !dismissed;

  // Mirrors the bar's real visibility, including the post-confirm
  // dismissal, so the music toggle drops back down once the bar is gone.
  useEffect(() => {
    setRsvpBarVisible(show);
    return () => setRsvpBarVisible(false);
  }, [show]);
  const stepperButton =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-blossom-400/60 text-ink-900 transition hover:bg-ink-700/10 disabled:cursor-not-allowed disabled:opacity-40";

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
            ) : askingCount ? (
              // Same height as the Hadir/Tidak Hadir step: BackgroundMusic
              // lifts its toggle by a fixed offset while this bar is up.
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setChoice(initialChoice);
                      setAskingCount(false);
                    }}
                    disabled={isPending}
                    className="absolute top-1/2 left-0 inline-flex -translate-y-1/2 items-center gap-0.5 text-xs text-ink-500 transition hover:text-ink-900 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Kembali
                  </button>
                  <p
                    id="rsvp-guest-count-label"
                    className="text-center text-xs font-medium tracking-[0.15em] text-ink-700 uppercase"
                  >
                    Jumlah Tamu
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div
                    role="group"
                    aria-labelledby="rsvp-guest-count-label"
                    className="flex items-center justify-between"
                  >
                    <button
                      type="button"
                      onClick={() => setGuestCount((n) => Math.max(1, n - 1))}
                      disabled={isPending || guestCount <= 1}
                      aria-label="Kurangi jumlah tamu"
                      className={stepperButton}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <p aria-live="polite" className="font-serif-display text-xl font-medium text-ink-900">
                      {guestCount}
                    </p>
                    <button
                      type="button"
                      onClick={() => setGuestCount((n) => Math.min(maxGuests, n + 1))}
                      disabled={isPending || guestCount >= maxGuests}
                      aria-label="Tambah jumlah tamu"
                      className={stepperButton}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => submit("ATTENDING", guestCount)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-blossom-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-blossom-600 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Konfirmasi
                  </button>
                </div>
              </>
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
                    onClick={handleAttending}
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
                    onClick={() => submit("NOT_ATTENDING", guestCount)}
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
              </>
            )}
            {error && !confirmed && (
              <p role="alert" className="mt-2 text-center text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
