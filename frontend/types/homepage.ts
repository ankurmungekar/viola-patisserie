export interface HomepageImage {
  src: string;
  alt: string;
}

export interface HeroContent {
  eyebrowTags: string[];
  titleLine1: string;
  titleLine2: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  image: HomepageImage;
}

export type ValuePropIcon = "badge" | "mixer" | "truck" | "gift-box";

export interface ValuePropContent {
  icon: ValuePropIcon;
  title: string;
  description: string;
}

export interface OurStoryContent {
  eyebrow: string;
  titleDark: string;
  titleAccent: string;
  paragraphs: string[];
  signature: string;
  signatureTitle: string;
  ctaLabel: string;
  ctaUrl: string;
  image: HomepageImage;
}

export interface CustomCakesContent {
  eyebrow: string;
  titleDark: string;
  titleAccent: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  image: HomepageImage;
}

export interface InstagramPost {
  id: number;
  views: string;
  url: string;
  image: HomepageImage;
}

export interface InstagramContent {
  eyebrow: string;
  handle: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  posts: InstagramPost[];
}

export interface SiteContent {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  phoneDisplay: string;
  instagram: string;
  instagramUrl: string;
  topBarMessage: string;
}

export interface HomepageContent {
  hero: HeroContent;
  ourStory: OurStoryContent;
  valueProps: ValuePropContent[];
  customCakes: CustomCakesContent;
  instagram: InstagramContent;
  site: SiteContent;
}
