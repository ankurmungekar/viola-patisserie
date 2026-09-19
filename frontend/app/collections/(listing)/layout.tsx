import { Suspense, type ReactNode } from "react";
import { CollectionChrome } from "@/components/collection/CollectionChrome";
import { CategoryTabs } from "@/components/collection/CategoryTabs";
import { CollectionBreadcrumbs } from "@/components/collection/CollectionBreadcrumbs";
import { CollectionTitle } from "@/components/collection/CollectionTitle";
import { getSignatureCategories } from "@/lib/woocommerce/categories";

export default async function CollectionListingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categories = await getSignatureCategories();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-10 md:px-8 xl:px-[100px]">
      <Suspense
        fallback={
          <>
            <CollectionBreadcrumbs categoryName="All" />
            <CollectionTitle className="mt-5" />
            <CategoryTabs
              categories={categories}
              activeCategorySlug={null}
              className="mt-8"
            />
          </>
        }
      >
        <CollectionChrome categories={categories} />
      </Suspense>
      <div className="mt-8">{children}</div>
    </div>
  );
}
