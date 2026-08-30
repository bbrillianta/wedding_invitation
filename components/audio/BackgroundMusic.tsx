"use client";

import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import {
  registerAudioElement,
  toggleBackgroundMusic,
  useMusicPlaying,
} from "@/lib/audio-state";
import { useRsvpBarVisible } from "@/lib/rsvp-bar-state";
import { cn, withBasePath } from "@/lib/utils";

/**
 * Lives inside #invitation-content (see WeddingInvitation.tsx), so it
 * mounts at the same time as the cloud intro but sits underneath its
 * full-screen overlay — the intro is opaque and `main` is `inert`
 * while it's showing, so the toggle is neither visible nor reachable
 * until the intro hands off. That's what keeps the music scoped to
 * "the invitation itself" without this component needing to know the
 * intro's phase itself; it only needs to exist early enough for
 * CloudIntro's handoff effect to find and start it (see audio-state.ts).
 */
export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playing = useMusicPlaying();
  const rsvpBarVisible = useRsvpBarVisible();

  useEffect(() => {
    registerAudioElement(audioRef.current);
    return () => registerAudioElement(null);
  }, []);

  return (
    <>
      <audio ref={audioRef} src={withBasePath("/audio/night-theme.mp3")} loop preload="none" />
      <button
        type="button"
        onClick={toggleBackgroundMusic}
        aria-label={playing ? "Jeda musik" : "Putar musik"}
        aria-pressed={playing}
        className={cn(
          "fixed right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-blossom-400/60 bg-white/70 text-blossom-700 shadow-lg backdrop-blur-sm transition-[bottom] duration-300 hover:bg-white/90",
          // Lifts above <RSVPStickyBar/> once it's showing, instead of the
          // two fixed-position elements overlapping in the same corner.
          rsvpBarVisible ? "bottom-[calc(5.5rem+env(safe-area-inset-bottom))]" : "bottom-6"
        )}
      >
        {playing ? (
          <Pause className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 translate-x-0.5" fill="currentColor" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
