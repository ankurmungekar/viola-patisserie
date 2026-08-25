export const siteConfig = {
  name: "Viola Patisserie",
  phone: "+91 70198 42601",
  phoneDisplay: "For Pr-orders: +91 70198 42601",
  address: "Malad East, Mumbai, Maharashtra",
  tagline:
    "Handcrafted cakes & desserts, thoughtfully created to celebrate life's sweetest moments.",
  instagram: "@_violapatisserie_",
  instagramUrl: "https://instagram.com/_violapatisserie_",
  topBarMessage: "Visit Our Store",
  founder: {
    name: "Aishwarya Sinkar",
    title: "Founder & Pastry Chef",
  },
} as const;

export const mainNavLinks = [
  { label: "Custom cakes", href: "/custom-cakes" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
] as const;

export const footerExploreLinks = [
  { label: "About us", href: "/about" },
  { label: "Signature Collection", href: "/collections" },
  { label: "Custom Cakes", href: "/custom-cakes" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const footerHelpLinks = [
  { label: "Shipping & Cancellation", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "FAQs", href: "/faqs" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
] as const;

export const signatureCategorySlugs = [
  "cakes",
  "brownies",
  "macarons",
  "tea-cakes",
  "cupcakes",
  "bento-cakes",
] as const;
