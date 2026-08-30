import { Hero } from "@/components/sections/Hero";
import { OpeningGreeting } from "@/components/sections/OpeningGreeting";
import { Mempelai } from "@/components/sections/Mempelai";
import { Countdown } from "@/components/sections/Countdown";
import { EventDetails } from "@/components/sections/EventDetails";
import { LoveStoryTimeline } from "@/components/sections/LoveStoryTimeline";
import { Gallery } from "@/components/sections/Gallery";
import { UcapanSection } from "@/components/sections/UcapanSection";
import { GiftInfo } from "@/components/sections/GiftInfo";
import { ConstellationDivider } from "@/components/layout/ConstellationDivider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CloudIntro } from "@/components/intro/CloudIntro";
import { BackgroundMusic } from "@/components/audio/BackgroundMusic";
import { RSVPStickyBar } from "@/components/rsvp/RSVPStickyBar";
import type { Guest } from "@/types";

/**
 * Shared page body rendered by both "/" (generic) and "/invite/[slug]"
 * (personalized) — the only difference between the two routes is
 * whether a Guest is passed down.
 */
export function WeddingInvitation({ guest }: { guest?: Guest | null }) {
  return (
    <>
      <CloudIntro guest={guest} />
      <main id="invitation-content">
        <Hero guest={guest} />
        <ConstellationDivider />
        <OpeningGreeting />
        <ConstellationDivider />
        <Mempelai />
        <ConstellationDivider />
        <LoveStoryTimeline />
        <ConstellationDivider />
        <EventDetails />
        <ConstellationDivider />
        <Countdown />
        <ConstellationDivider />
        {/* <Gallery />
        <ConstellationDivider /> */}
        <UcapanSection guest={guest} />
        <ConstellationDivider />
        {/* <GiftInfo />
        <ConstellationDivider /> */}
        <SiteFooter />
        <BackgroundMusic />
        <RSVPStickyBar />
      </main>
    </>
  );
}
