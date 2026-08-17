"use client";

import { useRef, useSyncExternalStore } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(targetISO: string): TimeLeft | null {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function subscribe(callback: () => void) {
  const interval = setInterval(callback, 1000);
  return () => clearInterval(interval);
}

/**
 * Ticks every second via useSyncExternalStore rather than an effect
 * that calls setState directly (avoids cascading-render pitfalls) and
 * naturally renders a stable placeholder on the server, filling in
 * once mounted on the client.
 */
export function Countdown({ targetISO }: { targetISO: string }) {
  // useSyncExternalStore requires getSnapshot to return a referentially
  // stable value when nothing has actually changed, so cache the last
  // computed snapshot and only produce a new object once the seconds
  // digit actually ticks over.
  const cache = useRef<{ key: string; value: TimeLeft | null }>({
    key: "",
    value: null,
  });

  const timeLeft = useSyncExternalStore(
    subscribe,
    () => {
      const next = getTimeLeft(targetISO);
      const key = next
        ? `${next.days}:${next.hours}:${next.minutes}:${next.seconds}`
        : "done";
      if (cache.current.key !== key) {
        cache.current = { key, value: next };
      }
      return cache.current.value;
    },
    () => undefined
  );

  if (timeLeft === undefined) {
    return <div className="h-24" aria-hidden="true" />;
  }

  if (!timeLeft) {
    return (
      <p className="font-serif-display text-2xl text-gold-300">
        Today&apos;s the day! 🎉
      </p>
    );
  }

  const units: Array<[string, number]> = [
    ["Days", timeLeft.days],
    ["Hours", timeLeft.hours],
    ["Minutes", timeLeft.minutes],
    ["Seconds", timeLeft.seconds],
  ];

  return (
    <div
      role="timer"
      aria-label="Countdown to the wedding"
      className="flex justify-center gap-4 sm:gap-8"
    >
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-serif-display text-3xl font-semibold tabular-nums text-gold-300 sm:text-4xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] tracking-[0.2em] text-starlight-dim uppercase sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
