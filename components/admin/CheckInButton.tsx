"use client";

import type { Vehicle } from "@prisma/client";
import { Check, RotateCw, Undo2 } from "lucide-react";
import { VEHICLE_OPTIONS } from "@/components/admin/CheckInDialog";

const timeFormat = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/**
 * Purely presentational: the list owns the optimistic state so the totals
 * move in step with the row. `failed` is set when the last attempt was
 * rolled back, and Retry repeats that same attempt.
 */
export function CheckInButton({
  name,
  checkedInAt,
  vehicle,
  pending,
  failed,
  onCheckIn,
  onEdit,
  onUndo,
  onRetry,
}: {
  name: string;
  checkedInAt: string | null;
  vehicle: Vehicle | null;
  pending: boolean;
  failed: string | null;
  onCheckIn: () => void;
  onEdit: () => void;
  onUndo: () => void;
  onRetry: () => void;
}) {
  if (failed) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-blossom-700 bg-white px-4 text-sm font-medium text-blossom-700 transition hover:bg-cloud-blush"
        >
          <RotateCw className="size-4" aria-hidden />
          Coba lagi
        </button>
        <p role="alert" className="text-xs text-blossom-700">
          {failed}
        </p>
      </div>
    );
  }

  if (checkedInAt) {
    const option = VEHICLE_OPTIONS.find((o) => o.value === vehicle);
    return (
      <div className="flex items-center gap-2">
        {/* Tapping the chip reopens the popup to correct the count or vehicle. */}
        <button
          type="button"
          onClick={onEdit}
          disabled={pending}
          aria-label={`Ubah check-in ${name}, datang pukul ${timeFormat.format(new Date(checkedInAt))}${option ? `, ${option.label}` : ""}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-emerald-100 px-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-50"
        >
          {option ? <option.Icon className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />}
          {timeFormat.format(new Date(checkedInAt))}
        </button>
        <button
          type="button"
          onClick={onUndo}
          disabled={pending}
          aria-label={`Batalkan check-in ${name}`}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink-500 transition hover:bg-sky-200 disabled:opacity-50"
        >
          <Undo2 className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onCheckIn}
      disabled={pending}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-blossom-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-blossom-700 disabled:opacity-50"
    >
      <Check className="size-4" aria-hidden />
      Check-in
    </button>
  );
}
