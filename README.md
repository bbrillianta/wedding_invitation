# Amara & Kavi's Wedding Invitation

A wedding invitation site built with Next.js (App Router, TypeScript, Tailwind CSS), styled with an elegant celestial "star & galaxy" theme.

## Status: Phase 1 (static)

This is currently a **static site with no backend** — deployable anywhere that serves static files, including GitHub Pages. There is no RSVP database yet; the RSVP section links out to WhatsApp/phone/email instead of a form. Guest-specific invite links (`/invite/<slug>`) are pre-rendered at build time from a static list in [`lib/guests-data.ts`](lib/guests-data.ts).

Phase 2 (a database-backed RSVP form) will remove static export and require a Node-capable host — see the plan for details.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Try a personalized invite at `/invite/keluarga-budi` (see [`lib/guests-data.ts`](lib/guests-data.ts) for all seeded slugs).

## Editing content

All wedding content — couple names, date, venues, love story, gallery, gift info, RSVP contact — lives in **one file**: [`lib/content.ts`](lib/content.ts). Edit that file and every section updates; no other file needs to change. Placeholder images live in `public/images/*-placeholder.svg` — replace them with real photos of the same filenames, or update the paths in `lib/content.ts`.

## Building & deploying (GitHub Pages)

```bash
npm run build   # outputs static files to ./out
```

Push to `main` and the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes automatically — enable **Settings → Pages → Source: GitHub Actions** on the repo once. It auto-detects whether the repo is a project page (`/repo-name/` base path) or a user/org root page (`<username>.github.io`).

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) once the site has a real URL, so shared-link previews resolve image URLs correctly.

## Tech stack

- Next.js 16 (App Router, TypeScript, static export)
- Tailwind CSS v4
- `next/font` (Cormorant Garamond, Parisienne, Jost)
- `next/og` for the generated favicon and Open Graph image
