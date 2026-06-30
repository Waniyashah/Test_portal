import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/t/:testId',
        destination: '/test/:testId',
      },
    ]
  },
};

export default nextConfig;
