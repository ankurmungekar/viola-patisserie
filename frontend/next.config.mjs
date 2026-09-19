import path from "node:path";
import { fileURLToPath } from "node:url";

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

const configDir = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger's parent folders can contain extra lockfiles; pin tracing to this app.
  outputFileTracingRoot: configDir,
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
