import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The webpack filesystem cache's large buffer (de)serialization OOMs on
  // low-free-memory machines. Disabling it trades a bit of rebuild speed for
  // a much smaller memory footprint.
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;
