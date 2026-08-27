import { siteContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function SiteFooter() {
  const { couple } = siteContent;
  return (
    <footer className="relative z-10 border-t border-gold-400/20 py-10 text-center">
      <Reveal y={16}>
        <p className="font-script text-2xl text-gold-300">{couple.monogram}</p>
      </Reveal>
      <Reveal y={16} delay={0.15}>
        <p className="mt-2 text-sm text-starlight-dim">
          With love, {couple.brideName} &amp; {couple.groomName}
        </p>
      </Reveal>
    </footer>
  );
}
