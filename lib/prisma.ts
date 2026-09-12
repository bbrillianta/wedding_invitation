import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Turso (and local dev, via a `file:` URL) speak SQLite's dialect over
 * libSQL's wire protocol, which is why Prisma needs the libSQL driver
 * adapter here instead of its default SQLite driver — see the Phase 2
 * hosting note in the project plan for why (Vercel's serverless functions
 * have no persistent local disk, so a plain SQLite file can't be used
 * directly in production).
 */
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
