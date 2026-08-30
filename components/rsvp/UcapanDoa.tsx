"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { siteContent } from "@/lib/content";
import type { Guest } from "@/types";

/**
 * Phase 1 stand-in for a real guestbook: there's no backend yet to
 * store a message, so submitting builds a WhatsApp deep link prefilled
 * with the guest's name and message and opens it, rather than faking a
 * "sent!" state that goes nowhere — same honesty principle as
 * <RSVPStickyBar/>. In Phase 2 this maps onto the same `Rsvp.message`
 * field and server actions RSVPForm uses, once the DB backend ships.
 */
export function UcapanDoa({ guest }: { guest?: Guest | null }) {
  const { rsvp, ucapan } = siteContent;
  const [name, setName] = useState(guest?.name ?? "");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const text = `Ucapan & Doa untuk ${rsvp.contactName}\n\nDari: ${name}\n"${message}"`;
    const whatsappHref = `https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappHref, "_blank", "noopener,noreferrer");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-2xl border border-white/70 bg-white/60 p-8 backdrop-blur-sm"
    >
      <p className="text-center text-sm text-ink-500">{ucapan.description}</p>

      <div>
        <label
          htmlFor="ucapan-name"
          className="text-xs tracking-[0.2em] text-ink-700 uppercase"
        >
          Nama
        </label>
        <input
          id="ucapan-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={ucapan.namePlaceholder}
          required
          className="mt-2 w-full rounded-lg border border-white/70 bg-white/70 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-blossom-400"
        />
      </div>

      <div>
        <label
          htmlFor="ucapan-message"
          className="text-xs tracking-[0.2em] text-ink-700 uppercase"
        >
          Ucapan &amp; Doa
        </label>
        <textarea
          id="ucapan-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={ucapan.messagePlaceholder}
          required
          rows={4}
          className="mt-2 w-full resize-none rounded-lg border border-white/70 bg-white/70 px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-blossom-400"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blossom-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blossom-600"
      >
        <Send className="h-4 w-4" />
        {ucapan.submitLabel}
      </button>
    </form>
  );
}
