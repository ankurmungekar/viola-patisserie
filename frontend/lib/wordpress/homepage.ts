import { homepageDefaults } from "@/lib/config/homepage-defaults";
import { normalizeWordPressImageUrl } from "@/lib/wordpress/images";
import { siteConfig } from "@/lib/config/site";
import { getWordPressUrl } from "@/lib/woocommerce/client";
import type {
  CustomCakesContent,
  HeroContent,
  HomepageContent,
  HomepageImage,
  InstagramContent,
  OurStoryContent,
  SiteContent,
  ValuePropContent,
} from "@/types/homepage";

function resolveImage(
  image: HomepageImage | undefined,
  fallback: HomepageImage,
): HomepageImage {
  if (image?.src) {
    return {
      src: normalizeWordPressImageUrl(image.src),
      alt: image.alt || fallback.alt,
    };
  }

  return fallback;
}

function mergeHero(api: Partial<HeroContent> | undefined): HeroContent {
  const fallback = homepageDefaults.hero;

  return {
    eyebrowTags:
      api?.eyebrowTags?.length ? api.eyebrowTags : fallback.eyebrowTags,
    titleLine1: api?.titleLine1 || fallback.titleLine1,
    titleLine2: api?.titleLine2 || fallback.titleLine2,
    description: api?.description || fallback.description,
    ctaLabel: api?.ctaLabel || fallback.ctaLabel,
    ctaUrl: api?.ctaUrl || fallback.ctaUrl,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeOurStory(
  api: Partial<OurStoryContent> | undefined,
): OurStoryContent {
  const fallback = homepageDefaults.ourStory;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    titleDark: api?.titleDark || fallback.titleDark,
    titleAccent: api?.titleAccent || fallback.titleAccent,
    paragraphs:
      api?.paragraphs?.filter(Boolean).length
        ? api.paragraphs
        : fallback.paragraphs,
    signature: api?.signature || fallback.signature,
    signatureTitle: api?.signatureTitle || fallback.signatureTitle,
    ctaLabel: api?.ctaLabel || fallback.ctaLabel,
    ctaUrl: api?.ctaUrl || fallback.ctaUrl,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeValueProps(
  api: ValuePropContent[] | undefined,
): ValuePropContent[] {
  if (!api?.length) {
    return homepageDefaults.valueProps;
  }

  return api.map((item, index) => {
    const fallback = homepageDefaults.valueProps[index] ?? homepageDefaults.valueProps[0];

    return {
      icon: item.icon || fallback.icon,
      title: item.title || fallback.title,
      description: item.description || fallback.description,
    };
  });
}

function mergeCustomCakes(
  api: Partial<CustomCakesContent> | undefined,
): CustomCakesContent {
  const fallback = homepageDefaults.customCakes;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    titleDark: api?.titleDark || fallback.titleDark,
    titleAccent: api?.titleAccent || fallback.titleAccent,
    description: api?.description || fallback.description,
    ctaLabel: api?.ctaLabel || fallback.ctaLabel,
    ctaUrl: api?.ctaUrl || fallback.ctaUrl,
    image: resolveImage(api?.image, fallback.image),
  };
}

function mergeInstagram(
  api: Partial<InstagramContent> | undefined,
): InstagramContent {
  const fallback = homepageDefaults.instagram;

  return {
    eyebrow: api?.eyebrow || fallback.eyebrow,
    handle: api?.handle || fallback.handle,
    description: api?.description || fallback.description,
    ctaLabel: api?.ctaLabel || fallback.ctaLabel,
    ctaUrl: api?.ctaUrl || fallback.ctaUrl,
    posts:
      api?.posts?.length
        ? api.posts.map((post, index) => {
            const fallbackPost = fallback.posts[index] ?? fallback.posts[0];

            return {
              id: post.id || fallbackPost.id,
              views: post.views || fallbackPost.views,
              url: post.url || api?.ctaUrl || fallback.ctaUrl,
              image: resolveImage(post.image, fallbackPost.image),
            };
          })
        : fallback.posts,
  };
}

export function mergeSiteContent(api: Partial<SiteContent> | undefined): SiteContent {
  return {
    name: api?.name || siteConfig.name,
    tagline: api?.tagline || siteConfig.tagline,
    address: api?.address || siteConfig.address,
    phone: api?.phone || siteConfig.phone,
    phoneDisplay: api?.phoneDisplay || siteConfig.phoneDisplay,
    instagram: api?.instagram || siteConfig.instagram,
    instagramUrl: api?.instagramUrl || siteConfig.instagramUrl,
    topBarMessage: api?.topBarMessage || siteConfig.topBarMessage,
  };
}

function mergeHomepageContent(
  api: Partial<HomepageContent> | null,
): HomepageContent {
  return {
    hero: mergeHero(api?.hero),
    ourStory: mergeOurStory(api?.ourStory),
    valueProps: mergeValueProps(api?.valueProps),
    customCakes: mergeCustomCakes(api?.customCakes),
    instagram: mergeInstagram(api?.instagram),
    site: mergeSiteContent(api?.site),
  };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const url = new URL("/wp-json/viola/v1/homepage", getWordPressUrl());

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Viola homepage API error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as Partial<HomepageContent>;
    return mergeHomepageContent(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[wordpress] Falling back to homepage defaults:", error);
    }

    return mergeHomepageContent(null);
  }
}
