import { customCakesPageDefaults } from "@/lib/config/custom-cakes";
import { getWordPressUrl } from "@/lib/woocommerce/client";
import { normalizeWordPressImageUrl } from "@/lib/wordpress/images";
import type {
  CustomCakeGalleryItem,
  CustomCakeHighlight,
  CustomCakeHighlightIcon,
  CustomCakeImage,
  CustomCakeOccasion,
  CustomCakesPageContent,
} from "@/types/custom-cakes";

const highlightIcons: CustomCakeHighlightIcon[] = [
  "cake",
  "badge",
  "heart",
  "chat",
];

const occasions: CustomCakeOccasion[] = [
  "all",
  "wedding",
  "birthday",
  "anniversary",
];

function resolveImage(
  image: CustomCakeImage | undefined,
  fallback: CustomCakeImage,
): CustomCakeImage {
  if (image?.src) {
    return {
      src: normalizeWordPressImageUrl(image.src),
      alt: image.alt || fallback.alt,
    };
  }

  return fallback;
}

function mergeHighlights(
  api: CustomCakeHighlight[] | undefined,
): CustomCakeHighlight[] {
  return customCakesPageDefaults.highlights.map((fallback, index) => {
    const item = api?.[index];
    const icon = highlightIcons.includes(item?.icon as CustomCakeHighlightIcon)
      ? (item?.icon as CustomCakeHighlightIcon)
      : fallback.icon;

    return {
      id: item?.id || fallback.id,
      icon,
      title: item?.title || fallback.title,
      description: item?.description || fallback.description,
    };
  });
}

function mergeGalleryItems(
  api: CustomCakeGalleryItem[] | undefined,
): CustomCakeGalleryItem[] {
  const items = api
    ?.filter((item) => Boolean(item.src))
    .map((item, index) => ({
      id: item.id || index + 1,
      src: normalizeWordPressImageUrl(item.src),
      alt: item.alt || "Custom cake",
      occasion: occasions.includes(item.occasion) ? item.occasion : "all",
    }));

  if (!items?.length) {
    return customCakesPageDefaults.gallery.items;
  }

  return items;
}

function mergeCustomCakesContent(
  api: Partial<CustomCakesPageContent> | null,
): CustomCakesPageContent {
  const fallback = customCakesPageDefaults;

  return {
    banner: {
      eyebrow: api?.banner?.eyebrow || fallback.banner.eyebrow,
      titleLead: api?.banner?.titleLead || fallback.banner.titleLead,
      titleAccent: api?.banner?.titleAccent || fallback.banner.titleAccent,
      description: api?.banner?.description || fallback.banner.description,
      ctaLabel: api?.banner?.ctaLabel || fallback.banner.ctaLabel,
      ctaUrl: api?.banner?.ctaUrl || fallback.banner.ctaUrl,
      image: resolveImage(api?.banner?.image, fallback.banner.image),
    },
    highlights: mergeHighlights(api?.highlights),
    gallery: {
      eyebrow: api?.gallery?.eyebrow || fallback.gallery.eyebrow,
      title: api?.gallery?.title || fallback.gallery.title,
      titleAccent: api?.gallery?.titleAccent || fallback.gallery.titleAccent,
      viewMoreLabel:
        api?.gallery?.viewMoreLabel || fallback.gallery.viewMoreLabel,
      emptyMessage: api?.gallery?.emptyMessage || fallback.gallery.emptyMessage,
      items: mergeGalleryItems(api?.gallery?.items),
    },
  };
}

export async function getCustomCakesContent(): Promise<CustomCakesPageContent> {
  const url = new URL("/wp-json/viola/v1/custom-cakes", getWordPressUrl());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Viola custom cakes API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as Partial<CustomCakesPageContent>;
    return mergeCustomCakesContent(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[wordpress] Falling back to custom cakes defaults:", error);
    }

    return mergeCustomCakesContent(null);
  }
}
