"use client";

import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { registerAudioElement, toggleMusic, useMusicPlaying } from "@/lib/audio-state";
import { useRsvpBarVisible } from "@/lib/rsvp-bar-state";
import { cn, withBasePath } from "@/lib/utils";

/**
 * The invitation's track plus the one play/pause toggle shared by both
 * tracks (see audio-state.ts). Rendered outside `main` (WeddingInvitation)
 * and above the cover's z-50, so the same button works on the cover and
 * after the handoff — it never needs to know which track is playing.
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playing = useMusicPlaying();
  const rsvpBarVisible = useRsvpBarVisible();

  useEffect(() => {
    if (!audioRef.current) return;
    return registerAudioElement("main", audioRef.current);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={withBasePath("/audio/background-music.mp3")} loop preload="none" />
      <button
        type="button"
        data-music-toggle
        onClick={toggleMusic}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        aria-pressed={playing}
        className={cn(
          "music-toggle fixed z-[60] flex items-center justify-center rounded-full bg-white/85 text-blossom-700 ring-1 ring-blossom-400/50 backdrop-blur-md transition-[bottom,transform,box-shadow] duration-300 hover:scale-105 active:scale-95",
          "right-[calc(1rem+env(safe-area-inset-right))] h-11 w-11 sm:right-[calc(1.5rem+env(safe-area-inset-right))] sm:h-12 sm:w-12",
          "shadow-[0_8px_20px_-8px_rgba(179,74,125,0.55)] hover:shadow-[0_12px_26px_-8px_rgba(179,74,125,0.7)]",
          // Lifts clear of <RSVPStickyBar/> once it's showing, instead of
          // the two fixed-position elements overlapping in the same corner.
          rsvpBarVisible
            ? "bottom-[calc(6.75rem+env(safe-area-inset-bottom))]"
            : "bottom-[calc(1rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))]"
        )}
      >
        {playing && <span aria-hidden="true" className="music-toggle-halo" />}
        {playing ? (
          <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
            <span className="music-eq-bar" />
          </span>
        ) : (
          <Play className="h-4 w-4 translate-x-[1.5px]" fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
