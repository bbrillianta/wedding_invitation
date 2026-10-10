import { randomInt } from "node:crypto";
import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Imports the couple's guest list from a CSV (default data/guests.csv,
 * gitignored because the codes in it are the invitation links).
 *
 * Columns: code, name, side, groupLabel, link. Only name
 * is required. A row without a code gets a new one, written back into the
 * file *before* the database is touched, so re-running never duplicates a
 * guest. Rows are matched by code, never by name, since names repeat.
 * `link` is output only: the full /?id=<code> URL to send to that guest.
 * Any other columns are kept as they are.
 *
 *   node --env-file=.env ./node_modules/.bin/tsx prisma/seed.ts [file.csv]
 */

try {
  process.loadEnvFile();
} catch {
  // No .env: DATABASE_URL and friends are set on the command line.
}

const CSV_PATH = process.argv[2] ?? "data/guests.csv";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://wedding-invitation-psi-tawny.vercel.app").replace(/\/$/, "");
const COLUMNS = ["code", "name", "side", "groupLabel", "link"];
// No 0/o, 1/i/l: codes may be read aloud or retyped from a screenshot.
const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const CODE_LENGTH = 8;

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

type Row = Record<string, string>;

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  text = text.replace(/^﻿/, "");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((value) => value.trim()));
}

function toCsv(header: string[], rows: Row[]): string {
  const cell = (value: string) => (/[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
  return [header, ...rows.map((row) => header.map((column) => row[column] ?? ""))]
    .map((values) => values.map(cell).join(","))
    .join("\n") + "\n";
}

function newCode(taken: Set<string>): string {
  for (;;) {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
    if (!taken.has(code)) {
      taken.add(code);
      return code;
    }
  }
}

async function main() {
  const [header, ...records] = parseCsv(readFileSync(CSV_PATH, "utf8"));
  if (!header?.includes("name")) throw new Error(`${CSV_PATH} needs a "name" column.`);

  const rows: Row[] = records.map((values) =>
    Object.fromEntries(header.map((column, i) => [column, (values[i] ?? "").trim()]))
  );

  // Check the whole file before writing anything.
  const problems: string[] = [];
  const seen = new Set<string>();
  rows.forEach((row, i) => {
    const line = i + 2;
    if (!row.name) problems.push(`line ${line}: name is empty`);
    if (row.code) {
      if (seen.has(row.code)) problems.push(`line ${line}: code ${row.code} appears twice`);
      seen.add(row.code);
    }
  });
  if (problems.length) throw new Error(`Nothing imported:\n  ${problems.join("\n  ")}`);

  const existing = await prisma.guest.findMany({ select: { code: true, name: true } });
  const taken = new Set([...seen, ...existing.map((guest) => guest.code)]);
  let added = 0;
  for (const row of rows) {
    if (!row.code) {
      row.code = newCode(taken);
      added++;
    }
    row.link = `${SITE_URL}/?id=${row.code}`;
  }

  // Codes go back into the file first: if the import fails halfway, the
  // next run finds them and updates instead of creating the guests again.
  const outHeader = [...COLUMNS, ...header.filter((column) => !COLUMNS.includes(column))];
  writeFileSync(`${CSV_PATH}.tmp`, toCsv(outHeader, rows));
  renameSync(`${CSV_PATH}.tmp`, CSV_PATH);

  for (const row of rows) {
    const data = {
      name: row.name,
      side: row.side || null,
      groupLabel: row.groupLabel || null,
    };
    await prisma.guest.upsert({ where: { code: row.code }, update: data, create: { code: row.code, ...data } });
  }

  console.log(`Imported ${rows.length} guests from ${CSV_PATH} (${added} new codes). Links are in its "link" column.`);

  const listed = new Set(rows.map((row) => row.code));
  const unlisted = existing.filter((guest) => !listed.has(guest.code));
  if (unlisted.length) {
    console.log(`\n${unlisted.length} guests in the database aren't in the CSV (left as they are):`);
    for (const guest of unlisted) console.log(`  ${guest.code}  ${guest.name}`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
