import type { Metadata } from "next";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { CustomCakesSection } from "@/components/home/CustomCakesSection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { InstagramSection } from "@/components/home/InstagramSection";
import { OurStorySection } from "@/components/home/OurStorySection";
import { SignatureCollectionSection } from "@/components/home/SignatureCollectionSection";
import { ValuePropsSection } from "@/components/home/ValuePropsSection";
import { siteConfig } from "@/lib/config/site";
import { getSignatureCategories } from "@/lib/woocommerce/categories";
import { getBestsellerProducts } from "@/lib/woocommerce/products";

export const metadata: Metadata = {
  title: "Handcrafted Cakes & Desserts",
  description: siteConfig.tagline,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Handcrafted Cakes & Desserts`,
    description: siteConfig.tagline,
    url: "/",
  },
};

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getSignatureCategories(),
    getBestsellerProducts(4),
  ]);

  return (
    <>
      <HeroBanner />
      <SignatureCollectionSection categories={categories} />
      <BestsellersSection products={products} />
      <OurStorySection />
      <ValuePropsSection />
      <CustomCakesSection />
      <InstagramSection />
    </>
  );
}
