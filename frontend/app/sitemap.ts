import type { MetadataRoute } from "next";
import { signatureCategorySlugs } from "@/lib/config/site";
import { getProductSitemapPaths } from "@/lib/woocommerce/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date();

  const categoryEntries: MetadataRoute.Sitemap = signatureCategorySlugs.map(
    (slug) => ({
      url: `${siteUrl}/collections/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    }),
  );

  const productPaths = await getProductSitemapPaths();
  const productEntries: MetadataRoute.Sitemap = productPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...categoryEntries,
    ...productEntries,
  ];
}
