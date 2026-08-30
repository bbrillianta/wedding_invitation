"use client";

import { useSyncExternalStore } from "react";

/**
 * Module-level control surface for the invitation's background music,
 * mirroring intro-state.ts: the <audio> element lives in a component
 * (BackgroundMusic, mounted once inside #invitation-content) but the
 * element that needs to start it — CloudIntro's handoff effect — isn't
 * that component's parent or child. Routing through here avoids lifting
 * audio playback state into a context both sides would have to share.
 */
let audioEl: HTMLAudioElement | null = null;
let playing = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function registerAudioElement(el: HTMLAudioElement | null) {
  audioEl = el;
}

/**
 * Called once, right as the cloud intro hands off to the invitation.
 * Browsers gate audible autoplay on the page having seen a user
 * gesture — the "Open Invitation" click satisfies that for the rest of
 * the tab's lifetime, so this call succeeds even though it fires from
 * an effect rather than the click handler itself. `.catch()` is a
 * no-op guard for browsers stricter than that: the guest still has the
 * toggle button as a manual fallback.
 */
export function startBackgroundMusic() {
  if (!audioEl || playing) return;
  audioEl
    .play()
    .then(() => {
      playing = true;
      emit();
    })
    .catch(() => {});
}

export function toggleBackgroundMusic() {
  if (!audioEl) return;
  if (audioEl.paused) {
    audioEl
      .play()
      .then(() => {
        playing = true;
        emit();
      })
      .catch(() => {});
  } else {
    audioEl.pause();
    playing = false;
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMusicPlaying() {
  return useSyncExternalStore(subscribe, () => playing, () => false);
}
