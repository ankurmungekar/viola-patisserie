import { collectionBannerDefaults } from "@/lib/config/collection-banner-defaults";
import { normalizeWordPressImageUrl } from "@/lib/wordpress/images";
import { getWordPressUrl } from "@/lib/woocommerce/client";
import type { PromoBannerContent, PromoBannerImage } from "@/types/promo-banner";

function resolveImage(
  image: PromoBannerImage | undefined,
  fallback: PromoBannerImage,
): PromoBannerImage {
  if (image?.src) {
    return {
      src: normalizeWordPressImageUrl(image.src),
      alt: image.alt || fallback.alt,
    };
  }

  return fallback;
}

function mergeBannerContent(
  api: Partial<PromoBannerContent> | null,
): PromoBannerContent {
  const fallback = collectionBannerDefaults;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    titlePrefix: api?.titlePrefix || fallback.titlePrefix,
    titleAccent: api?.titleAccent || fallback.titleAccent,
    ctaLabel: api?.ctaLabel || fallback.ctaLabel,
    ctaUrl: api?.ctaUrl || fallback.ctaUrl,
    image: resolveImage(api?.image, fallback.image),
    insertAfterRow: api?.insertAfterRow ?? fallback.insertAfterRow,
  };
}

export async function getCollectionBannerContent(): Promise<PromoBannerContent> {
  const url = new URL("/wp-json/viola/v1/collection-banner", getWordPressUrl());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Viola collection banner API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as Partial<PromoBannerContent>;
    return mergeBannerContent(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[wordpress] Falling back to collection banner defaults:", error);
    }

    return mergeBannerContent(null);
  }
}
