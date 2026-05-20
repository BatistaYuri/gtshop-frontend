import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.26"],
  async redirects() {
    return [
      {
        source: "/settings",
        destination: "/stock",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;