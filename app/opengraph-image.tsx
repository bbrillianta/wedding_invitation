import { ImageResponse } from "next/og";
import { siteContent } from "@/lib/content";

export const dynamic = "force-static";
export const alt = siteContent.seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { couple } = siteContent;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 0%, #1c2547 0%, #05070f 65%)",
          color: "#f5f0e6",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#d4af7a",
          }}
        >
          We&apos;re getting married
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 120,
            marginTop: 24,
            color: "#f3e0b3",
          }}
        >
          {couple.brideName} &amp; {couple.groomName}
        </div>
      </div>
    ),
    { ...size }
  );
}
