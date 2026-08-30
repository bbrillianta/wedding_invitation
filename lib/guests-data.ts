import type { Guest } from "@/types";

/**
 * Phase 1 static guest list. In Phase 2 these rows migrate into the
 * Guest database table (same slugs, so shared links keep working) and
 * lib/guests.ts switches to querying Prisma instead of this array.
 */
export const guests: Guest[] = [
  { slug: "keluarga-budi", name: "Keluarga Budi", groupLabel: "Keluarga Budi", invitedGuestCount: 4 },
  { slug: "siti-rahma", name: "Siti Rahma", invitedGuestCount: 2 },
  { slug: "andi-wijaya", name: "Andi Wijaya", invitedGuestCount: 1 },
  { slug: "keluarga-hartono", name: "Keluarga Hartono", groupLabel: "Keluarga Hartono", invitedGuestCount: 5 },
  { slug: "dewi-lestari", name: "Dewi Lestari", invitedGuestCount: 2 },
  { slug: "rizky-pratama", name: "Rizky Pratama", invitedGuestCount: 1 },
];
