import { CollectionListing } from "@/components/collection/CollectionListing";
import { ProductPageLoader } from "@/components/ui/ProductPageLoader";
import {
  getCollectionFilterData,
  getProductsForCollection,
  parseCollectionSearchParams,
} from "@/lib/woocommerce/collection";
import { getCollectionBannerContent } from "@/lib/wordpress/collection-banner";
import { Suspense } from "react";

interface CollectionPageProps {
  activeCategorySlug: string | null;
  searchParams?: Record<string, string | string[] | undefined>;
}

export async function CollectionPage({
  activeCategorySlug,
  searchParams,
}: CollectionPageProps) {
  const query = parseCollectionSearchParams(searchParams ?? {});

  const [products, filterData, banner] = await Promise.all([
    getProductsForCollection({
      ...query,
      categorySlug: activeCategorySlug,
    }),
    getCollectionFilterData(activeCategorySlug, query),
    getCollectionBannerContent(),
  ]);

  return (
    <Suspense fallback={<ProductPageLoader variant="collection" compact />}>
      <CollectionListing
        products={products}
        filterData={filterData}
        banner={banner}
      />
    </Suspense>
  );
}
