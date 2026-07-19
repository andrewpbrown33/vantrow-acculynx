import { ImageResponse } from "next/og";
import { brand } from "@vantrow/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon: the "Sheltered Dot" mark (light variant — the default)
 * on brand paper. iOS applies its own corner rounding, so the tile is
 * full-bleed. Geometry mirrors LogoMark in @vantrow/brand.
 */
export default function AppleIcon() {
  const c = brand.colors;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.background,
        }}
      >
        <svg viewBox="0 0 100 100" width={132} height={132}>
          <path
            d="M24 66 L50 30 L76 66"
            fill="none"
            stroke={c.primary}
            strokeWidth={13}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={50} cy={62} r={10.5} fill={c.accent} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
