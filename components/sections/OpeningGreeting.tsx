import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function OpeningGreeting() {
  const { greeting } = siteContent;
  return (
    <section id="opening-greeting" className="py-16 sm:py-24">
      <Container className="max-w-xl text-center">
        <Reveal>
          <p
            dir="rtl"
            lang="ar"
            className="font-serif-display text-xl text-blossom-700 sm:text-2xl"
          >
            {greeting.bismillah}
          </p>
        </Reveal>

        <Reveal delay={0.15} y={16}>
          <p className="mt-5 text-sm tracking-[0.1em] text-ink-700 sm:text-base">
            {greeting.salam}
          </p>
        </Reveal>

        <Reveal delay={0.3} y={16}>
          <div className="mt-10 rounded-2xl border border-white/70 bg-white/55 p-6 backdrop-blur-sm sm:p-8">
            <p dir="rtl" lang="ar" className="font-serif-display text-lg leading-loose text-ink-900 sm:text-xl">
              {greeting.verseArabic}
            </p>
            <p className="mt-4 text-sm text-ink-500 italic">
              {greeting.verseTranslationId}
            </p>
            <p className="mt-3 text-xs tracking-[0.2em] text-blossom-700 uppercase">
              {greeting.verseReference}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
