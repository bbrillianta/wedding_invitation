import { WeddingInvitation } from "@/components/WeddingInvitation";

// UcapanSection reads live DB data (the guestbook wall) and this page now
// reads searchParams for `?name=` gating below — both mean the page can't
// be statically prerendered at build time. /invite/[slug] doesn't need
// this: it's already server-rendered per request since it has no
// generateStaticParams.
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawName = params.name;
  const guestName = (Array.isArray(rawName) ? rawName[0] : rawName)?.trim();

  // This generic route has no guest list behind it (that's what
  // /invite/[slug] is for), so a `?name=` link — shared directly by the
  // couple — is the only thing gating it. No name, no access.
  if (!guestName) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <div className="max-w-sm rounded-2xl border border-white/70 bg-white/60 p-8 backdrop-blur-sm">
          <p className="text-xs tracking-[0.3em] text-ink-700 uppercase">
            Undangan Pribadi
          </p>
          <h1 className="mt-3 font-serif-display text-2xl font-semibold text-ink-900">
            Tautan Tidak Lengkap
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

  return <WeddingInvitation guestName={guestName} />;
}
