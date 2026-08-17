import type { Guest } from "@/types";
import { guests } from "@/lib/guests-data";

/**
 * The seam between phases: Phase 1 reads the static array below.
 * Phase 2 swaps these internals for Prisma queries while keeping the
 * same exported function signatures, so pages/components don't change.
 */

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  return guests.find((guest) => guest.slug === slug) ?? null;
}

export async function getAllGuestSlugs(): Promise<string[]> {
  return guests.map((guest) => guest.slug);
}
