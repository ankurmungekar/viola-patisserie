import { Suspense } from "react";
import { CollectionBreadcrumbs } from "@/components/collection/CollectionBreadcrumbs";
import { CollectionListing } from "@/components/collection/CollectionListing";
import { CollectionTitle } from "@/components/collection/CollectionTitle";
import { CategoryTabs } from "@/components/collection/CategoryTabs";
import { getSignatureCategories } from "@/lib/woocommerce/categories";
import {
  getCollectionFilterData,
  getProductsForCollection,
  parseCollectionSearchParams,
} from "@/lib/woocommerce/collection";
import { getCollectionBannerContent } from "@/lib/wordpress/collection-banner";

interface CollectionPageProps {
  activeCategorySlug: string | null;
  searchParams?: Record<string, string | string[] | undefined>;
}

function getFilterSearchParams(
  searchParams?: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const parsed = parseCollectionSearchParams(searchParams ?? {});
  const params: Record<string, string> = {};

  if (parsed.sort && parsed.sort !== "popularity") {
    params.sort = parsed.sort;
  }
  if (parsed.flavours?.length) {
    params.flavour = parsed.flavours.join(",");
  }
  if (parsed.dietary?.length) {
    params.dietary = parsed.dietary.join(",");
  }
  if (parsed.minPrice !== undefined) {
    params.minPrice = String(parsed.minPrice);
  }
  if (parsed.maxPrice !== undefined) {
    params.maxPrice = String(parsed.maxPrice);
  }

  return params;
}

export async function CollectionPage({
  activeCategorySlug,
  searchParams,
}: CollectionPageProps) {
  const query = parseCollectionSearchParams(searchParams ?? {});
  const filterSearchParams = getFilterSearchParams(searchParams);

  const [categories, products, filterData, banner] = await Promise.all([
    getSignatureCategories(),
    getProductsForCollection({
      ...query,
      categorySlug: activeCategorySlug,
    }),
    getCollectionFilterData(activeCategorySlug, query),
    getCollectionBannerContent(),
  ]);

  const activeCategory = activeCategorySlug
    ? categories.find((category) => category.slug === activeCategorySlug)
    : null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-10 md:px-8 xl:px-[100px]">
      <CollectionBreadcrumbs categoryName={activeCategory?.name ?? "All"} />
      <CollectionTitle
        categoryName={activeCategory?.name ?? null}
        className="mt-5"
      />
      <CategoryTabs
        categories={categories}
        activeCategorySlug={activeCategorySlug}
        searchParams={filterSearchParams}
        className="mt-8"
      />

      <div className="mt-8">
        <Suspense
          fallback={
            <p className="text-sm tracking-viola-wide text-viola-text">
              Loading collection...
            </p>
          }
        >
          <CollectionListing
            products={products}
            filterData={filterData}
            banner={banner}
          />
        </Suspense>
      </div>
    </div>
  );
}
