import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RSVPContact } from "@/components/rsvp/RSVPContact";
import { Reveal } from "@/components/ui/Reveal";
import type { Guest } from "@/types";

export function RSVPSection({ guest }: { guest?: Guest | null }) {
  return (
    <section id="rsvp" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Kindly reply" title="RSVP" />
        <Reveal className="mt-10" delay={0.2}>
          <RSVPContact guest={guest} />
        </Reveal>
      </Container>
    </section>
  );
}
