import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="text-center">
      {/* Eyebrow then title, a beat apart, so each section announces
          itself rather than the whole block appearing at once. */}
      <Reveal y={16}>
        <p className="text-xs tracking-[0.3em] text-gold-400 uppercase">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal y={20} delay={0.12}>
        <h2
          id={id}
          className="mt-3 font-serif-display text-3xl font-semibold text-starlight sm:text-4xl"
        >
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
