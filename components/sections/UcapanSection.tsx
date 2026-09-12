import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UcapanDoa } from "@/components/rsvp/UcapanDoa";
import { UcapanWall } from "@/components/rsvp/UcapanWall";
import { Reveal } from "@/components/ui/Reveal";
import { getUcapanMessages } from "@/lib/ucapan";
import type { Guest } from "@/types";

export async function UcapanSection({
  guest,
  guestName,
}: {
  guest?: Guest | null;
  guestName?: string;
}) {
  const messages = await getUcapanMessages();

  return (
    <section id="ucapan" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Doa & Restu" title="Ucapan & Doa" />
        <Reveal className="mt-10" delay={0.2}>
          <UcapanDoa guest={guest} guestName={guestName} />
        </Reveal>
        <Reveal className="mt-8" delay={0.3}>
          <UcapanWall messages={messages} />
        </Reveal>
      </Container>
    </section>
  );
}
