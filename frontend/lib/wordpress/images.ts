import { getWordPressUrl } from "@/lib/woocommerce/client";

function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function normalizeWordPressImageUrl(src: string): string {
  if (!src) {
    return src;
  }

  const wpOrigin = new URL(getWordPressUrl());

  if (src.startsWith("/")) {
    if (src.startsWith("/wp-content/")) {
      return new URL(src, wpOrigin.origin).toString();
    }

    return src;
  }

  try {
    const parsed = new URL(src);
    const isMediaPath = parsed.pathname.includes("/wp-content/");
    const shouldRewrite =
      isLocalHostname(parsed.hostname) ||
      (isMediaPath && parsed.origin !== wpOrigin.origin);

    if (!shouldRewrite) {
      return src;
    }

    return new URL(`${parsed.pathname}${parsed.search}${parsed.hash}`, wpOrigin.origin).toString();
  } catch {
    return src;
  }
}
