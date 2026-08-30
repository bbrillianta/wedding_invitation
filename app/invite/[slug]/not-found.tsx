import Link from "next/link";
import { siteContent } from "@/lib/content";

export default function InviteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-ink-700 uppercase">
        Undangan tidak ditemukan
      </p>
      <h1 className="mt-4 font-serif-display text-3xl text-ink-900">
        Kami tidak dapat menemukan undangan tersebut
      </h1>
      <p className="mt-3 max-w-sm text-sm text-ink-500">
        Tautan yang Anda buka mungkin salah ketik. Silakan periksa kembali
        tautan yang kami kirimkan, atau kunjungi halaman undangan utama di
        bawah ini.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-blossom-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-blossom-600"
      >
        Lihat Undangan {siteContent.couple.brideName} &amp; {siteContent.couple.groomName}
      </Link>
    </main>
  );
}
