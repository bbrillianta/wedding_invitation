import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4a8ad4",
          borderRadius: "50%",
        }}
      >
        {/* Same four-pointed sparkle the sky uses (see ui/Sparkle.tsx);
            inlined because next/og renders this outside React DOM. */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
          <path d="M12 0C12.7 6.6 17.4 11.3 24 12c-6.6.7-11.3 5.4-12 12-.7-6.6-5.4-11.3-12-12C6.6 11.3 11.3 6.6 12 0z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
