"use server";

import { revalidatePath } from "next/cache";
import type { Vehicle } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MAX_ARRIVED_GUESTS } from "@/lib/arrival";
import { isAdmin } from "@/lib/admin-auth";

export type CheckInState = {
  status: "success" | "error";
  checkedInAt?: string | null;
  vehicle?: Vehicle | null;
  arrivedGuestCount?: number | null;
  message?: string;
};

const VEHICLES: Vehicle[] = ["MOTORCYCLE", "CAR"];

/**
 * Server actions are public endpoints anyone can call directly, so each one
 * checks the admin session itself rather than relying on the page's guard.
 */
async function writeArrival(
  guestId: string,
  build: (current: { checkedInAt: Date | null }) => {
    checkedInAt: Date | null;
    vehicle: Vehicle | null;
    arrivedGuestCount: number | null;
  }
): Promise<CheckInState> {
  if (!(await isAdmin())) {
    return { status: "error", message: "Sesi berakhir. Muat ulang halaman dan login kembali." };
  }
  if (typeof guestId !== "string" || !guestId) {
    return { status: "error", message: "Data tidak valid." };
  }

  try {
    const current = await prisma.guest.findUnique({
      where: { id: guestId },
      select: { checkedInAt: true },
    });
    if (!current) {
      return { status: "error", message: "Tamu tidak ditemukan." };
    }

    const data = build(current);
    await prisma.guest.update({ where: { id: guestId }, data });

    try {
      revalidatePath("/admin");
    } catch (error) {
      console.error("revalidatePath failed after successful arrival write", error);
    }

    return {
      status: "success",
      checkedInAt: data.checkedInAt?.toISOString() ?? null,
      vehicle: data.vehicle,
      arrivedGuestCount: data.arrivedGuestCount,
    };
  } catch (error) {
    console.error("writeArrival failed", error);
    return { status: "error", message: "Gagal menyimpan. Periksa koneksi." };
  }
}

/**
 * Saves the check-in popup: how many people actually came and, optionally,
 * their vehicle. Checks the guest in on the first save; a later save edits
 * the count and vehicle but keeps the original arrival time.
 */
export async function saveArrival(
  guestId: string,
  arrivedGuestCount: number,
  vehicle: Vehicle | null
): Promise<CheckInState> {
  if (
    !Number.isInteger(arrivedGuestCount) ||
    arrivedGuestCount < 1 ||
    arrivedGuestCount > MAX_ARRIVED_GUESTS ||
    (vehicle !== null && !VEHICLES.includes(vehicle))
  ) {
    return { status: "error", message: "Data tidak valid." };
  }

  return writeArrival(guestId, (current) => ({
    checkedInAt: current.checkedInAt ?? new Date(),
    vehicle,
    arrivedGuestCount,
  }));
}

// Undoing an arrival forgets the count and vehicle too.
export async function undoCheckIn(guestId: string): Promise<CheckInState> {
  return writeArrival(guestId, () => ({ checkedInAt: null, vehicle: null, arrivedGuestCount: null }));
}
