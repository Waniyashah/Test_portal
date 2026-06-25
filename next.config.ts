import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
