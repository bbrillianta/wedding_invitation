"use client";

import { useRef, useSyncExternalStore } from "react";
import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

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
 *
 * Unit labels (Days/Hours/Minutes/Seconds) are kept in English —
 * one of the few fixed English spots in an otherwise Indonesian site,
 * matching the convention on the reference invitation sites surveyed
 * during planning.
 */
function CountdownDigits({ targetISO }: { targetISO: string }) {
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
      <p className="font-serif-display text-2xl text-starlight">
        Hari bahagia telah tiba! 🎉
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
      aria-label="Hitung mundur menuju hari pernikahan"
      className="flex justify-center gap-4 sm:gap-8"
    >
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-serif-display text-3xl font-semibold tabular-nums text-blossom-700 sm:text-4xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] tracking-[0.2em] text-ink-500 uppercase sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Countdown() {
  const { weddingDateISO } = siteContent;
  return (
    <section id="countdown" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Hari Bahagia" title="Menghitung Hari" />
        <Reveal y={20} delay={0.2} className="mt-12">
          <CountdownDigits targetISO={weddingDateISO} />
        </Reveal>
      </Container>
    </section>
  );
}
