import type { NextConfig } from "next";

const wordpressUrlString =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:8080";

let wordpressHostname = "localhost";
let wordpressPort = "8080";

try {
  const wordpressOrigin = new URL(wordpressUrlString);
  wordpressHostname = wordpressOrigin.hostname;
  wordpressPort = wordpressOrigin.port || wordpressPort;
} catch {
  // Keep localhost fallback when env is invalid during build.
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cakes/:slug",
        destination: "/collections/cakes/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: wordpressHostname,
        port: wordpressPort,
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: wordpressHostname,
        port: wordpressPort,
        pathname: "/wp-content/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: wordpressPort,
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: wordpressPort,
        pathname: "/wp-content/**",
      },
    ],
  },
};

export default nextConfig;
