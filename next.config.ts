import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The floating dev badge sits on top of the generator sidebar; build errors still surface in the overlay.
  devIndicators: false,
};

export default nextConfig;
