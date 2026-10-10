import type { AttendanceStatus, Vehicle } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * One row of the wedding-day check-in list. Dates are sent as ISO strings
 * because this crosses into a client component.
 */
export type AdminGuest = {
  id: string;
  code: string;
  name: string;
  groupLabel: string | null;
  side: string | null;
  attendance: AttendanceStatus | null;
  numberOfGuests: number | null;
  checkedInAt: string | null;
  vehicle: Vehicle | null;
  arrivedGuestCount: number | null;
};

export async function getAdminGuests(): Promise<AdminGuest[]> {
  const guests = await prisma.guest.findMany({
    include: { rsvp: { select: { attendance: true, numberOfGuests: true } } },
    orderBy: { name: "asc" },
  });

  return guests.map((guest) => ({
    id: guest.id,
    code: guest.code,
    name: guest.name,
    groupLabel: guest.groupLabel,
    side: guest.side,
    attendance: guest.rsvp?.attendance ?? null,
    numberOfGuests: guest.rsvp?.numberOfGuests ?? null,
    checkedInAt: guest.checkedInAt?.toISOString() ?? null,
    vehicle: guest.vehicle,
    arrivedGuestCount: guest.arrivedGuestCount,
  }));
}
