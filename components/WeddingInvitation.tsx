import { Hero } from "@/components/sections/Hero";
import { EventDetails } from "@/components/sections/EventDetails";
import { LoveStoryTimeline } from "@/components/sections/LoveStoryTimeline";
import { Gallery } from "@/components/sections/Gallery";
import { GiftInfo } from "@/components/sections/GiftInfo";
import { RSVPSection } from "@/components/sections/RSVPSection";
import { ConstellationDivider } from "@/components/layout/ConstellationDivider";
import { SiteFooter } from "@/components/layout/SiteFooter";
import type { Guest } from "@/types";

/**
 * Shared page body rendered by both "/" (generic) and "/invite/[slug]"
 * (personalized) — the only difference between the two routes is
 * whether a Guest is passed down.
 */
export function WeddingInvitation({ guest }: { guest?: Guest | null }) {
  return (
    <main>
      <Hero guest={guest} />
      <ConstellationDivider />
      <EventDetails />
      <ConstellationDivider />
      <LoveStoryTimeline />
      <ConstellationDivider />
      <Gallery />
      <ConstellationDivider />
      <GiftInfo />
      <ConstellationDivider />
      <RSVPSection guest={guest} />
      <SiteFooter />
    </main>
  );
}
