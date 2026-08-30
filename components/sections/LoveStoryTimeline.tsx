import Image from "next/image";
import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function LoveStoryTimeline() {
  const { loveStory } = siteContent;
  return (
    <section id="love-story" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Perjalanan Kami" title="Kisah Cinta" />

        <ol className="mt-14 space-y-14">
          {loveStory.map((milestone, i) => (
            // `as="li"` keeps the animated element inside the <ol> a real
            // list item, and its position among its siblings unchanged —
            // the `even:` row-reversal below still alternates correctly.
            // Each milestone drifts in from the side its photo sits on.
            <Reveal
              as="li"
              key={milestone.title}
              className="flex flex-col items-center gap-6 sm:flex-row sm:even:flex-row-reverse"
              x={i % 2 === 0 ? -28 : 28}
              y={16}
              duration={0.8}
            >
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full border-2 border-blossom-400/60">
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <div className="text-center sm:text-left sm:even:text-right">
                <p className="text-xs tracking-[0.25em] text-ink-700 uppercase">
                  {milestone.dateLabel} &middot; {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-serif-display text-xl text-ink-900">
                  {milestone.title}
                </h3>
                <p className="mt-2 max-w-md text-sm text-ink-500">
                  {milestone.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
