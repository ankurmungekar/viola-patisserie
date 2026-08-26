import {
  COLLECTION_FILTER_ATTRIBUTES,
  type CollectionSortValue,
  DEFAULT_COLLECTION_SORT,
} from "@/lib/config/collection-filters";
import { safeStoreFetch } from "@/lib/woocommerce/client";
import { getCategoryIdBySlug, mapStoreProductToProduct, type StoreProduct } from "@/lib/woocommerce/products";
import { mockProducts } from "@/lib/woocommerce/mocks";
import type { Product } from "@/types/product";

export interface CollectionQuery {
  categorySlug?: string | null;
  sort?: CollectionSortValue;
  flavours?: string[];
  dietary?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  perPage?: number;
}

export interface FilterTermOption {
  slug: string;
  name: string;
  count: number;
}

export interface CollectionFilterData {
  flavours: FilterTermOption[];
  dietary: FilterTermOption[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface StoreAttribute {
  id: number;
  name: string;
  taxonomy: string;
}

interface StoreAttributeTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface FlatAttributeCount {
  term: number;
  count: number;
}

interface NestedAttributeCounts {
  taxonomy: string;
  attribute_counts: {
    term: number;
    slug: string;
    name: string;
    count: number;
  }[];
}

interface StoreCollectionData {
  price_range?: {
    min_price: string;
    max_price: string;
  } | null;
  attribute_counts?:
    | FlatAttributeCount[]
    | NestedAttributeCounts[]
    | null;
}

function parseMinorUnits(value: string | undefined): number {
  const minorUnits = Number.parseInt(value ?? "0", 10);
  if (Number.isNaN(minorUnits)) {
    return 0;
  }

  return minorUnits / 100;
}

function mapSortParams(sort: CollectionSortValue = DEFAULT_COLLECTION_SORT): {
  orderby: string;
  order: "asc" | "desc";
} {
  switch (sort) {
    case "price-asc":
      return { orderby: "price", order: "asc" };
    case "price-desc":
      return { orderby: "price", order: "desc" };
    case "newest":
      return { orderby: "date", order: "desc" };
    default:
      return { orderby: "popularity", order: "desc" };
  }
}

function buildCollectionSearchParams(
  query: CollectionQuery,
  categoryId?: number | null,
): Record<string, string | number | boolean | undefined> {
  const { orderby, order } = mapSortParams(query.sort);
  const params: Record<string, string | number | boolean | undefined> = {
    per_page: query.perPage ?? 100,
    page: query.page ?? 1,
    orderby,
    order,
  };

  if (categoryId) {
    params.category = categoryId;
  }

  if (query.minPrice !== undefined) {
    params.min_price = Math.round(query.minPrice * 100);
  }

  if (query.maxPrice !== undefined) {
    params.max_price = Math.round(query.maxPrice * 100);
  }

  let attributeIndex = 0;

  for (const slug of query.flavours ?? []) {
    params[`attributes[${attributeIndex}][attribute]`] =
      COLLECTION_FILTER_ATTRIBUTES.flavour;
    params[`attributes[${attributeIndex}][slug]`] = slug;
    attributeIndex += 1;
  }

  for (const slug of query.dietary ?? []) {
    params[`attributes[${attributeIndex}][attribute]`] =
      COLLECTION_FILTER_ATTRIBUTES.dietary;
    params[`attributes[${attributeIndex}][slug]`] = slug;
    attributeIndex += 1;
  }

  return params;
}

function buildCollectionDataQuery(
  categoryId?: number | null,
  activeFilters?: Pick<CollectionQuery, "flavours" | "dietary" | "minPrice" | "maxPrice">,
): string {
  const url = new URL("/wp-json/wc/store/v1/products/collection-data", "http://localhost");

  url.searchParams.set("calculate_price_range", "true");
  url.searchParams.set(
    "calculate_attribute_counts[0][taxonomy]",
    COLLECTION_FILTER_ATTRIBUTES.flavour,
  );
  url.searchParams.set("calculate_attribute_counts[0][query_type]", "or");
  url.searchParams.set(
    "calculate_attribute_counts[1][taxonomy]",
    COLLECTION_FILTER_ATTRIBUTES.dietary,
  );
  url.searchParams.set("calculate_attribute_counts[1][query_type]", "or");

  if (categoryId) {
    url.searchParams.set("category", String(categoryId));
  }

  if (activeFilters?.minPrice !== undefined) {
    url.searchParams.set("min_price", String(Math.round(activeFilters.minPrice * 100)));
  }

  if (activeFilters?.maxPrice !== undefined) {
    url.searchParams.set("max_price", String(Math.round(activeFilters.maxPrice * 100)));
  }

  let attributeIndex = 0;

  for (const slug of activeFilters?.flavours ?? []) {
    url.searchParams.set(
      `attributes[${attributeIndex}][attribute]`,
      COLLECTION_FILTER_ATTRIBUTES.flavour,
    );
    url.searchParams.set(`attributes[${attributeIndex}][slug]`, slug);
    attributeIndex += 1;
  }

  for (const slug of activeFilters?.dietary ?? []) {
    url.searchParams.set(
      `attributes[${attributeIndex}][attribute]`,
      COLLECTION_FILTER_ATTRIBUTES.dietary,
    );
    url.searchParams.set(`attributes[${attributeIndex}][slug]`, slug);
    attributeIndex += 1;
  }

  return url.search;
}

function buildCountMap(
  attributeCounts: StoreCollectionData["attribute_counts"],
): Map<number, number> {
  const counts = new Map<number, number>();

  if (!attributeCounts?.length) {
    return counts;
  }

  const first = attributeCounts[0];

  if ("taxonomy" in first) {
    for (const group of attributeCounts as NestedAttributeCounts[]) {
      for (const term of group.attribute_counts ?? []) {
        counts.set(term.term, term.count);
      }
    }
    return counts;
  }

  for (const entry of attributeCounts as FlatAttributeCount[]) {
    counts.set(entry.term, entry.count);
  }

  return counts;
}

async function getAttributeTerms(taxonomy: string): Promise<StoreAttributeTerm[]> {
  const attributes = await safeStoreFetch<StoreAttribute[]>({
    path: "/products/attributes",
  });

  const attribute = attributes?.find((item) => item.taxonomy === taxonomy);
  if (!attribute) {
    return [];
  }

  const terms = await safeStoreFetch<StoreAttributeTerm[]>({
    path: `/products/attributes/${attribute.id}/terms`,
    searchParams: {
      per_page: 100,
    },
  });

  return terms ?? [];
}

function mapTermsWithCounts(
  terms: StoreAttributeTerm[],
  counts: Map<number, number>,
): FilterTermOption[] {
  return terms.map((term) => ({
    slug: term.slug,
    name: term.name,
    count: counts.get(term.id) ?? term.count ?? 0,
  }));
}

function getMockProducts(query: CollectionQuery): Product[] {
  let products = [...mockProducts];

  if (query.categorySlug) {
    products = products.filter((product) =>
      product.permalink.includes(`/collections/${query.categorySlug}/`),
    );
  }

  if (query.minPrice !== undefined) {
    products = products.filter((product) => product.price >= query.minPrice!);
  }

  if (query.maxPrice !== undefined) {
    products = products.filter((product) => product.price <= query.maxPrice!);
  }

  const { orderby, order } = mapSortParams(query.sort);

  if (orderby === "price") {
    products.sort((a, b) =>
      order === "asc" ? a.price - b.price : b.price - a.price,
    );
  }

  return products;
}

export async function getProductsForCollection(
  query: CollectionQuery = {},
): Promise<Product[]> {
  const categoryId = query.categorySlug
    ? await getCategoryIdBySlug(query.categorySlug)
    : null;

  if (query.categorySlug && !categoryId) {
    return [];
  }

  const products = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: buildCollectionSearchParams(query, categoryId),
  });

  if (products === null) {
    if (query.categorySlug) {
      return [];
    }

    return getMockProducts(query);
  }

  if (products.length === 0) {
    return [];
  }

  return products.map(mapStoreProductToProduct);
}

export async function getCollectionFilterData(
  categorySlug?: string | null,
  activeFilters?: Pick<CollectionQuery, "flavours" | "dietary" | "minPrice" | "maxPrice">,
): Promise<CollectionFilterData> {
  const categoryId = categorySlug
    ? await getCategoryIdBySlug(categorySlug)
    : null;

  const queryString = buildCollectionDataQuery(categoryId, activeFilters);

  const [flavourTerms, dietaryTerms, data] = await Promise.all([
    getAttributeTerms(COLLECTION_FILTER_ATTRIBUTES.flavour),
    getAttributeTerms(COLLECTION_FILTER_ATTRIBUTES.dietary),
    safeStoreFetch<StoreCollectionData>({
      path: `/products/collection-data${queryString}`,
    }),
  ]);

  const counts = buildCountMap(data?.attribute_counts);
  const min = parseMinorUnits(data?.price_range?.min_price);
  const max = parseMinorUnits(data?.price_range?.max_price);

  return {
    flavours: mapTermsWithCounts(flavourTerms, counts),
    dietary: mapTermsWithCounts(dietaryTerms, counts),
    priceRange: {
      min: min > 0 ? min : 500,
      max: max > 0 ? max : 2500,
    },
  };
}

export function parseCollectionSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): Omit<CollectionQuery, "categorySlug"> {
  const getValue = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const sort = getValue("sort") as CollectionSortValue | undefined;
  const flavourParam = getValue("flavour");
  const dietaryParam = getValue("dietary");
  const minPrice = Number.parseInt(getValue("minPrice") ?? "", 10);
  const maxPrice = Number.parseInt(getValue("maxPrice") ?? "", 10);

  return {
    sort: sort ?? DEFAULT_COLLECTION_SORT,
    flavours: flavourParam
      ? flavourParam.split(",").filter(Boolean)
      : undefined,
    dietary: dietaryParam
      ? dietaryParam.split(",").filter(Boolean)
      : undefined,
    minPrice: Number.isNaN(minPrice) ? undefined : minPrice,
    maxPrice: Number.isNaN(maxPrice) ? undefined : maxPrice,
  };
}
