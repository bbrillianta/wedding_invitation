import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UcapanDoa } from "@/components/rsvp/UcapanDoa";
import { Reveal } from "@/components/ui/Reveal";
import type { Guest } from "@/types";

export function UcapanSection({ guest }: { guest?: Guest | null }) {
  return (
    <section id="ucapan" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Doa & Restu" title="Ucapan & Doa" />
        <Reveal className="mt-10" delay={0.2}>
          <UcapanDoa guest={guest} />
        </Reveal>
      </Container>
    </section>
  );
}
