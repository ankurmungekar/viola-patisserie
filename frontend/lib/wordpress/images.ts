import { getWordPressUrl } from "@/lib/woocommerce/client";

export function normalizeWordPressImageUrl(src: string): string {
  if (!src || src.startsWith("/")) {
    return src;
  }

  try {
    const parsed = new URL(src);
    const wpOrigin = new URL(getWordPressUrl());

    if (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1"
    ) {
      parsed.hostname = wpOrigin.hostname;

      if (wpOrigin.port) {
        parsed.port = wpOrigin.port;
      } else {
        parsed.port = "";
      }
    }

    return parsed.toString();
  } catch {
    return src;
  }
}
