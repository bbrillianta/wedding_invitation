import { MapPin, Clock } from "lucide-react";
import { siteContent } from "@/lib/content";
import { formatDate, formatTime } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { EventDetail } from "@/types";

function EventCard({ event }: { event: EventDetail }) {
  return (
    <div className="rounded-2xl border border-gold-400/20 bg-midnight-900/60 p-6 backdrop-blur-sm sm:p-8">
      <h3 className="font-serif-display text-2xl text-gold-300">
        {event.name}
      </h3>

      <div className="mt-4 flex items-start gap-3 text-sm">
        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
        <p>
          {formatDate(event.dateTimeISO)}
          <br />
          {formatTime(event.dateTimeISO)} WIB
        </p>
      </div>

      <div className="mt-3 flex items-start gap-3 text-sm">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" aria-hidden="true" />
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
        className="mt-4 inline-block text-sm font-medium text-gold-400 underline decoration-gold-400/40 underline-offset-4 transition hover:text-gold-300"
      >
        View on map
      </a>

      <div className="mt-5 overflow-hidden rounded-xl border border-gold-400/10">
        <iframe
          src={event.mapEmbedUrl}
          title={`Map to ${event.venueName}`}
          loading="lazy"
          className="h-48 w-full grayscale invert-[0.9] contrast-[0.85]"
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
        <SectionHeading eyebrow="Save the date" title="Event Details" />
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
    </section>
  );
}
