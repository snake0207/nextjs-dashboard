import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    removeConsole: {
      exclude: ["error", "debug"],
    },
  },
};

export default nextConfig;
