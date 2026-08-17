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
      <p className="text-xs tracking-[0.3em] text-gold-400 uppercase">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-serif-display text-3xl font-semibold text-starlight sm:text-4xl"
      >
        {title}
      </h2>
    </div>
  );
}
