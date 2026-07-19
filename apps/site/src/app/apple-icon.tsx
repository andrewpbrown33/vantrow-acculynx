import { ImageResponse } from "next/og";
import { brand } from "@vantrow/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon: the placeholder dot-tile (iOS applies its own corner
 * rounding, so the tile is full-bleed). Mirrors src/app/icon.svg.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: brand.colors.primary,
        }}
      >
        <div
          style={{
            width: 62,
            height: 62,
            borderRadius: 9999,
            backgroundColor: brand.colors.accent,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
