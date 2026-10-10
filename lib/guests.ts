import type { AttendanceStatus } from "@prisma/client";
import type { Guest } from "@/types";
import { prisma } from "@/lib/prisma";

/**
 * Every invitation link is /?id=<code>, and guests only exist because
 * prisma/seed.ts imported them from the couple's list: nothing a visitor
 * does creates one. An unknown or blank code is simply not an invitation.
 */
export async function getGuestByCode(code: string | undefined): Promise<Guest | null> {
  const trimmed = code?.trim();
  if (!trimmed) return null;

  const guest = await prisma.guest.findUnique({ where: { code: trimmed } });
  if (!guest) return null;

  return {
    code: guest.code,
    name: guest.name,
    groupLabel: guest.groupLabel ?? undefined,
    invitedGuestCount: guest.invitedGuestCount,
  };
}

export function maxPartySize(guest: { invitedGuestCount: number }): number {
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
export async function getSavedRsvp(code: string): Promise<SavedRsvp | null> {
  return prisma.rsvp.findFirst({
    where: { guest: { code } },
    select: { attendance: true, numberOfGuests: true },
  });
}
