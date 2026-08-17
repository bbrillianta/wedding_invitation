import { siteContent } from "@/lib/content";

export function SiteFooter() {
  const { couple } = siteContent;
  return (
    <footer className="relative z-10 border-t border-gold-400/20 py-10 text-center">
      <p className="font-script text-2xl text-gold-300">{couple.monogram}</p>
      <p className="mt-2 text-sm text-starlight-dim">
        With love, {couple.brideName} &amp; {couple.groomName}
      </p>
    </footer>
  );
}
