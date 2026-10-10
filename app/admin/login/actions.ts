"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE, checkCredentials } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function adminLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  const token = checkCredentials(username, password);
  if (!token) {
    // A short pause makes guessing passwords by script slow.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { error: "Username atau password salah." };
  }

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });

  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
