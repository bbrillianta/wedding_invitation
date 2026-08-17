import Image from "next/image";
import { siteContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/sections/Countdown";
import { ConstellationDivider } from "@/components/layout/ConstellationDivider";
import type { Guest } from "@/types";

export function Hero({ guest }: { guest?: Guest | null }) {
  const { couple, hero, weddingDateISO } = siteContent;
  const greetingName = guest?.groupLabel ?? guest?.name;

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
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-950/40 via-midnight-950/70 to-midnight-950" />
      </div>

      {greetingName && (
        <p className="mb-4 text-sm tracking-[0.2em] text-starlight-dim uppercase">
          Dear {greetingName}
        </p>
      )}

      <p className="text-xs tracking-[0.35em] text-gold-400 uppercase">
        We&apos;re getting married
      </p>

      <h1 className="mt-6 font-script text-6xl leading-tight text-gold-300 sm:text-7xl">
        {couple.brideName} <span className="text-starlight">&amp;</span>{" "}
        {couple.groomName}
      </h1>

      <p className="mt-6 max-w-md text-balance text-starlight-dim">
        {hero.subheading}
      </p>

      <ConstellationDivider className="mt-8" />

      <p className="font-serif-display text-lg text-starlight sm:text-xl">
        {formatDate(weddingDateISO)}
      </p>

      <div className="mt-10">
        <Countdown targetISO={weddingDateISO} />
      </div>
    </section>
  );
}
