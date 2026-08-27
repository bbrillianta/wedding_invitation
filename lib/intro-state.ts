"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny store for one fact: has the cloud intro finished and handed the
 * screen over to the invitation?
 *
 * The scroll reveals need it because the Hero is already in the
 * viewport at load, sitting behind the intro overlay. Left to
 * `useInView` alone it would play its entrance while nobody could see
 * it, and the guest would arrive at an already-settled page. Gating on
 * this store holds the Hero at its start state until the fly-through
 * lands, so the reveal happens in front of the guest.
 *
 * It lives outside React (rather than in context) so server components
 * can keep composing the sections — only the leaf <Reveal> wrappers and
 * <CloudIntro> are clients of it, and neither has to be a descendant of
 * the other.
 */
let done = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function markIntroDone() {
  if (done) return;
  done = true;
  emit();
}

/**
 * Module state outlives a client-side navigation, so a second visit to
 * a page in the same session would otherwise start with everything
 * already revealed under a fresh intro. CloudIntro calls this on mount.
 */
export function resetIntro() {
  if (!done) return;
  done = false;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useIntroDone() {
  // The server snapshot is `false`: the markup ships in its pre-reveal
  // state and the entrance runs after hydration, same as the client.
  return useSyncExternalStore(
    subscribe,
    () => done,
    () => false
  );
}
