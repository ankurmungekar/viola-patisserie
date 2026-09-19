import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionPage } from "@/components/collection/CollectionPage";
import { signatureCategorySlugs, siteConfig } from "@/lib/config/site";
import { getCategoryBySlug } from "@/lib/woocommerce/categories";

interface CategoryCollectionPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({
  params,
}: CategoryCollectionPageProps): Promise<Metadata> {
  const { categorySlug } = await params;

  if (
    !signatureCategorySlugs.includes(
      categorySlug as (typeof signatureCategorySlugs)[number],
    )
  ) {
    return { title: "Collection not found" };
  }

  const category = await getCategoryBySlug(categorySlug);

  return {
    title: `${category?.name ?? categorySlug} Signature Collection`,
    description: `Browse ${category?.name ?? categorySlug} from ${siteConfig.name}.`,
  };
}

export default async function CategoryCollectionPage({
  params,
  searchParams,
}: CategoryCollectionPageProps) {
  const { categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  if (
    !signatureCategorySlugs.includes(
      categorySlug as (typeof signatureCategorySlugs)[number],
    )
  ) {
    notFound();
  }

  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <CollectionPage
      activeCategorySlug={categorySlug}
      searchParams={resolvedSearchParams}
    />
  );
}
