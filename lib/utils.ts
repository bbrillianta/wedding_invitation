import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefixes a root-relative static asset path with the configured GitHub
 * Pages base path (see next.config.ts). `next/image` does this
 * automatically for any src it renders, which is why the SVG placeholders
 * referenced from lib/content.ts don't need it — but there's no such
 * built-in for plain HTML tags like <audio>, so anything reaching a
 * public/ file outside of <Image> needs to go through this explicitly or
 * it 404s on a project page (username.github.io/repo-name/...).
 */
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatDate(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(isoDate));
}

export function formatTime(
  isoDate: string,
  options: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" }
): string {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(isoDate));
}
