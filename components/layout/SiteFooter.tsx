import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function SiteFooter() {
  const { couple } = siteContent;
  return (
    <footer className="relative z-10 py-10 text-center">
      <div className="mx-auto mb-8 h-px w-40 bg-white/70" />
      <Reveal y={16}>
        <p className="font-script text-2xl text-blossom-700">{couple.monogram}</p>
      </Reveal>
      <Reveal y={16} delay={0.15}>
        <p className="mt-2 text-sm text-ink-500">
          With love, {couple.brideName} &amp; {couple.groomName}
        </p>
      </Reveal>
    </footer>
  );
}
