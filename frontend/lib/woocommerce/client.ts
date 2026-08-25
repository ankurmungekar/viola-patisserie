const DEFAULT_WORDPRESS_URL = "http://localhost:8080";

export function getWordPressUrl(): string {
  return process.env.NEXT_PUBLIC_WORDPRESS_URL ?? DEFAULT_WORDPRESS_URL;
}

interface StoreFetchOptions {
  path: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
  revalidate?: number;
}

export async function storeFetch<T>({
  path,
  searchParams,
  revalidate = 60,
}: StoreFetchOptions): Promise<T> {
  const url = new URL(`/wp-json/wc/store/v1${path}`, getWordPressUrl());

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate },
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `WooCommerce Store API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function safeStoreFetch<T>(
  options: StoreFetchOptions,
): Promise<T | null> {
  try {
    return await storeFetch<T>(options);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[woocommerce] Falling back to mock data:", error);
    }
    return null;
  }
}
