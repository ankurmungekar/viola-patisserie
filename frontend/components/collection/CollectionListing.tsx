"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CollectionToolbar } from "@/components/collection/CollectionToolbar";
import { FilterDrawer } from "@/components/collection/FilterDrawer";
import { ProductGridWithBanner } from "@/components/collection/ProductGridWithBanner";
import type { CollectionFilterData } from "@/lib/woocommerce/collection";
import type { PromoBannerContent } from "@/types/promo-banner";
import type { Product } from "@/types/product";

interface CollectionListingProps {
  products: Product[];
  filterData: CollectionFilterData;
  banner: PromoBannerContent;
}

export function CollectionListing({
  products,
  filterData,
  banner,
}: CollectionListingProps) {
  const searchParams = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;

    if (searchParams.get("flavour")) count += 1;
    if (searchParams.get("dietary")) count += 1;
    if (searchParams.get("minPrice") || searchParams.get("maxPrice")) count += 1;

    return count;
  }, [searchParams]);

  return (
    <>
      <CollectionToolbar
        resultCount={products.length}
        onFilterOpen={() => setFilterOpen(true)}
        activeFilterCount={activeFilterCount}
      />

      <div className="mt-8">
        <ProductGridWithBanner products={products} banner={banner} />
      </div>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filterData={filterData}
      />
    </>
  );
}
