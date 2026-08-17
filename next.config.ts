import type { NextConfig } from "next";

// When deployed as a GitHub Pages *project* page (username.github.io/repo-name),
// assets must be prefixed with the repo name. The deploy workflow sets this env
// var from the repo name automatically; it stays empty for local dev and for a
// user/org page or custom domain deployed at the site root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Phase 1: static export so the site can be hosted on GitHub Pages.
  // Phase 2 (adding the RSVP backend) will remove this, since server
  // actions/API routes require a Node server to run.
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath,
};

export default nextConfig;
