"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ucapanSchema } from "@/lib/validations/rsvp";
import { MAX_PARTY_SIZE } from "@/lib/guests";

export type UcapanState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type AttendanceState = {
  status: "success" | "error";
  message?: string;
};

const ATTENDANCE_CHOICES = ["ATTENDING", "NOT_ATTENDING"] as const;
type AttendanceChoice = (typeof ATTENDANCE_CHOICES)[number];

/**
 * The guest a submission belongs to, looked up by their invitation code.
 * Guests only come from the imported list, so an unknown code gets null
 * and nothing is created.
 */
async function resolveGuest(code: string) {
  if (typeof code !== "string" || !code.trim()) return null;
  return prisma.guest.findUnique({ where: { code: code.trim() } });
}

/**
 * Adds an Ucapan & Doa message. Bound with the guest's code via `.bind()`
 * at the call site — see UcapanDoa.tsx. The sender's name is the guest's
 * stored name, not anything from the form.
 */
export async function submitUcapan(
  code: string,
  _prevState: UcapanState,
  formData: FormData
): Promise<UcapanState> {
  // Honeypot: a real visitor never fills this hidden field in; a bot
  // filling every field on the form will. Pretend success so bots don't
  // learn the trap failed.
  if (formData.get("company")) {
    return { status: "success" };
  }

  const parsed = ucapanSchema.safeParse({
    message: formData.get("message")?.toString() ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  const { message } = parsed.data;

  try {
    const guest = await resolveGuest(code);
    if (!guest) {
      return { status: "error", message: "Tamu tidak ditemukan." };
    }
    const guestId = guest.id;

    // A guest can send more than one Ucapan & Doa, so each submission is
    // its own row rather than overwriting a singleton message.
    await prisma.ucapanMessage.create({
      data: { guestId, message },
    });

    // The message is already persisted at this point — a revalidation
    // hiccup shouldn't turn a successful submission into a reported
    // failure, so it gets its own try/catch rather than sharing the one
    // around the writes above.
    try {
      revalidatePath("/");
    } catch (error) {
      console.error("revalidatePath failed after successful submitUcapan write", error);
    }

    return { status: "success" };
  } catch (error) {
    console.error("submitUcapan failed", error);
    return {
      status: "error",
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}

/**
 * Handles a Hadir/Tidak Hadir tap from <RSVPStickyBar/> — called
 * directly from the click handler rather than bound to a `<form>`,
 * since a two-button choice doesn't need one. Insert-or-update (upsert)
 * on the guest's single Rsvp row, keyed by guestId, so a repeat confirmation
 * (changing their mind on a later visit) updates in place instead of
 * erroring on the unique constraint or creating a duplicate.
 */
export async function submitAttendance(
  code: string,
  attendance: AttendanceChoice,
  numberOfGuests = 1
): Promise<AttendanceState> {
  // The UI only ever sends one of these two values, but this function is
  // a public RPC endpoint once deployed — anyone can POST to it directly,
  // so the value needs its own check rather than trusting the TS type.
  if (!ATTENDANCE_CHOICES.includes(attendance)) {
    return { status: "error", message: "Data tidak valid." };
  }

  try {
    const guest = await resolveGuest(code);
    if (!guest) {
      return { status: "error", message: "Tamu tidak ditemukan." };
    }

    // Party size only matters for a "Hadir"; a "Tidak Hadir" leaves the
    // last saved count alone rather than overwriting it.
    let data: { attendance: AttendanceChoice; numberOfGuests?: number } = { attendance };
    if (attendance === "ATTENDING") {
      if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1 || numberOfGuests > MAX_PARTY_SIZE) {
        return { status: "error", message: `Jumlah tamu harus antara 1 dan ${MAX_PARTY_SIZE}.` };
      }
      data = { attendance, numberOfGuests };
    }

    await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      update: data,
      create: { guestId: guest.id, ...data },
    });

    try {
      revalidatePath("/");
    } catch (error) {
      console.error("revalidatePath failed after successful submitAttendance write", error);
    }

    return { status: "success" };
  } catch (error) {
    console.error("submitAttendance failed", error);
    return {
      status: "error",
      message: "Terjadi kesalahan. Silakan coba lagi.",
    };
  }
}
