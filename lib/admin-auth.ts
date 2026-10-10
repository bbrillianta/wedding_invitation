import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * One shared login for the ushers, set by ADMIN_USERNAME / ADMIN_PASSWORD.
 * If either is unset, nobody can log in.
 *
 * The session cookie holds an HMAC of the username keyed with the
 * password: it can't be forged without the password, it needs no database
 * table, and changing the password logs every device out.
 */
export const ADMIN_COOKIE = "admin_session";

// Browsers cap cookie lifetimes at 400 days, which is "never expires" for
// a few weeks of RSVPs and one wedding day.
export const ADMIN_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

function credentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  return username && password ? { username, password } : null;
}

function sessionToken(): string | null {
  const creds = credentials();
  if (!creds) return null;
  return createHmac("sha256", creds.password).update(`wedding-admin:${creds.username}`).digest("hex");
}

// Constant-time string comparison, so response timing doesn't reveal how
// much of a guess was right. Hashing first gives both sides equal length.
function safeEqual(a: string, b: string) {
  const hash = (s: string) => createHmac("sha256", "compare").update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function checkCredentials(username: string, password: string): string | null {
  const creds = credentials();
  if (!creds) return null;
  // Evaluate both so a wrong username takes as long as a wrong password.
  const userOk = safeEqual(username, creds.username);
  const passOk = safeEqual(password, creds.password);
  return userOk && passOk ? sessionToken() : null;
}

export async function isAdmin(): Promise<boolean> {
  const expected = sessionToken();
  const actual = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(expected && actual && safeEqual(actual, expected));
}

/** For admin pages: send anyone without a valid session to the login page. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
