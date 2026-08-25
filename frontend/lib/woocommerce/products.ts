import { safeStoreFetch } from "@/lib/woocommerce/client";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import { mockProducts } from "@/lib/woocommerce/mocks";
import { formatPrice } from "@/lib/utils/format-price";
import type { Product } from "@/types/product";

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

interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  permalink: string;
  prices: StoreProductPrices;
  images: StoreProductImage[];
}

function parsePrice(prices: StoreProductPrices): number {
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

function mapProduct(product: StoreProduct): Product {
  const price = parsePrice(product.prices);
  const image = product.images[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price,
    priceHtml: formatPrice(price),
    image: {
      src: image?.thumbnail ?? image?.src ?? DEFAULT_PRODUCT_IMAGE,
      alt: image?.alt ?? product.name,
    },
    permalink: `/cakes/${product.slug}`,
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
    return featured.map(mapProduct);
  }

  const fallback = await safeStoreFetch<StoreProduct[]>({
    path: "/products",
    searchParams: {
      per_page: limit,
      orderby: "popularity",
    },
  });

  if (fallback && fallback.length > 0) {
    return fallback.map(mapProduct);
  }

  return mockProducts.slice(0, limit);
}
