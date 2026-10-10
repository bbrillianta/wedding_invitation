"use client";

import { useActionState, useEffect, useRef } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { siteContent } from "@/lib/content";
import { submitUcapan, type UcapanState } from "@/app/rsvp/actions";
import type { Guest } from "@/types";

const initialState: UcapanState = { status: "idle" };

export function UcapanDoa({ guest }: { guest: Guest }) {
  const { ucapan } = siteContent;
  const submitForGuest = submitUcapan.bind(null, guest.code);
  const [state, formAction, isPending] = useActionState(
    submitForGuest,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the message field after a successful submit, but keep the form
  // mounted — a guest can send more than one Ucapan & Doa, so the box
  // should stay put and ready for the next one instead of being replaced
  // by a terminal success screen.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/70 bg-white/60 p-8 backdrop-blur-sm"
    >
      <p className="text-center text-sm text-ink-500">{ucapan.description}</p>
      <p className="text-center text-xs text-ink-500">
        Mengirim sebagai <span className="font-medium text-ink-700">{guest.name}</span>
      </p>

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

      {state.status === "success" && (
        <p className="flex items-center justify-center gap-2 text-center text-sm text-blossom-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {ucapan.successMessage}
        </p>
      )}
    </form>
  );
}
