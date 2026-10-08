import { siteConfig } from "@/lib/config/site";
import type { CustomCakesPageContent } from "@/types/custom-cakes";

export const customCakesPageDefaults: CustomCakesPageContent = {
  banner: {
    eyebrow: "Custom Cake Orders",
    titleLead: "Have a",
    titleAccent: "Unique Idea?",
    description:
      "From sketches to inspiration photos, share your thoughts with us we’d love to create something extraordinary just for you",
    ctaLabel: "Chat on Whatsapp",
    ctaUrl: siteConfig.whatsappUrl,
    image: {
      src: "/images/custom-cakes.jpg",
      alt: "Floral three-tier custom celebration cake",
    },
  },
  highlights: [
    {
      id: "design",
      icon: "cake",
      title: "Personalized Design",
      description: "Share your theme,colors and ideas",
    },
    {
      id: "ingredients",
      icon: "badge",
      title: "Premium Ingredients",
      description: "Delicious, handcrafted with care",
    },
    {
      id: "occasion",
      icon: "heart",
      title: "Perfect for Every Occasion",
      description: "Birthdays, anniversaries, weddings & more",
    },
    {
      id: "process",
      icon: "chat",
      title: "Quick & Easy Process",
      description: "Chat with us on WhatsApp to get started",
    },
  ],
  gallery: {
    eyebrow: "our Creations",
    title: "Custom Cakes",
    titleAccent: "Gallery",
    viewMoreLabel: "View More",
    emptyMessage: "More custom cakes for this occasion are coming soon.",
    items: [
      {
        id: "fallback-1",
        src: "/images/custom-cakes.jpg",
        alt: "Floral three-tier wedding cake",
        occasion: "wedding",
      },
      {
        id: "fallback-2",
        src: "/images/made-for-celebration.jpg",
        alt: "Celebration cake with floral decorations",
        occasion: "wedding",
      },
      {
        id: "fallback-3",
        src: "/images/bestseller-1.jpg",
        alt: "Chocolate birthday cake",
        occasion: "birthday",
      },
      {
        id: "fallback-4",
        src: "/images/cake-category.png",
        alt: "Handcrafted custom cake",
        occasion: "birthday",
      },
      {
        id: "fallback-5",
        src: "/images/bento-cake-category.jpg",
        alt: "Personal-sized celebration cake",
        occasion: "anniversary",
      },
      {
        id: "fallback-6",
        src: "/images/bestseller-2.jpg",
        alt: "Layered birthday cake",
        occasion: "birthday",
      },
      {
        id: "fallback-7",
        src: "/images/instagram-1.jpg",
        alt: "Custom floral cake",
        occasion: "wedding",
      },
      {
        id: "fallback-8",
        src: "/images/bestseller-3.jpg",
        alt: "Decorated birthday cake",
        occasion: "birthday",
      },
      {
        id: "fallback-9",
        src: "/images/about-us.jpg",
        alt: "Chef finishing a custom cake",
        occasion: "anniversary",
      },
      {
        id: "fallback-10",
        src: "/images/instagram-2.jpg",
        alt: "Celebration cake detail",
        occasion: "birthday",
      },
      {
        id: "fallback-11",
        src: "/images/order-delivered.jpg",
        alt: "Gift-boxed custom cake",
        occasion: "anniversary",
      },
      {
        id: "fallback-12",
        src: "/images/instagram-3.jpg",
        alt: "Custom cake for a special occasion",
        occasion: "wedding",
      },
    ],
  },
};
