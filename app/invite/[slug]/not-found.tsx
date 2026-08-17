import Link from "next/link";
import { siteContent } from "@/lib/content";

export default function InviteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-gold-400 uppercase">
        Invitation not found
      </p>
      <h1 className="mt-4 font-serif-display text-3xl text-starlight">
        We couldn&apos;t find that invitation
      </h1>
      <p className="mt-3 max-w-sm text-sm text-starlight-dim">
        The link you followed may be mistyped. Please check the link we sent
        you, or visit the main invitation page below.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-400 px-6 py-3 text-sm font-medium text-midnight-950 transition hover:bg-gold-300"
      >
        View {siteContent.couple.brideName} &amp; {siteContent.couple.groomName}&apos;s Invitation
      </Link>
    </main>
  );
}
