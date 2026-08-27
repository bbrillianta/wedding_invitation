import Image from "next/image";
import { siteContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/sections/Countdown";
import { ConstellationDivider } from "@/components/layout/ConstellationDivider";
import { Reveal } from "@/components/ui/Reveal";
import type { Guest } from "@/types";

export function Hero({ guest }: { guest?: Guest | null }) {
  const { couple, hero, weddingDateISO } = siteContent;
  const greetingName = guest?.groupLabel ?? guest?.name;

  // The hero is already in view when the page loads, so its <Reveal>s
  // wait on the intro finishing rather than on scroll (see lib/intro-state).
  // Staggering them lets the invitation assemble itself the moment the
  // clouds clear, instead of the guest landing on a finished page.
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={hero.heroImage}
          alt=""
          fill
          priority
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/30 via-midnight-950/60 to-midnight-950" />
      </div>

      {greetingName && (
        <Reveal y={16} delay={0.1}>
          <p className="mb-4 text-sm tracking-[0.2em] text-starlight-dim uppercase">
            Dear {greetingName}
          </p>
        </Reveal>
      )}

      <Reveal y={16} delay={0.2}>
        <p className="text-xs tracking-[0.35em] text-gold-400 uppercase">
          We&apos;re getting married
        </p>
      </Reveal>

      <Reveal y={24} delay={0.3} duration={0.9}>
        <h1 className="mt-6 font-script text-6xl leading-tight text-gold-300 sm:text-7xl">
          {couple.brideName} <span className="text-starlight">&amp;</span>{" "}
          {couple.groomName}
        </h1>
      </Reveal>

      <Reveal y={20} delay={0.5}>
        <p className="mt-6 max-w-md text-balance text-starlight-dim">
          {hero.subheading}
        </p>
      </Reveal>

      <ConstellationDivider className="mt-8" delay={0.6} />

      <Reveal y={16} delay={0.7}>
        <p className="font-serif-display text-lg text-starlight sm:text-xl">
          {formatDate(weddingDateISO)}
        </p>
      </Reveal>

      <Reveal y={20} delay={0.85}>
        <div className="mt-10">
          <Countdown targetISO={weddingDateISO} />
        </div>
      </Reveal>
    </section>
  );
}
