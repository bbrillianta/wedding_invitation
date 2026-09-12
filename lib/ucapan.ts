import { prisma } from "@/lib/prisma";

export type UcapanMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

/**
 * Every submitted Ucapan & Doa message, newest first, for the public
 * guestbook wall in UcapanSection. Capped well above any realistic guest
 * count as a defensive limit, not a product requirement.
 */
export async function getUcapanMessages(): Promise<UcapanMessage[]> {
  const rsvps = await prisma.rsvp.findMany({
    where: { message: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      message: true,
      createdAt: true,
      guest: { select: { name: true } },
    },
  });

  return rsvps.map((rsvp) => ({
    id: rsvp.id,
    name: rsvp.guest.name,
    message: rsvp.message!,
    createdAt: rsvp.createdAt.toISOString(),
  }));
}
