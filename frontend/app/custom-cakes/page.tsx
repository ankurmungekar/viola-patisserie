import type { Metadata } from "next";
import { CustomCakesBanner } from "@/components/custom-cakes/CustomCakesBanner";
import { CustomCakesGallery } from "@/components/custom-cakes/CustomCakesGallery";
import { CustomCakesHighlights } from "@/components/custom-cakes/CustomCakesHighlights";
import { siteConfig } from "@/lib/config/site";
import { getCustomCakesContent } from "@/lib/wordpress/custom-cakes";

export const metadata: Metadata = {
  title: "Custom Cakes",
  description:
    "Share your sketches, colours, and inspiration with Viola Patisserie. We’ll craft a unique custom cake for birthdays, weddings, and every celebration.",
  alternates: {
    canonical: "/custom-cakes",
  },
  openGraph: {
    title: `Custom Cakes | ${siteConfig.name}`,
    description:
      "Share your sketches, colours, and inspiration with Viola Patisserie. We’ll craft a unique custom cake for birthdays, weddings, and every celebration.",
    url: "/custom-cakes",
  },
};

export default async function CustomCakesPage() {
  const content = await getCustomCakesContent();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-[30px] md:px-8 xl:px-[100px]">
      <CustomCakesBanner content={content.banner} />
      <div className="mt-10 md:mt-12">
        <CustomCakesHighlights highlights={content.highlights} />
      </div>
      <CustomCakesGallery content={content.gallery} />
    </div>
  );
}
