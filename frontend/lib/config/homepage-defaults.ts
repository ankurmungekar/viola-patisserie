import type { HomepageContent } from "@/types/homepage";

export const homepageDefaults: HomepageContent = {
  hero: {
    eyebrowTags: ["Artisanal", "Elegant", "Unforgettable"],
    titleLine1: "Sweet Moments,",
    titleLine2: "Beautifully Crafted",
    description:
      "Exquisite patisserie, crafted with finest ingredients and a touch of love",
    ctaLabel: "Explore Collections",
    ctaUrl: "/collections",
    image: {
      src: "/images/homepage-hero.jpg",
      alt: "Viola Patisserie hero",
    },
  },
  ourStory: {
    eyebrow: "our Story",
    titleDark: "Meet the Heart Behind",
    titleAccent: "Viola",
    paragraphs: [
      "Every dessert at Viola Patisserie begins with a passion for craftsmanship, thoughtful design, and creating moments worth celebrating. Founded by Chef Aishwarya, Viola brings together classic pastry techniques and modern elegance to create handcrafted desserts that are as memorable as the occasions they celebrate.",
      "From intimate celebrations to grand milestones, every creation reflects the care, creativity, and dedication that define the brand.",
    ],
    signature: "Aishwarya Sinkar",
    signatureTitle: "Founder & Pastry Chef",
    ctaLabel: "Discover Our Story",
    ctaUrl: "/about",
    image: {
      src: "/images/about-viola.jpg",
      alt: "Aishwarya Sinkar, Founder & Pastry Chef",
    },
  },
  valueProps: [
    {
      icon: "badge",
      title: "Premium Ingredients",
      description:
        "We use the finest ingredients sourced from trusted artisans worldwide",
    },
    {
      icon: "mixer",
      title: "Artisan Craftsmanship",
      description:
        "Each creation is handcrafted with precision, passion and artistic touch",
    },
    {
      icon: "truck",
      title: "Fresh & Reliable Delivery",
      description:
        "Timely delivery with the utmost care to ensure freshness and perfection",
    },
    {
      icon: "gift-box",
      title: "Beautiful Packaging",
      description: "Elegantly packaged to make every moment extra special",
    },
  ],
  customCakes: {
    eyebrow: "Custom Cake Orders",
    titleDark: "Made Just for Your",
    titleAccent: "Celebration",
    description:
      "Every celebration is unique and your cake should be too. Share your ideas, theme, flavours, and inspiration, and we'll create a handcrafted cake designed exclusively for your special occasion",
    ctaLabel: "Contact Us for a Custom Order",
    ctaUrl: "/contact",
    image: {
      src: "/images/made-for-celebration.jpg",
      alt: "Custom celebration cake with floral decorations",
    },
  },
  instagram: {
    eyebrow: "Follow Our journey",
    handle: "@_violapatisserie_",
    description: "Join our growing community on Instagram. Tag us to be featured",
    ctaLabel: "Follow Us",
    ctaUrl: "https://instagram.com/_violapatisserie_",
    posts: [
      {
        id: 1,
        views: "2,186",
        url: "https://instagram.com/_violapatisserie_",
        image: { src: "/images/instagram-1.jpg", alt: "Instagram post 1" },
      },
      {
        id: 2,
        views: "1,599",
        url: "https://instagram.com/_violapatisserie_",
        image: { src: "/images/instagram-2.jpg", alt: "Instagram post 2" },
      },
      {
        id: 3,
        views: "18.1K",
        url: "https://instagram.com/_violapatisserie_",
        image: { src: "/images/instagram-3.jpg", alt: "Instagram post 3" },
      },
    ],
  },
  site: {
    name: "Viola Patisserie",
    tagline:
      "Handcrafted cakes & desserts, thoughtfully created to celebrate life's sweetest moments.",
    address: "Malad East, Mumbai, Maharashtra",
    phone: "+91 70198 42601",
    phoneDisplay: "For Pr-orders: +91 70198 42601",
    instagram: "@_violapatisserie_",
    instagramUrl: "https://instagram.com/_violapatisserie_",
    topBarMessage: "Visit Our Store",
  },
};
