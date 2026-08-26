import { DEFAULT_CATEGORY_IMAGE } from "@/lib/config/categories";
import { signatureCategorySlugs } from "@/lib/config/site";
import { safeStoreFetch } from "@/lib/woocommerce/client";
import { mockCategories } from "@/lib/woocommerce/mocks";
import type { Category } from "@/types/category";

interface StoreCategoryImage {
  src?: string;
  alt?: string;
  thumbnail?: string;
}

interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  image?: StoreCategoryImage | null;
}

function mapCategory(category: StoreCategory): Category {
  const imageSrc =
    category.image?.thumbnail ??
    category.image?.src ??
    DEFAULT_CATEGORY_IMAGE;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    count: category.count,
    image: {
      src: imageSrc,
      alt: category.image?.alt ?? category.name,
    },
  };
}

function orderCategories(categories: Category[]): Category[] {
  const slugOrder = new Map(
    signatureCategorySlugs.map((slug, index) => [slug, index]),
  );

  return [...categories].sort((a, b) => {
    const aIndex = slugOrder.get(a.slug as (typeof signatureCategorySlugs)[number]);
    const bIndex = slugOrder.get(b.slug as (typeof signatureCategorySlugs)[number]);

    if (aIndex === undefined && bIndex === undefined) {
      return a.name.localeCompare(b.name);
    }
    if (aIndex === undefined) return 1;
    if (bIndex === undefined) return -1;
    return aIndex - bIndex;
  });
}

export async function getSignatureCategories(): Promise<Category[]> {
  const data = await safeStoreFetch<StoreCategory[]>({
    path: "/products/categories",
    searchParams: {
      per_page: 20,
      hide_empty: false,
    },
  });

  if (!data) {
    return mockCategories;
  }

  const filtered = data
    .filter((category) =>
      signatureCategorySlugs.includes(
        category.slug as (typeof signatureCategorySlugs)[number],
      ),
    )
    .map(mapCategory);

  const merged = signatureCategorySlugs.map((slug) => {
    const fromApi = filtered.find((category) => category.slug === slug);
    if (fromApi) {
      return fromApi;
    }

    return mockCategories.find((category) => category.slug === slug);
  }).filter((category): category is Category => Boolean(category));

  if (merged.length === 0) {
    return mockCategories;
  }

  return orderCategories(merged);
}

export async function getNavCategories(): Promise<Category[]> {
  return getSignatureCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await safeStoreFetch<StoreCategory[]>({
    path: "/products/categories",
    searchParams: {
      per_page: 100,
      hide_empty: false,
    },
  });

  const match = data?.find((category) => category.slug === slug);
  if (match) {
    return mapCategory(match);
  }

  const mock = mockCategories.find((category) => category.slug === slug);
  return mock ?? null;
}
