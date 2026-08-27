import type { Metadata } from "next";
import { AboutBreadcrumbs } from "@/components/about/AboutBreadcrumbs";
import { AboutFounderSection } from "@/components/about/AboutFounderSection";
import { AboutHighlightSection } from "@/components/about/AboutHighlightSection";
import { AboutStorySection } from "@/components/about/AboutStorySection";
import { siteConfig } from "@/lib/config/site";
import { getAboutContent } from "@/lib/wordpress/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover the story behind Viola Patisserie — handcrafted cakes and desserts made with passion, craftsmanship, and care in Mumbai.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About Us | ${siteConfig.name}`,
    description:
      "Discover the story behind Viola Patisserie — handcrafted cakes and desserts made with passion, craftsmanship, and care in Mumbai.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const { story, highlight, founder } = await getAboutContent();

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-[30px] md:px-8 xl:px-[100px]">
      <AboutBreadcrumbs />
      <div className="mt-[30px]">
        <AboutStorySection content={story} />
      </div>
      <div className="mt-20">
        <AboutHighlightSection content={highlight} />
      </div>
      <div className="mt-20 lg:mt-[158px]">
        <AboutFounderSection content={founder} />
      </div>
    </div>
  );
}
