import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { siteConfig } from "@/lib/config/site";

interface CollectionsIndexPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "All Signature Collection",
  description: `Browse all signature collections from ${siteConfig.name}.`,
};

export default async function CollectionsIndexPage({
  searchParams,
}: CollectionsIndexPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <CollectionPage
      activeCategorySlug={null}
      searchParams={resolvedSearchParams}
    />
  );
}
