"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ucapanSchema } from "@/lib/validations/rsvp";
import { genericGuestSlug, maxPartySize } from "@/lib/guests";

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
 * Resolves the Guest a submission belongs to, for both the personalized
 * (`slug` set) and generic (`slug` undefined, name-only) paths. The
 * generic path upserts on a name-derived slug (see genericGuestSlug)
 * rather than always creating a new row, so the same `?name=` link
 * consistently resolves back to the same guest across visits — that's
 * what lets a returning guest's saved RSVP/Ucapan be found again on
 * reload instead of every visit spawning a fresh anonymous row.
 */
async function resolveGuest(slug: string | undefined, name: string) {
  if (slug) {
    return prisma.guest.findUnique({ where: { slug } });
  }

  return prisma.guest.upsert({
    where: { slug: genericGuestSlug(name) },
    update: {},
    create: {
      slug: genericGuestSlug(name),
      // Defensive cap: this name reaches the DB straight from a URL
      // query param on the generic path, not through ucapanSchema's
      // own length-checked form field.
      name: name.slice(0, 100),
      isGeneric: true,
      invitedGuestCount: 1,
    },
  });
}

/**
 * Handles both the personalized (`slug` set, from `/invite/[slug]`) and
 * generic (`slug` undefined, from `/`) Ucapan & Doa paths. Bound with the
 * guest's slug via `.bind()` at the call site — see UcapanDoa.tsx.
 */
export async function submitUcapan(
  slug: string | undefined,
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
    name: formData.get("name")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Data tidak valid.",
    };
  }

  const { name, message } = parsed.data;

  try {
    const guest = await resolveGuest(slug, name);
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
      revalidatePath(slug ? `/invite/${slug}` : "/");
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
 * since a two-button choice doesn't need one. Same personalized/generic
 * split as submitUcapan, and the same insert-or-update (upsert) on the
 * guest's single Rsvp row, keyed by guestId, so a repeat confirmation
 * (changing their mind on a later visit) updates in place instead of
 * erroring on the unique constraint or creating a duplicate.
 */
export async function submitAttendance(
  slug: string | undefined,
  name: string,
  attendance: AttendanceChoice,
  numberOfGuests = 1
): Promise<AttendanceState> {
  // The UI only ever sends one of these two values, but this function is
  // a public RPC endpoint once deployed — anyone can POST to it directly,
  // so the value needs its own check rather than trusting the TS type.
  if (!ATTENDANCE_CHOICES.includes(attendance)) {
    return { status: "error", message: "Data tidak valid." };
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return { status: "error", message: "Tamu tidak ditemukan." };
  }

  try {
    const guest = await resolveGuest(slug, trimmedName);
    if (!guest) {
      return { status: "error", message: "Tamu tidak ditemukan." };
    }

    // Party size only matters for a "Hadir"; a "Tidak Hadir" leaves the
    // last saved count alone rather than overwriting it.
    let data: { attendance: AttendanceChoice; numberOfGuests?: number } = { attendance };
    if (attendance === "ATTENDING") {
      const max = maxPartySize(guest);
      if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1 || numberOfGuests > max) {
        return { status: "error", message: `Jumlah tamu harus antara 1 dan ${max}.` };
      }
      data = { attendance, numberOfGuests };
    }

    await prisma.rsvp.upsert({
      where: { guestId: guest.id },
      update: data,
      create: { guestId: guest.id, ...data },
    });

    try {
      revalidatePath(slug ? `/invite/${slug}` : "/");
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
