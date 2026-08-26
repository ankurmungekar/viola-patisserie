export interface PromoBannerImage {
  src: string;
  alt: string;
}

export interface PromoBannerContent {
  eyebrow: string;
  titlePrefix: string;
  titleAccent: string;
  ctaLabel: string;
  ctaUrl: string;
  image: PromoBannerImage;
  insertAfterRow?: number;
}
