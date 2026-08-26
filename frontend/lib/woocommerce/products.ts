import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import { signatureCategorySlugs } from "@/lib/config/site";
import { DEFAULT_STORAGE_INSTRUCTIONS } from "@/lib/config/product-defaults";
import { buildProductPermalink } from "@/lib/woocommerce/permalink";
import { safeStoreFetch, storeFetch } from "@/lib/woocommerce/client";
import {
  mockProductDetails,
  mockProducts,
} from "@/lib/woocommerce/mocks";
import { formatPrice } from "@/lib/utils/format-price";
import { stripHtml } from "@/lib/utils/strip-html";
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
  storage_instructions?: string;
  is_in_stock?: boolean;
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
    src: image.src ?? image.thumbnail ?? DEFAULT_PRODUCT_IMAGE,
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
  return attributes.map((attribute) => ({
    name: attribute.name,
    options: attribute.terms.map((term) => term.name),
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
    product.short_description?.trim() ||
    stripHtml(product.description);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: stripHtml(product.description),
    shortDescription,
    storageInstructions:
      product.storage_instructions?.trim() || DEFAULT_STORAGE_INSTRUCTIONS,
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
