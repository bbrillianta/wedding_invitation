import { defineConfig, env } from "prisma/config";

// Prisma 7's config loader deliberately does not auto-load .env (unlike
// pre-7 schema.prisma), so it has to happen explicitly before `env()`
// below resolves DATABASE_URL.
try {
  process.loadEnvFile();
} catch {
  // No .env file (e.g. Vercel, where env vars are injected directly) — fine.
}

// Prisma 7 moved the datasource URL for CLI commands (migrate, studio, db
// seed) out of schema.prisma and in here. The PrismaClient runtime itself
// never reads this — it connects through the libSQL driver adapter in
// lib/prisma.ts instead, since Turso (production) and even local `file:`
// URLs go through that adapter rather than Prisma's default SQLite driver.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
