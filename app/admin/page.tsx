import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { getAdminGuests } from "@/lib/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { adminLogout } from "@/app/admin/login/actions";
import { AdminGuestList } from "@/components/admin/AdminGuestList";

// Reads the live guest list on every request; a static build would freeze
// check-ins at whatever the database held at build time.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Check-in Tamu",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requireAdmin();
  const guests = await getAdminGuests();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 sm:px-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-ink-700 uppercase">Hari H</p>
          <h1 className="mt-1 font-serif-display text-3xl font-semibold text-ink-900">
            Check-in Tamu
          </h1>
        </div>
        <form action={adminLogout}>
          <button
            type="submit"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white/70 px-4 text-sm font-medium text-ink-700 ring-1 ring-sky-400 transition hover:bg-white"
          >
            <LogOut className="size-4" aria-hidden />
            Keluar
          </button>
        </form>
      </header>
      <AdminGuestList guests={guests} />
    </main>
  );
}
