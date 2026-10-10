import { prisma } from "@/lib/prisma";

export type UcapanMessage = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

/**
 * Every submitted Ucapan & Doa message, newest first, for the public
 * guestbook wall in UcapanSection. A guest may have left more than one
 * message, so these come from the one-to-many UcapanMessage table rather
 * than the singleton Rsvp row. Capped well above any realistic guest
 * count as a defensive limit, not a product requirement.
 */
export async function getUcapanMessages(): Promise<UcapanMessage[]> {
  const entries = await prisma.ucapanMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      message: true,
      createdAt: true,
      guest: { select: { name: true } },
    },
  });

  return entries.map((entry) => ({
    id: entry.id,
    name: entry.guest.name,
    message: entry.message,
    createdAt: entry.createdAt.toISOString(),
  }));
}
