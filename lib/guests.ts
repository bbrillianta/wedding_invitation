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

/**
 * A guest's saved attendance, or null if they haven't confirmed yet (or
 * don't exist in the DB at all — a fresh generic slug nobody has
 * submitted under). Read-only: unlike the server actions, this never
 * creates a row, since a page view alone shouldn't write to the DB.
 */
export async function getAttendance(slug: string): Promise<AttendanceStatus | null> {
  const rsvp = await prisma.rsvp.findFirst({
    where: { guest: { slug } },
    select: { attendance: true },
  });
  return rsvp?.attendance ?? null;
}
