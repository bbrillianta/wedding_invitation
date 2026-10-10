"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Vehicle } from "@prisma/client";
import { Search } from "lucide-react";
import type { AdminGuest } from "@/lib/admin";
import { saveArrival, undoCheckIn, type CheckInState } from "@/app/admin/actions";
import { CheckInButton } from "@/components/admin/CheckInButton";
import { CheckInDialog, type ArrivalInput } from "@/components/admin/CheckInDialog";

// Several ushers can work at once, so each screen pulls in the others'
// check-ins on this interval and whenever the tab comes back into view.
const REFRESH_INTERVAL_MS = 30_000;

type Arrival = { checkedInAt: string | null; vehicle: Vehicle | null; arrivedGuestCount: number | null };
type Override = Arrival & { pending: boolean };
// `retry` repeats exactly the change that failed.
type Failure = { message: string; retry: () => void };

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function without<T>(record: Record<string, T>, key: string) {
  const next = { ...record };
  delete next[key];
  return next;
}

function attendanceLabel(guest: AdminGuest) {
  if (guest.attendance === "ATTENDING") {
    return { text: `Hadir · ${guest.numberOfGuests ?? 1} orang`, className: "bg-sky-300 text-ink-900" };
  }
  if (guest.attendance === "NOT_ATTENDING") {
    return { text: "Tidak Hadir", className: "bg-cloud-blush text-blossom-700" };
  }
  return { text: "Belum menjawab", className: "bg-white text-ink-500 ring-1 ring-sky-400" };
}

export function AdminGuestList({ guests }: { guests: AdminGuest[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  // Arrivals shown ahead of the server. A pending entry is the optimistic
  // flip; a settled one bridges the gap until fresh props arrive.
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [failures, setFailures] = useState<Record<string, Failure>>({});
  const [prevGuests, setPrevGuests] = useState(guests);
  // The guest whose check-in popup is open, if any.
  const [checkingIn, setCheckingIn] = useState<AdminGuest | null>(null);

  // Fresh server data supersedes every settled override; in-flight ones
  // stay until their own request answers.
  if (guests !== prevGuests) {
    setPrevGuests(guests);
    setOverrides((current) =>
      Object.fromEntries(Object.entries(current).filter(([, o]) => o.pending))
    );
  }

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router]);

  const arrivalOf = (guest: AdminGuest): Arrival => overrides[guest.id] ?? guest;
  const editing = checkingIn && arrivalOf(checkingIn).checkedInAt ? arrivalOf(checkingIn) : null;

  /**
   * Shows `next` immediately, sends `save`, then either settles on what the
   * server stored or rolls back and offers a retry.
   */
  async function change(guest: AdminGuest, next: Arrival, save: () => Promise<CheckInState>) {
    const id = guest.id;
    setFailures((current) => without(current, id));
    setOverrides((current) => ({ ...current, [id]: { ...next, pending: true } }));

    let result: CheckInState;
    try {
      result = await save();
    } catch {
      // The request itself failed (offline, timeout), not just the write.
      result = { status: "error", message: "Gagal menyimpan. Periksa koneksi." };
    }

    if (result.status === "success") {
      setOverrides((current) => ({
        ...current,
        [id]: {
          checkedInAt: result.checkedInAt ?? null,
          vehicle: result.vehicle ?? null,
          arrivedGuestCount: result.arrivedGuestCount ?? null,
          pending: false,
        },
      }));
    } else {
      setOverrides((current) => without(current, id));
      setFailures((current) => ({
        ...current,
        [id]: { message: result.message ?? "Gagal menyimpan.", retry: () => change(guest, next, save) },
      }));
    }
  }

  // A first save checks the guest in now; an edit keeps their arrival time.
  const save = (guest: AdminGuest, { arrivedGuestCount, vehicle }: ArrivalInput) =>
    change(
      guest,
      { checkedInAt: arrivalOf(guest).checkedInAt ?? new Date().toISOString(), vehicle, arrivedGuestCount },
      () => saveArrival(guest.id, arrivedGuestCount, vehicle)
    );
  const undo = (guest: AdminGuest) =>
    change(guest, { checkedInAt: null, vehicle: null, arrivedGuestCount: null }, () => undoCheckIn(guest.id));

  const attending = guests.filter((g) => g.attendance === "ATTENDING");
  const totals = {
    guests: guests.length,
    attending: attending.length,
    attendingPeople: attending.reduce((sum, g) => sum + (g.numberOfGuests ?? 1), 0),
    notAttending: guests.filter((g) => g.attendance === "NOT_ATTENDING").length,
    arrived: guests.filter((g) => arrivalOf(g).checkedInAt).length,
    arrivedPeople: guests.reduce((sum, g) => sum + (arrivalOf(g).arrivedGuestCount ?? 0), 0),
    motorcycles: guests.filter((g) => arrivalOf(g).vehicle === "MOTORCYCLE").length,
    cars: guests.filter((g) => arrivalOf(g).vehicle === "CAR").length,
  };

  const needle = normalize(query.trim());
  const visible = needle
    ? guests.filter((g) =>
        [g.name, g.groupLabel ?? ""].some((field) => normalize(field).includes(needle))
      )
    : guests;

  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Tamu terdaftar" value={totals.guests} />
        <Stat label="Konfirmasi hadir" value={totals.attending} detail={`${totals.attendingPeople} orang`} />
        <Stat label="Tidak hadir" value={totals.notAttending} />
        <Stat label="Sudah datang" value={totals.arrived} detail={`${totals.arrivedPeople} orang`} highlight />
        <Stat label="Motor" value={totals.motorcycles} />
        <Stat label="Mobil" value={totals.cars} />
      </dl>

      <label className="relative mt-6 block">
        <span className="sr-only">Cari tamu</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-500" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari nama tamu…"
          autoComplete="off"
          className="h-12 w-full rounded-full border border-sky-400 bg-white pr-4 pl-11 text-base text-ink-900 placeholder:text-ink-500/70"
        />
      </label>

      <p className="mt-3 px-1 text-xs text-ink-500" aria-live="polite">
        {needle ? `${visible.length} dari ${guests.length} tamu` : `${guests.length} tamu`}
      </p>

      <ul className="mt-2 divide-y divide-sky-300 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sky-400/60">
        {visible.map((guest) => {
          const label = attendanceLabel(guest);
          const failure = failures[guest.id];
          const arrival = arrivalOf(guest);
          const pending = overrides[guest.id]?.pending ?? false;
          return (
            <li key={guest.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-900">{guest.groupLabel ?? guest.name}</p>
                {(guest.side || guest.akad) && (
                  <p className="truncate text-xs text-ink-500">
                    {[guest.side, guest.akad && "Akad"].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${label.className}`}>{label.text}</span>
                  {arrival.checkedInAt && arrival.arrivedGuestCount !== null && (
                    <span className="font-medium text-emerald-800">Datang {arrival.arrivedGuestCount} orang</span>
                  )}
                </p>
              </div>
              <div className="shrink-0">
                <CheckInButton
                  name={guest.name}
                  checkedInAt={arrival.checkedInAt}
                  vehicle={arrival.vehicle}
                  pending={pending}
                  failed={failure?.message ?? null}
                  onCheckIn={() => setCheckingIn(guest)}
                  onEdit={() => setCheckingIn(guest)}
                  onUndo={() => undo(guest)}
                  onRetry={() => failure?.retry()}
                />
              </div>
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ink-500">Tidak ada tamu yang cocok.</li>
        )}
      </ul>

      <CheckInDialog
        guest={checkingIn}
        current={editing && { arrivedGuestCount: editing.arrivedGuestCount ?? 1, vehicle: editing.vehicle }}
        onSave={(input) => {
          if (checkingIn) save(checkingIn, input);
          setCheckingIn(null);
        }}
        onCancel={() => setCheckingIn(null)}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  detail,
  highlight,
}: {
  label: string;
  value: number;
  detail?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 shadow-sm ring-1 ${
        highlight ? "bg-blossom-600 text-white ring-blossom-700" : "bg-white text-ink-900 ring-sky-400/60"
      }`}
    >
      <dt className={`text-xs ${highlight ? "text-white/85" : "text-ink-500"}`}>{label}</dt>
      <dd className="mt-1 font-serif-display text-3xl leading-none font-semibold lining-nums tabular-nums">
        {value}
        {detail && <span className="ml-1.5 font-body text-xs font-normal">{detail}</span>}
      </dd>
    </div>
  );
}
