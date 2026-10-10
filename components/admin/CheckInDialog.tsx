"use client";

import { useEffect, useRef, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { Car, Check, Minus, Motorbike, Plus, X } from "lucide-react";
import type { AdminGuest } from "@/lib/admin";
import { MAX_ARRIVED_GUESTS } from "@/lib/arrival";
import { cn } from "@/lib/utils";

export const VEHICLE_OPTIONS: { value: Vehicle; label: string; Icon: typeof Car }[] = [
  { value: "MOTORCYCLE", label: "Motor", Icon: Motorbike },
  { value: "CAR", label: "Mobil", Icon: Car },
];

export type ArrivalInput = { arrivedGuestCount: number; vehicle: Vehicle | null };

/**
 * Popup opened by a row's Check-in button (or its time chip, to edit a
 * saved arrival). Nothing is saved until Simpan; Esc, the ✕ and a tap on
 * the backdrop close it unchanged. A native modal <dialog> gives the
 * backdrop, Esc and focus containment for free.
 */
export function CheckInDialog({
  guest,
  current,
  onSave,
  onCancel,
}: {
  guest: AdminGuest | null;
  // The guest's arrival as the list currently shows it, to prefill an edit.
  current: ArrivalInput | null;
  onSave: (input: ArrivalInput) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (guest && !dialog.open) dialog.showModal();
    if (!guest && dialog.open) dialog.close();
  }, [guest]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="check-in-title"
      // Fires for Esc and for close() alike; the parent ignores a cancel
      // when nothing is open.
      onClose={onCancel}
      // A tap on the backdrop lands on the <dialog> itself, not its panel.
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-white p-0 text-ink-900 shadow-xl backdrop:bg-ink-900/40"
    >
      {/* Keyed per guest so every opening starts from fresh defaults. */}
      {guest && <ArrivalForm key={guest.id} guest={guest} current={current} onSave={onSave} onCancel={onCancel} />}
    </dialog>
  );
}

function ArrivalForm({
  guest,
  current,
  onSave,
  onCancel,
}: {
  guest: AdminGuest;
  current: ArrivalInput | null;
  onSave: (input: ArrivalInput) => void;
  onCancel: () => void;
}) {
  // Start from what the guest told us: their RSVP count if they said Hadir,
  // otherwise 1.
  const expected = guest.attendance === "ATTENDING" ? (guest.numberOfGuests ?? 1) : 1;
  // Kept as text so the usher can clear the field and type a new number;
  // `count` is only set while the text is a whole number in range.
  const justFocused = useRef(false);
  const [draft, setDraft] = useState(String(current?.arrivedGuestCount ?? expected));
  const parsed = /^\d+$/.test(draft) ? Number(draft) : NaN;
  const count = parsed >= 1 && parsed <= MAX_ARRIVED_GUESTS ? parsed : null;
  const clamp = (n: number) => Math.min(MAX_ARRIVED_GUESTS, Math.max(1, n));
  const step = (delta: number) => setDraft(String(clamp((count ?? (Number.isNaN(parsed) ? 1 : parsed)) + delta)));
  const save = () => count !== null && onSave({ arrivedGuestCount: count, vehicle });
  const [vehicle, setVehicle] = useState<Vehicle | null>(current?.vehicle ?? null);

  const stepper =
    "inline-flex size-12 items-center justify-center rounded-full bg-sky-200 text-ink-700 ring-1 ring-sky-400 transition hover:bg-sky-300 disabled:opacity-40";

  return (
    // Initial focus lands on the panel, not the first control, so nothing
    // looks preselected. The inline style beats the site-wide unlayered
    // :focus-visible outline.
    <div className="relative p-6" tabIndex={-1} autoFocus style={{ outline: "none" }}>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Tutup"
        className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-full text-ink-500 transition hover:bg-sky-200"
      >
        <X className="size-5" aria-hidden />
      </button>

      <p className="text-xs tracking-[0.2em] text-ink-500 uppercase">{current ? "Ubah check-in" : "Check-in"}</p>
      <h2 id="check-in-title" className="mt-1 pr-10 font-serif-display text-2xl font-semibold">
        {guest.groupLabel ?? guest.name}
      </h2>

      <label htmlFor="arrived-count" id="arrived-count-label" className="mt-5 block text-sm font-medium">
        Jumlah tamu yang datang
      </label>
      <div className="mt-2 flex items-center gap-4" role="group" aria-labelledby="arrived-count-label">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={count !== null && count <= 1}
          aria-label="Kurangi jumlah tamu"
          className={stepper}
        >
          <Minus className="size-5" aria-hidden />
        </button>
        <input
          id="arrived-count"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={2}
          autoComplete="off"
          value={draft}
          aria-invalid={count === null}
          aria-describedby="arrived-count-hint"
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
          // Select the number on focus so typing replaces it. The mouseup
          // ending the same tap would put the caret back, so swallow it.
          onFocus={(e) => {
            e.target.select();
            justFocused.current = true;
          }}
          onMouseUp={(e) => {
            if (justFocused.current) e.preventDefault();
            justFocused.current = false;
          }}
          // Leaving the field snaps an empty or out-of-range value back
          // into 1–MAX_ARRIVED_GUESTS.
          onBlur={() => {
            justFocused.current = false;
            if (count === null) setDraft(String(clamp(Number.isNaN(parsed) ? 1 : parsed)));
          }}
          onKeyDown={(e) => e.key === "Enter" && save()}
          className={cn(
            "h-14 w-20 rounded-2xl border bg-white text-center font-serif-display text-4xl font-semibold text-ink-900 lining-nums tabular-nums transition",
            count === null ? "border-blossom-600" : "border-sky-400 focus:border-ink-700"
          )}
        />
        <button
          type="button"
          onClick={() => step(1)}
          disabled={count !== null && count >= MAX_ARRIVED_GUESTS}
          aria-label="Tambah jumlah tamu"
          className={stepper}
        >
          <Plus className="size-5" aria-hidden />
        </button>
      </div>
      <p id="arrived-count-hint" className={cn("mt-2 text-xs", count === null ? "text-blossom-700" : "text-ink-500")}>
        {count === null
          ? `Isi angka 1–${MAX_ARRIVED_GUESTS}`
          : guest.attendance === "ATTENDING"
            ? `Konfirmasi di undangan: ${guest.numberOfGuests ?? 1} orang`
            : guest.attendance === "NOT_ATTENDING"
              ? "Konfirmasi di undangan: Tidak Hadir"
              : "Belum konfirmasi di undangan"}
      </p>

      <p id="vehicle-label" className="mt-5 text-sm font-medium">
        Kendaraan <span className="font-normal text-ink-500">(opsional)</span>
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3" role="group" aria-labelledby="vehicle-label">
        {VEHICLE_OPTIONS.map(({ value, label, Icon }) => {
          const selected = vehicle === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={selected}
              // Tapping the chosen one again clears it.
              onClick={() => setVehicle(selected ? null : value)}
              className={cn(
                "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-2xl transition active:scale-[0.98]",
                selected
                  ? "bg-ink-700 text-white shadow-sm ring-2 ring-ink-700"
                  : "bg-sky-200 text-ink-900 ring-1 ring-sky-400 hover:bg-sky-300"
              )}
            >
              <Icon className={cn("size-7", selected ? "text-white" : "text-ink-700")} aria-hidden />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={count === null}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blossom-600 text-base font-medium text-white shadow-sm transition hover:bg-blossom-700 disabled:opacity-50"
      >
        <Check className="size-5" aria-hidden />
        Simpan
      </button>
    </div>
  );
}
