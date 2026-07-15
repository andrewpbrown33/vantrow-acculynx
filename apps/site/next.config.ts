import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The brand package is consumed as TypeScript source; let Next transpile it.
  transpilePackages: ["@vantrow/brand"],
};

export default nextConfig;
