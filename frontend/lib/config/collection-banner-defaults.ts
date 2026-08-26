import type { PromoBannerContent } from "@/types/promo-banner";

export const collectionBannerDefaults: PromoBannerContent = {
  eyebrow: "Custom Cake Orders",
  titlePrefix: "Made Just for Your",
  titleAccent: "Celebration",
  ctaLabel: "Contact Us for a Custom Order",
  ctaUrl: "/contact",
  image: {
    src: "/images/made-for-celebration.jpg",
    alt: "Custom celebration cake with floral decorations",
  },
  insertAfterRow: 3,
};
