export type CustomCakeOccasion =
  | "all"
  | "wedding"
  | "birthday"
  | "anniversary";

export type CustomCakeHighlightIcon = "cake" | "badge" | "heart" | "chat";

export interface CustomCakeImage {
  src: string;
  alt: string;
}

export interface CustomCakeBannerContent {
  eyebrow: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  image: CustomCakeImage;
}

export interface CustomCakeHighlight {
  id: string;
  icon: CustomCakeHighlightIcon;
  title: string;
  description: string;
}

export interface CustomCakeGalleryItem {
  id: number | string;
  src: string;
  alt: string;
  occasion: CustomCakeOccasion;
}

export interface CustomCakeGalleryContent {
  eyebrow: string;
  title: string;
  titleAccent: string;
  viewMoreLabel: string;
  emptyMessage: string;
  items: CustomCakeGalleryItem[];
}

export interface CustomCakesPageContent {
  banner: CustomCakeBannerContent;
  highlights: CustomCakeHighlight[];
  gallery: CustomCakeGalleryContent;
}

export const customCakeGalleryTabs: {
  id: CustomCakeOccasion;
  label: string;
}[] = [
  { id: "all", label: "All Custom Cakes" },
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "anniversary", label: "Anniversary" },
];
