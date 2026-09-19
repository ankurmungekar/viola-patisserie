import path from "node:path";
import { fileURLToPath } from "node:url";

const wordpressUrlString =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:8080";

let wordpressHostname = "localhost";
let wordpressPort = "8080";

try {
  const wordpressOrigin = new URL(wordpressUrlString);
  wordpressHostname = wordpressOrigin.hostname;
  // Default https/http ports are empty strings. Do not fall back to 8080 —
  // that makes Next/Image reject live URLs like https://shop.violapatisserie.in.
  wordpressPort = wordpressOrigin.port;
} catch {
  // Keep localhost fallback when env is invalid during build.
}

function wpContentPattern(protocol, hostname, port) {
  /** @type {{ protocol: string, hostname: string, pathname: string, port?: string }} */
  const pattern = {
    protocol,
    hostname,
    pathname: "/wp-content/**",
  };

  if (port) {
    pattern.port = port;
  }

  return pattern;
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
    // Hostinger's glibc cannot run Next's native image optimizer (sharp).
    // Serve WordPress media URLs directly in production.
    unoptimized: process.env.NODE_ENV === "production",
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      wpContentPattern("http", wordpressHostname, wordpressPort),
      wpContentPattern("https", wordpressHostname, wordpressPort),
      wpContentPattern("http", "127.0.0.1", wordpressPort),
      wpContentPattern("https", "127.0.0.1", wordpressPort),
    ],
  },
};

export default nextConfig;
