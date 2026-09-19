"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { CollectionBreadcrumbs } from "@/components/collection/CollectionBreadcrumbs";
import { CategoryTabs } from "@/components/collection/CategoryTabs";
import { CollectionTitle } from "@/components/collection/CollectionTitle";
import type { Category } from "@/types/category";

const FILTER_QUERY_KEYS = [
  "sort",
  "flavour",
  "dietary",
  "minPrice",
  "maxPrice",
] as const;

interface CollectionChromeProps {
  categories: Category[];
}

function getActiveCategorySlug(
  pathname: string,
  categories: Category[],
): string | null {
  const segment = pathname.match(/^\/collections\/([^/]+)\/?$/)?.[1];
  if (!segment) {
    return null;
  }

  return categories.some((category) => category.slug === segment)
    ? segment
    : null;
}

function getFilterSearchParams(
  searchParams: URLSearchParams,
): Record<string, string> {
  const params: Record<string, string> = {};

  for (const key of FILTER_QUERY_KEYS) {
    const value = searchParams.get(key);
    if (value) {
      params[key] = value;
    }
  }

  return params;
}

export function CollectionChrome({ categories }: CollectionChromeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategorySlug = getActiveCategorySlug(pathname, categories);
  const activeCategory = activeCategorySlug
    ? categories.find((category) => category.slug === activeCategorySlug)
    : null;

  return (
    <>
      <CollectionBreadcrumbs categoryName={activeCategory?.name ?? "All"} />
      <CollectionTitle
        categoryName={activeCategory?.name ?? null}
        className="mt-5"
      />
      <CategoryTabs
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        searchParams={getFilterSearchParams(searchParams)}
        className="mt-8"
      />
    </>
  );
}
