export const COLLECTION_FILTER_ATTRIBUTES = {
  flavour: "pa_flavour",
  dietary: "pa_dietary",
} as const;

export const COLLECTION_SORT_OPTIONS = [
  { value: "popularity", label: "Sort by" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

export type CollectionSortValue =
  (typeof COLLECTION_SORT_OPTIONS)[number]["value"];

export const DEFAULT_COLLECTION_SORT: CollectionSortValue = "popularity";
