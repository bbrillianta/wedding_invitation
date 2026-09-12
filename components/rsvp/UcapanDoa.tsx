"use client";

import { useActionState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { siteContent } from "@/lib/content";
import { submitUcapan, type UcapanState } from "@/app/rsvp/actions";
import type { Guest } from "@/types";

const initialState: UcapanState = { status: "idle" };

export function UcapanDoa({
  guest,
  guestName,
}: {
  guest?: Guest | null;
  /** From the `?name=` link for a visitor with no DB-backed `guest`. */
  guestName?: string;
}) {
  const { ucapan } = siteContent;
  const senderName = guest?.name ?? guestName ?? "";
  const submitForGuest = submitUcapan.bind(null, guest?.slug);
  const [state, formAction, isPending] = useActionState(
    submitForGuest,
    initialState
  );

  if (state.status === "success") {
    return (
      <div className="mx-auto flex max-w-md items-center justify-center gap-2 rounded-2xl border border-white/70 bg-white/60 p-8 text-center text-sm text-ink-700 backdrop-blur-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-blossom-700" />
        {ucapan.successMessage}
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/70 bg-white/60 p-8 backdrop-blur-sm"
    >
      <p className="text-center text-sm text-ink-500">{ucapan.description}</p>
      <p className="text-center text-xs text-ink-500">
        Mengirim sebagai <span className="font-medium text-ink-700">{senderName}</span>
      </p>

      {/* The sender's name comes from the guest link (DB-backed slug or
          the `?name=` query param — both are required to reach this
          form at all, see app/page.tsx), not a free-text field, so it
          travels to submitUcapan as a hidden input instead of visible,
          editable UI. */}
      <input type="hidden" name="name" value={senderName} />

      <div>
        <label
          htmlFor="ucapan-message"
          className="text-xs tracking-[0.2em] text-ink-700 uppercase"
        >
          Ucapan &amp; Doa
        </label>
        <textarea
          id="ucapan-message"
          name="message"
          placeholder={ucapan.messagePlaceholder}
          required
          rows={4}
          maxLength={500}
          className="mt-2 w-full resize-none rounded-lg border border-white/70 bg-white/70 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-blossom-400"
        />
      </div>

      {/* Honeypot: visually hidden (Tailwind's `sr-only`, not
          `type="hidden"` — bots skip those) and `aria-hidden`/untabbable
          so it never reaches real visitors, sighted or on a screen
          reader; a filled value trips the spam check in submitUcapan. */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="ucapan-company">Company</label>
        <input
          id="ucapan-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && (
        <p role="alert" className="text-center text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blossom-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blossom-600 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        {ucapan.submitLabel}
      </button>
    </form>
  );
}
