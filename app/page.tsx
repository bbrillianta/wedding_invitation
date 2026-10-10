import { cache } from "react";
import type { Metadata } from "next";
import { getGuestByCode } from "@/lib/guests";
import { siteContent } from "@/lib/content";
import { WeddingInvitation } from "@/components/WeddingInvitation";

// The page depends on the `?id=` in each request and on the live guestbook,
// so it can't be prerendered at build time.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// generateMetadata and the page both need the guest; cache() makes it one query.
const getGuest = cache(getGuestByCode);

async function guestFromParams(searchParams: SearchParams) {
  const { id } = await searchParams;
  return getGuest(Array.isArray(id) ? id[0] : id);
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const guest = await guestFromParams(searchParams);
  const name = guest?.groupLabel ?? guest?.name;
  const title = name
    ? `Anda diundang, ${name}! — ${siteContent.seo.title}`
    : siteContent.seo.title;

  return {
    title,
    description: siteContent.seo.description,
    openGraph: { title, description: siteContent.seo.description },
  };
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const guest = await guestFromParams(searchParams);

  // Only the couple's listed guests have a code, so a missing, blank or
  // unknown `?id=` isn't one of their invitations. Nothing is written.
  if (!guest) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <div className="max-w-sm rounded-2xl border border-white/70 bg-white/60 p-8 backdrop-blur-sm">
          <p className="text-xs tracking-[0.3em] text-ink-700 uppercase">
            Undangan Pribadi
          </p>
          <h1 className="mt-3 font-serif-display text-2xl font-semibold text-ink-900">
            Undangan Tidak Ditemukan
          </h1>
          <p className="mt-4 text-sm text-ink-500">
            Halaman ini hanya dapat diakses melalui tautan undangan yang
            telah dibagikan kepada Anda. Silakan periksa kembali tautan
            pada pesan undangan Anda.
          </p>
        </div>
      </main>
    );
  }

  return <WeddingInvitation guest={guest} />;
}
