"use client";

import { useSyncExternalStore } from "react";

/**
 * Module-level control surface for the site's two music tracks: the
 * cover's own loop (registered by CloudIntro) and the invitation's
 * (registered by BackgroundMusic). Only one is ever "active" — the
 * intro's until "Buka Undangan" is tapped, the invitation's after — and
 * a single play/pause toggle drives whichever that is.
 *
 * `mutedByUser` is the shared preference: pausing on the cover keeps the
 * invitation silent after the handoff too, until the guest presses play.
 * It is only set by an explicit pause, never by a blocked autoplay, so a
 * browser refusing pre-gesture playback doesn't count as "the guest
 * turned the music off".
 */
type Track = "intro" | "main";

const elements: Record<Track, HTMLAudioElement | null> = { intro: null, main: null };
let active: Track = "intro";
let mutedByUser = false;
let playing = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setPlaying(next: boolean) {
  if (playing === next) return;
  playing = next;
  emit();
}

function playActive() {
  const el = elements[active];
  if (!el) return;
  const track = active;
  el.play()
    .then(() => {
      // The handoff may have happened while this play() was pending.
      if (active === track) setPlaying(true);
      else el.pause();
    })
    .catch(() => {});
}

/**
 * Returns an unregister function. The element's own events keep the
 * button honest when something outside this store pauses playback (a
 * phone's lock-screen controls, another tab taking audio focus).
 */
export function registerAudioElement(track: Track, el: HTMLAudioElement) {
  elements[track] = el;
  const onPlaying = () => {
    if (active === track) setPlaying(true);
  };
  const onPause = () => {
    if (active === track) setPlaying(false);
  };
  el.addEventListener("playing", onPlaying);
  el.addEventListener("pause", onPause);
  return () => {
    el.removeEventListener("playing", onPlaying);
    el.removeEventListener("pause", onPause);
    el.pause();
    if (elements[track] === el) elements[track] = null;
  };
}

/** Called when the cover mounts: it becomes the active track again. */
export function startIntroMusic() {
  active = "intro";
  setPlaying(false);
  if (!mutedByUser) playActive();
}

/**
 * Retry for the cover's track after a blocked autoplay: browsers allow
 * audible playback once the page has seen a gesture, so the guest's
 * first tap anywhere on the cover is the earliest it can actually start.
 */
export function retryIntroMusic() {
  if (active !== "intro" || mutedByUser || playing) return;
  playActive();
}

/** "Buka Undangan": cut the cover's track and hand over to the invitation's. */
export function enterInvitationMusic() {
  elements.intro?.pause();
  active = "main";
  setPlaying(false);
  if (!mutedByUser) playActive();
}

export function toggleMusic() {
  const el = elements[active];
  if (!el) return;
  if (playing) {
    el.pause();
    mutedByUser = true;
    setPlaying(false);
  } else {
    mutedByUser = false;
    playActive();
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
