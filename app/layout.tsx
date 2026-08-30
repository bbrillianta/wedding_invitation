import type { Metadata } from "next";
import { Cormorant_Garamond, Parisienne, Jost } from "next/font/google";
import { StarfieldBackground } from "@/components/layout/StarfieldBackground";
import { siteContent } from "@/lib/content";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  // 700 added for the intro panel's bold eyebrow/subheading — without it
  // `font-bold` synthesizes a faux bold instead of using the real cut.
  weight: ["300", "400", "500", "600", "700"],
});

// Set NEXT_PUBLIC_SITE_URL once the site has a real domain (e.g. the
// GitHub Pages URL) so shared-link previews resolve absolute image URLs.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteContent.seo.title,
  description: siteContent.seo.description,
  openGraph: {
    title: siteContent.seo.title,
    description: siteContent.seo.description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.title,
    description: siteContent.seo.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${parisienne.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="relative min-h-full">
        <StarfieldBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
