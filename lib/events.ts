import "server-only";
import type { EventDetail } from "@/types";

/**
 * The Akad and Resepsi details. Kept out of lib/content.ts on purpose:
 * client components (the cover, for one) import siteContent, which would
 * ship the Akad's place and time in the JavaScript every guest downloads.
 * Here they only ever reach the HTML, and EventDetails renders the Akad
 * only for guests with `akad` set.
 */
export const events: { ceremony: EventDetail; reception: EventDetail } = {
  ceremony: {
    name: "Akad",
    dateTimeISO: "2026-11-26T09:00:00+07:00",
    endTimeISO: "2026-11-26T10:00:00+07:00",
    venueName: "Masjid Namira",
    address: "Lamongan, Jawa Timur",
    mapEmbedUrl: "https://www.google.com/maps?q=-7.1526463,112.4084817&output=embed",
    mapLink: "https://maps.app.goo.gl/NHtFBQSd9stBLU7Q7",
  },
  reception: {
    name: "Resepsi",
    dateTimeISO: "2026-11-28T10:00:00+07:00",
    endTimeISO: "2026-11-28T13:00:00+07:00",
    venueName: "Gedung Wanita Candra Kencana",
    address: "Surabaya, Jawa Timur",
    mapEmbedUrl: "https://www.google.com/maps?q=-7.2878229,112.7618051&output=embed",
    mapLink: "https://maps.app.goo.gl/efn4TMUNne1WmWZC9",
  },
};
