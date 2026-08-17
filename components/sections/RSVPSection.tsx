import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RSVPContact } from "@/components/rsvp/RSVPContact";
import type { Guest } from "@/types";

export function RSVPSection({ guest }: { guest?: Guest | null }) {
  return (
    <section id="rsvp" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Kindly reply" title="RSVP" />
        <div className="mt-10">
          <RSVPContact guest={guest} />
        </div>
      </Container>
    </section>
  );
}
