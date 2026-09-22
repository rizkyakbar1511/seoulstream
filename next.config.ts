import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [process.env.LOCAL_DEV_ALLOWED!],
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // This wildcard allows all hostnames
      },
      {
        protocol: "http",
        hostname: "**", // This wildcard allows all hostnames
      },
    ],
  },
};

export default nextConfig;
