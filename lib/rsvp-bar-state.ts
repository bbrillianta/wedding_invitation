"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny store for one fact: is the RSVP sticky bar currently showing?
 * Mirrors intro-state.ts/audio-state.ts — <BackgroundMusic>'s floating
 * toggle needs to know so it can lift itself above the bar instead of
 * the two fixed-position elements overlapping in the bottom-right
 * corner on small screens, and neither component is the other's parent
 * or child.
 */
let visible = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function setRsvpBarVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useRsvpBarVisible() {
  return useSyncExternalStore(subscribe, () => visible, () => false);
}
