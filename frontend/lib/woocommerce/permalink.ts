import { signatureCategorySlugs } from "@/lib/config/site";
import type { ProductCategoryRef } from "@/types/product";

export function resolvePrimaryCategory(
  categories: ProductCategoryRef[],
): ProductCategoryRef {
  const match = signatureCategorySlugs
    .map((slug) => categories.find((category) => category.slug === slug))
    .find(Boolean);

  return (
    match ??
    categories[0] ?? {
      slug: "cakes",
      name: "Cakes",
    }
  );
}

export function buildProductPermalink(
  slug: string,
  categories: ProductCategoryRef[],
): string {
  const primary = resolvePrimaryCategory(categories);
  return `/collections/${primary.slug}/${slug}`;
}
