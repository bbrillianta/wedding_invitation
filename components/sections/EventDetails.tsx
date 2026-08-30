import { MapPin, Clock } from "lucide-react";
import { siteContent } from "@/lib/content";
import { formatDate, formatTime } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { EventDetail } from "@/types";

function EventCard({ event }: { event: EventDetail }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/60 p-6 backdrop-blur-sm sm:p-8">
      <h3 className="font-serif-display text-2xl text-blossom-700">
        {event.name}
      </h3>

      <div className="mt-4 flex items-start gap-3 text-sm">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-ink-700" aria-hidden="true" />
        <p>
          {formatDate(event.dateTimeISO)}
          <br />
          {formatTime(event.dateTimeISO)} WIB
        </p>
      </div>

      <div className="mt-3 flex items-start gap-3 text-sm">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-700" aria-hidden="true" />
        <p>
          {event.venueName}
          <br />
          {event.address}
        </p>
      </div>

      <a
        href={event.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm font-medium text-ink-700 underline decoration-ink-700/40 underline-offset-4 transition hover:text-blossom-700"
      >
        Lihat di Peta
      </a>

      <div className="mt-5 overflow-hidden rounded-xl border border-white/70">
        <iframe
          src={event.mapEmbedUrl}
          title={`Map to ${event.venueName}`}
          loading="lazy"
          className="h-48 w-full saturate-[0.85] contrast-[0.95]"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export function EventDetails() {
  const { events } = siteContent;
  return (
    <section id="event-details" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Save The Date" title="Acara" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Akad lands first, Resepsi a beat later — same order they
              happen in, and it keeps the pair from popping as one block. */}
          <Reveal delay={0.1}>
            <EventCard event={events.ceremony} />
          </Reveal>
          <Reveal delay={0.25}>
            <EventCard event={events.reception} />
          </Reveal>
        </div>
      </Container>

      {/* Marks where the Resepsi card ends, on mobile's single-column
          stack and desktop's side-by-side grid alike — <RSVPStickyBar>
          watches this to know when the guest has actually reached the
          event details, not just the top of this section. */}
      <div id="acara-end" aria-hidden="true" />
    </section>
  );
}
