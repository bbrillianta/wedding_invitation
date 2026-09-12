import type { UcapanMessage } from "@/lib/ucapan";
import { formatDate } from "@/lib/utils";

/**
 * The public guestbook wall of everyone's Ucapan & Doa messages, newest
 * first. Height-capped and independently scrollable (`.ucapan-scroll`,
 * `max-h-96`) so a long guest list scrolls inside its own card instead of
 * pushing the rest of the page down indefinitely.
 */
export function UcapanWall({ messages }: { messages: UcapanMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="mx-auto max-w-md text-center text-sm text-ink-500">
        Jadilah yang pertama mengirimkan ucapan &amp; doa.
      </p>
    );
  }

  return (
    <div className="ucapan-scroll mx-auto max-h-96 max-w-md space-y-4 overflow-y-auto overscroll-contain rounded-2xl border border-white/70 bg-white/60 p-6 backdrop-blur-sm">
      {messages.map((entry) => (
        <div
          key={entry.id}
          className="border-b border-white/50 pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-serif-display text-sm font-semibold text-ink-900">
              {entry.name}
            </p>
            <p className="shrink-0 text-xs text-ink-500">
              {formatDate(entry.createdAt, {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <p className="mt-1 text-sm break-words text-ink-700">
            {entry.message}
          </p>
        </div>
      ))}
    </div>
  );
}
