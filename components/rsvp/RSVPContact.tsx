import { MessageCircle, Phone, Mail } from "lucide-react";
import { siteContent } from "@/lib/content";
import { formatDate } from "@/lib/utils";
import type { Guest } from "@/types";

/**
 * Phase 1 stand-in for the RSVP form: there's no backend yet to store
 * a submission, so guests are pointed to a direct WhatsApp/phone/email
 * contact instead of a form that would silently go nowhere. Swapped
 * for a real <RSVPForm> once the database-backed RSVP flow ships.
 */
export function RSVPContact({ guest }: { guest?: Guest | null }) {
  const { rsvp } = siteContent;
  const greeting = guest?.groupLabel ?? guest?.name;

  const message = greeting
    ? `Hi ${rsvp.contactName}! This is ${greeting}. I'd like to RSVP for the wedding.`
    : `Hi ${rsvp.contactName}! I'd like to RSVP for the wedding.`;

  const whatsappHref = `https://wa.me/${rsvp.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gold-400/20 bg-midnight-900/60 p-8 text-center backdrop-blur-sm">
      <p className="text-sm text-starlight-dim">
        Online RSVP is coming soon. For now, please reach out to us directly
        — we&apos;d love to hear from you before{" "}
        <span className="text-gold-300">{formatDate(rsvp.deadlineISO)}</span>.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-midnight-950 transition hover:bg-gold-300"
        >
          <MessageCircle className="h-4 w-4" />
          RSVP via WhatsApp
        </a>

        <a
          href={`tel:${rsvp.contactPhone.replace(/\s|-/g, "")}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/40 px-6 py-3 text-sm font-medium text-starlight transition hover:bg-gold-400/10"
        >
          <Phone className="h-4 w-4" />
          {rsvp.contactPhone}
        </a>

        <a
          href={`mailto:${rsvp.contactEmail}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-400/40 px-6 py-3 text-sm font-medium text-starlight transition hover:bg-gold-400/10"
        >
          <Mail className="h-4 w-4" />
          {rsvp.contactEmail}
        </a>
      </div>
    </div>
  );
}
