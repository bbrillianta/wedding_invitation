"use client";

import { useActionState, useState } from "react";
import { Loader2, LogIn } from "lucide-react";
import { adminLogin, type LoginState } from "@/app/admin/login/actions";

const field =
  "mt-1.5 h-12 w-full rounded-2xl border border-sky-400 bg-white px-4 text-base text-ink-900 transition focus:border-ink-700";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(adminLogin, {});
  // Controlled so a wrong password doesn't also wipe the username: React
  // resets uncontrolled fields after every form action.
  const [username, setUsername] = useState("");

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-ink-900">
        Username
        <input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={field}
        />
      </label>
      <label className="block text-sm font-medium text-ink-900">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={field} />
      </label>

      {state.error && (
        <p role="alert" className="text-sm text-blossom-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-blossom-600 text-base font-medium text-white shadow-sm transition hover:bg-blossom-700 disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <LogIn className="size-5" aria-hidden />}
        Masuk
      </button>
    </form>
  );
}
