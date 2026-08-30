import Image from "next/image";
import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import type { Parents } from "@/types";

function ProfileCard({
  photo,
  name,
  role,
  parents,
  lineage,
  delay,
}: {
  photo: string;
  name: string;
  role: string;
  parents: Parents;
  lineage: "Putri" | "Putra";
  delay: number;
}) {
  return (
    <Reveal delay={delay} y={20} className="text-center">
      <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-2 border-blossom-400/60 sm:h-36 sm:w-36">
        <Image src={photo} alt={name} fill className="object-cover" sizes="144px" />
      </div>
      <p className="mt-4 text-xs tracking-[0.25em] text-ink-700 uppercase">{role}</p>
      <h3 className="mt-1 font-script text-3xl text-blossom-700 sm:text-4xl">{name}</h3>
      <p className="mt-3 max-w-xs mx-auto text-sm text-ink-500">
        {lineage} dari Bapak {parents.father} &amp; Ibu {parents.mother}
      </p>
    </Reveal>
  );
}

export function Mempelai() {
  const { couple } = siteContent;
  return (
    <section id="mempelai" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Kedua Mempelai" title="Mempelai" />
        <div className="mt-12 grid gap-10 sm:grid-cols-2">
          <ProfileCard
            photo={couple.groomPhoto}
            name={couple.groomFullName}
            role="Mempelai Pria"
            parents={couple.groomParents}
            lineage="Putra"
            delay={0.25}
          />
          <ProfileCard
            photo={couple.bridePhoto}
            name={couple.brideFullName}
            role="Mempelai Wanita"
            parents={couple.brideParents}
            lineage="Putri"
            delay={0.1}
          />
        </div>
      </Container>
    </section>
  );
}
