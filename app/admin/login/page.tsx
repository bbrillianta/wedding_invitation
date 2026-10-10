import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already logged in on this device: go straight to the list.
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sky-400/60 sm:p-8">
        <p className="text-xs tracking-[0.3em] text-ink-700 uppercase">Hari H</p>
        <h1 className="mt-1 font-serif-display text-3xl font-semibold text-ink-900">Login Admin</h1>
        <AdminLoginForm />
      </div>
    </main>
  );
}
