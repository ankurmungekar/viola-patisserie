import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import { signatureCategorySlugs } from "@/lib/config/site";
import { buildProductPermalink } from "@/lib/woocommerce/permalink";
import { safeStoreFetch, storeFetch } from "@/lib/woocommerce/client";
import {
  mockProductDetails,
  mockProducts,
} from "@/lib/woocommerce/mocks";
import { formatPrice } from "@/lib/utils/format-price";
import { stripHtml } from "@/lib/utils/strip-html";
import { normalizeWordPressImageUrl } from "@/lib/wordpress/images";
import type {
  Product,
  ProductAttribute,
  ProductCategoryRef,
  ProductDetail,
  ProductImage,
  ProductVariation,
} from "@/types/product";

interface StoreProductImage {
  src?: string;
  alt?: string;
  thumbnail?: string;
}

interface StoreProductPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range?: {
    min_amount: string;
    max_amount: string;
  } | null;
}

interface StoreProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface StoreProductAttribute {
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: { name: string; slug: string }[];
}

interface StoreProductVariation {
  id: number;
  attributes: { name: string; value: string }[];
  prices: StoreProductPrices;
  is_in_stock?: boolean;
}

interface StoreViolaCommerceProductExtensions {
  allergens?: string;
  consumption?: string;
  storage_info?: string;
  color_options?: string[];
  flavor_options?: string[];
}

interface StoreProductExtensions {
  viola_commerce?: StoreViolaCommerceProductExtensions;
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  permalink: string;
  type?: string;
  prices: StoreProductPrices;
  images: StoreProductImage[];
  categories?: StoreProductCategory[];
  attributes?: StoreProductAttribute[];
  variations?: StoreProductVariation[];
  allergens?: string;
  consumption?: string;
  storage_info?: string;
  color_options?: string[];
  flavor_options?: string[];
  extensions?: StoreProductExtensions;
  is_in_stock?: boolean;
}

function parseStoreOptionList(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const options: string[] = [];

  for (const item of value) {
    if (typeof item !== "string") {
      continue;
    }

    const trimmed = item.trim();
    if (trimmed) {
      options.push(trimmed);
    }
  }

  return options;
}

function readViolaProductFields(product: StoreProduct): {
  allergens: string;
  consumption: string;
  storageInfo: string;
  colorOptions: string[];
  flavorOptions: string[];
} {
  const extension = product.extensions?.viola_commerce;

  return {
    allergens: (product.allergens ?? extension?.allergens ?? "").trim(),
    consumption: (product.consumption ?? extension?.consumption ?? "").trim(),
    storageInfo: (product.storage_info ?? extension?.storage_info ?? "").trim(),
    colorOptions: parseStoreOptionList(
      product.color_options ?? extension?.color_options,
    ),
    flavorOptions: parseStoreOptionList(
      product.flavor_options ?? extension?.flavor_options,
    ),
  };
}

function parsePrice(prices?: StoreProductPrices | null): number {
  if (!prices) {
    return 0;
  }

  const raw =
    prices.price ||
    prices.sale_price ||
    prices.regular_price ||
    prices.price_range?.min_amount ||
    "0";

  const minorUnits = Number.parseInt(raw, 10);
  if (Number.isNaN(minorUnits)) {
    return 0;
  }

  return minorUnits / 100;
}

function mapImages(images: StoreProductImage[]): ProductImage[] {
  if (images.length === 0) {
    return [{ src: DEFAULT_PRODUCT_IMAGE, alt: "" }];
  }

  return images.map((image, index) => ({
    src: normalizeWordPressImageUrl(
      image.src ?? image.thumbnail ?? DEFAULT_PRODUCT_IMAGE,
    ),
    alt: image.alt ?? `Product image ${index + 1}`,
  }));
}

function mapCategories(categories: StoreProductCategory[] = []): ProductCategoryRef[] {
  return categories.map((category) => ({
    slug: category.slug,
    name: category.name,
  }));
}

function mapAttributes(attributes: StoreProductAttribute[] = []): ProductAttribute[] {
  return attributes
    .filter((attribute) => attribute.has_variations)
    .map((attribute) => ({
      name: attribute.name,
      taxonomy: attribute.taxonomy,
      options: attribute.terms.map((term) => ({
        name: term.name,
        slug: term.slug,
      })),
    }));
}

function mapVariations(variations: StoreProductVariation[] = []): ProductVariation[] {
  return variations.map((variation) => {
    const price = parsePrice(variation.prices);

    return {
      id: variation.id,
      attributes: variation.attributes,
      price,
      priceHtml: price > 0 ? formatPrice(price) : "",
      inStock: variation.is_in_stock !== false,
    };
  });
}

async function enrichVariations(
  variations: StoreProductVariation[],
): Promise<ProductVariation[]> {
  if (variations.length === 0) {
    return [];
  }

  const enriched = await Promise.all(
    variations.map(async (variation) => {
      const detail = await safeStoreFetch<StoreProduct>({
        path: `/products/${variation.id}`,
        revalidate: 60,
      });

      const prices = detail?.prices ?? variation.prices;
      const price = parsePrice(prices);

      return {
        id: variation.id,
        attributes: variation.attributes,
        price,
        priceHtml: price > 0 ? formatPrice(price) : "",
        inStock: detail?.is_in_stock !== false && variation.is_in_stock !== false,
      };
    }),
  );

  return enriched;
}

function mapProductDetail(
  product: StoreProduct,
  variations: ProductVariation[],
): ProductDetail {
  const categories = mapCategories(product.categories);
  const images = mapImages(product.images);
  const variationPrices = variations
    .map((variation) => variation.price)
    .filter((price) => price > 0);
  const price =
    variationPrices.length > 0
      ? Math.min(...variationPrices)
      : parsePrice(product.prices);
  const shortDescription =
    stripHtml(product.short_description ?? "") ||
    stripHtml(product.description ?? "");
  const violaFields = readViolaProductFields(product);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: stripHtml(product.description),
    shortDescription,
    allergens: violaFields.allergens,
    consumption: violaFields.consumption,
    storageInfo: violaFields.storageInfo,
    colorOptions: violaFields.colorOptions,
    flavorOptions: violaFields.flavorOptions,
    price,
    priceHtml: price > 0 ? formatPrice(price) : "",
    image: images[0],
    images,
    categories,
    primaryCategory: categories.find((category) =>
      signatureCategorySlugs.includes(
        category.slug as (typeof signatureCategorySlugs)[number],
      ),
    ) ?? categories[0] ?? { slug: "cakes", name: "Cakes" },
    permalink: buildProductPermalink(product.slug, categories),
    type: product.type === "variable" ? "variable" : "simple",
    variations,
    attributes: mapAttributes(product.attributes),
  };
}

export function mapStoreProductToProduct(product: StoreProduct): Product {
  return mapProduct(product, mapVariations(product.variations));
}

function mapProduct(product: StoreProduct, variations: ProductVariation[]): Product {
  const detail = mapProductDetail(product, variations);

  return {
    id: detail.id,
    name: detail.name,
    slug: detail.slug,
    description: detail.description,
    price: detail.price,
    priceHtml: detail.priceHtml,
    image: detail.image,
    permalink: detail.permalink,
  };
}

export async function getBestsellerProducts(limit = 4): Promise<Product[]> {
  const featured = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      featured: true,
      per_page: limit,
    },
  });

  if (featured && featured.length > 0) {
    return featured.map((product) =>
      mapProduct(product, mapVariations(product.variations)),
    );
  }

  const fallback = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      per_page: limit,
      orderby: "popularity",
    },
  });

  if (fallback && fallback.length > 0) {
    return fallback.map((product) =>
      mapProduct(product, mapVariations(product.variations)),
    );
  }

  return mockProducts.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const data = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      slug,
      per_page: 1,
    },
  });

  if (data && data.length > 0) {
    const product = data[0];
    const variations =
      product.type === "variable" && product.variations?.length
        ? await enrichVariations(product.variations)
        : mapVariations(product.variations);

    return mapProductDetail(product, variations);
  }

  const mock = mockProductDetails[slug];
  return mock ?? null;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeId: number,
  limit = 4,
): Promise<Product[]> {
  const categories = await safeStoreFetch<StoreProductCategory[]>({
    path: "/products/categories",
    searchParams: {
      per_page: 100,
      hide_empty: false,
    },
  });

  const categoryId = categories?.find((category) => category.slug === categorySlug)?.id;

  if (!categoryId) {
    return mockProducts
      .filter((product) => product.id !== excludeId)
      .slice(0, limit);
  }

  const products = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      category: categoryId,
      per_page: limit + 1,
      orderby: "popularity",
    },
  });

  if (!products || products.length === 0) {
    return mockProducts
      .filter((product) => product.id !== excludeId)
      .slice(0, limit);
  }

  return products
    .filter((product) => product.id !== excludeId)
    .slice(0, limit)
    .map((product) => mapProduct(product, mapVariations(product.variations)));
}

export async function getCategoryIdBySlug(slug: string): Promise<number | null> {
  const categories = await safeStoreFetch<StoreProductCategory[]>({
    path: "/products/categories",
    searchParams: {
      per_page: 100,
      hide_empty: false,
    },
  });

  const match = categories?.find((category) => category.slug === slug);
  return match?.id ?? null;
}

export async function getProductSitemapPaths(): Promise<string[]> {
  const products = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      per_page: 100,
    },
    revalidate: 3600,
  });

  if (!products || products.length === 0) {
    return mockProducts.map((product) => product.permalink);
  }

  return products.map((product) =>
    buildProductPermalink(product.slug, mapCategories(product.categories)),
  );
}
