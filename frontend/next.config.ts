import type { NextConfig } from "next";

const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:8080";

let wordpressHostname = "localhost";
try {
  wordpressHostname = new URL(wordpressUrl).hostname;
} catch {
  // Keep localhost fallback when env is invalid during build.
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: wordpressHostname,
      },
      {
        protocol: "https",
        hostname: wordpressHostname,
      },
    ],
  },
};

export default nextConfig;
