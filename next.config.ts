import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import path from "path";

// Initialize Cloudflare local platform to resolve D1 bindings during local development
if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, './'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev', // R2 public domain fallback or generic matching
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
};

export default nextConfig;
