import { ImageResponse } from "next/og";
import { brand, splitWordmark } from "@vantrow/brand";

export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social share card: the two-tone lowercase wordmark on brand paper, with the
 * tagline and parent endorsement. Rendered with next/og's bundled default
 * font (satori can't consume the app's woff2), so it deliberately leans on
 * the palette rather than the typeface for brand feel.
 */
export default function OgImage() {
  const { prefix, suffix } = splitWordmark(brand);
  const c = brand.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 96px",
          backgroundColor: c.background,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 148,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: c.primaryDark,
          }}
        >
          {prefix.toLowerCase()}
          {suffix !== null && (
            <span style={{ color: c.accent }}>{suffix.toLowerCase()}</span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            color: c.muted,
          }}
        >
          {brand.tagline}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 72,
            fontSize: 28,
            color: c.accentInk,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              marginRight: 14,
              borderRadius: 9999,
              backgroundColor: c.accent,
            }}
          />
          {brand.endorsement}
        </div>
      </div>
    ),
    { ...size },
  );
}
