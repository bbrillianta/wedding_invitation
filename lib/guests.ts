import type { AttendanceStatus } from "@prisma/client";
import type { Guest } from "@/types";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

/**
 * The seam between phases: Phase 1 read the static array in
 * guests-data.ts. Phase 2 queries Prisma instead, keeping the same
 * exported function signatures so pages/components don't change.
 */

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const guest = await prisma.guest.findUnique({ where: { slug } });
  if (!guest) return null;

  return {
    slug: guest.slug,
    name: guest.name,
    groupLabel: guest.groupLabel ?? undefined,
    invitedGuestCount: guest.invitedGuestCount,
  };
}

export async function getAllGuestSlugs(): Promise<string[]> {
  const guests = await prisma.guest.findMany({ select: { slug: true } });
  return guests.map((guest) => guest.slug);
}

/**
 * Deterministic slug for a name-only guest (the "/" route's `?name=`
 * link, no DB-backed slug of their own). The same name always resolves
 * to the same slug — and so the same Guest row — so a returning visit
 * (page reload with the same link) is recognized instead of spawning a
 * new row every time. Shared with the write side in app/rsvp/actions.ts
 * so the two can never drift apart.
 */
export function genericGuestSlug(name: string): string {
  return slugify(name) || "tamu";
}

// A `?name=` link isn't tied to a seeded party size, so it gets a fixed cap.
export const GENERIC_MAX_PARTY_SIZE = 5;

export function maxPartySize(guest: { isGeneric?: boolean; invitedGuestCount: number } | null | undefined): number {
  if (!guest || guest.isGeneric) return GENERIC_MAX_PARTY_SIZE;
  return Math.max(1, guest.invitedGuestCount);
}

export type SavedRsvp = {
  attendance: AttendanceStatus | null;
  numberOfGuests: number;
};

/**
 * A guest's saved RSVP, or null if they have no row yet. Read-only: unlike
 * the server actions, this never creates a row, since a page view alone
 * shouldn't write to the DB.
 */
export async function getSavedRsvp(slug: string): Promise<SavedRsvp | null> {
  return prisma.rsvp.findFirst({
    where: { guest: { slug } },
    select: { attendance: true, numberOfGuests: true },
  });
}
