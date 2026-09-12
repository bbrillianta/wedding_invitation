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
import { getAttendance, genericGuestSlug } from "@/lib/guests";
import type { Guest } from "@/types";

/**
 * Shared page body rendered by both "/" (generic) and "/invite/[slug]"
 * (personalized) — the only difference between the two routes is
 * whether a Guest is passed down.
 */
export async function WeddingInvitation({
  guest,
  guestName,
}: {
  guest?: Guest | null;
  /** From the "/" route's `?name=` link — see app/page.tsx. */
  guestName?: string;
}) {
  // Read-only lookup: does this guest already have a saved attendance?
  // Uses the same deterministic slug the write side (resolveGuestId in
  // app/rsvp/actions.ts) would upsert into for a generic guest, so a
  // returning visit checks the row it would land on. This is *only* for
  // checking existing state, though — RSVPStickyBar itself still gets
  // the real `guest?.slug` below (undefined for a generic guest), not
  // this computed one, because `slug` also tells submitAttendance
  // whether to require an existing guest (personalized) or upsert-create
  // one (generic). Passing the computed slug there instead would make a
  // first-time generic guest's confirm look like a lookup for a guest
  // that doesn't exist yet, and fail instead of inserting.
  const attendanceLookupSlug =
    guest?.slug ?? (guestName ? genericGuestSlug(guestName) : undefined);
  const rsvpName = guest?.name ?? guestName;
  const attendance = attendanceLookupSlug
    ? await getAttendance(attendanceLookupSlug)
    : null;

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
        <UcapanSection guest={guest} guestName={guestName} />
        <ConstellationDivider />
        {/* <GiftInfo />
        <ConstellationDivider /> */}
        <SiteFooter />
        <BackgroundMusic />
        <RSVPStickyBar
          slug={guest?.slug}
          name={rsvpName}
          initialAttendance={attendance}
        />
      </main>
    </>
  );
}
