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
import { getSavedRsvp, MAX_PARTY_SIZE } from "@/lib/guests";
import type { Guest } from "@/types";

/** The invitation itself, for a guest found by their link's code. */
export async function WeddingInvitation({ guest }: { guest: Guest }) {
  const savedRsvp = await getSavedRsvp(guest.code);

  return (
    <>
      <CloudIntro guest={guest} />
      <main id="invitation-content">
        <Hero />
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
        <RSVPStickyBar
          code={guest.code}
          initialAttendance={savedRsvp?.attendance ?? null}
          initialGuestCount={savedRsvp?.numberOfGuests ?? 1}
          maxGuests={MAX_PARTY_SIZE}
        />
      </main>
      {/* Outside `main`, which is inert while the cover is up: its toggle
          has to work on the cover too. */}
      <BackgroundMusic />
    </>
  );
}
