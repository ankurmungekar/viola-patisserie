import { aboutDefaults } from "@/lib/config/about-defaults";
import { normalizeWordPressImageUrl } from "@/lib/wordpress/images";
import { getWordPressUrl } from "@/lib/woocommerce/client";
import type {
  AboutContent,
  AboutFounderContent,
  AboutHighlightContent,
  AboutImage,
  AboutStoryContent,
} from "@/types/about";

function resolveImage(
  image: AboutImage | undefined,
  fallback: AboutImage,
): AboutImage {
  if (image?.src) {
    return {
      src: normalizeWordPressImageUrl(image.src),
      alt: image.alt || fallback.alt,
    };
  }

  return fallback;
}

function mergeStory(api: Partial<AboutStoryContent> | undefined): AboutStoryContent {
  const fallback = aboutDefaults.story;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    titleLine1: api?.titleLine1 || fallback.titleLine1,
    titleAccent: api?.titleAccent || fallback.titleAccent,
    paragraphs:
      api?.paragraphs?.filter(Boolean).length
        ? api.paragraphs
        : fallback.paragraphs,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeHighlight(
  api: Partial<AboutHighlightContent> | undefined,
): AboutHighlightContent {
  const fallback = aboutDefaults.highlight;

  return {
    paragraphs:
      api?.paragraphs?.filter(Boolean).length
        ? api.paragraphs
        : fallback.paragraphs,
    statValue: api?.statValue || fallback.statValue,
    statLabel: api?.statLabel || fallback.statLabel,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeFounder(
  api: Partial<AboutFounderContent> | undefined,
): AboutFounderContent {
  const fallback = aboutDefaults.founder;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    titleLine1: api?.titleLine1 || fallback.titleLine1,
    titleAccent: api?.titleAccent || fallback.titleAccent,
    paragraphs:
      api?.paragraphs?.filter(Boolean).length
        ? api.paragraphs
        : fallback.paragraphs,
    signature: api?.signature || fallback.signature,
    signatureTitle: api?.signatureTitle || fallback.signatureTitle,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeAboutContent(api: Partial<AboutContent> | null): AboutContent {
  return {
    story: mergeStory(api?.story),
    highlight: mergeHighlight(api?.highlight),
    founder: mergeFounder(api?.founder),
  };
}

export async function getAboutContent(): Promise<AboutContent> {
  const url = new URL("/wp-json/viola/v1/about", getWordPressUrl());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Viola about API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as Partial<AboutContent>;
    return mergeAboutContent(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[wordpress] Falling back to about defaults:", error);
    }

    return mergeAboutContent(null);
  }
}
