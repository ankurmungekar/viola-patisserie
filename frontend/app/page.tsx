import type { Metadata } from "next";
import { BestsellersSection } from "@/components/home/BestsellersSection";
import { CustomCakesSection } from "@/components/home/CustomCakesSection";
import { HeroBanner } from "@/components/home/HeroBanner";
import { InstagramSection } from "@/components/home/InstagramSection";
import { OurStorySection } from "@/components/home/OurStorySection";
import { SignatureCollectionSection } from "@/components/home/SignatureCollectionSection";
import { ValuePropsSection } from "@/components/home/ValuePropsSection";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/config/site";
import { getHomepageContent } from "@/lib/wordpress/homepage";
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
  const [categories, products, homepage] = await Promise.all([
    getSignatureCategories(),
    getBestsellerProducts(4),
    getHomepageContent(),
  ]);

  return (
    <>
      <HeroBanner content={homepage.hero} />
      <Reveal>
        <SignatureCollectionSection categories={categories} />
      </Reveal>
      <Reveal>
        <BestsellersSection products={products} />
      </Reveal>
      <Reveal>
        <OurStorySection content={homepage.ourStory} />
      </Reveal>
      <Reveal>
        <ValuePropsSection valueProps={homepage.valueProps} />
      </Reveal>
      <Reveal>
        <CustomCakesSection content={homepage.customCakes} />
      </Reveal>
      <Reveal>
        <InstagramSection content={homepage.instagram} />
      </Reveal>
    </>
  );
}
