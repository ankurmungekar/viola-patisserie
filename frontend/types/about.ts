export interface AboutImage {
  src: string;
  alt: string;
}

export interface AboutStoryContent {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  paragraphs: string[];
  image: AboutImage;
}

export interface AboutHighlightContent {
  paragraphs: string[];
  statValue: string;
  statLabel: string;
  image: AboutImage;
}

export interface AboutFounderContent {
  eyebrow: string;
  titleLine1: string;
  titleAccent: string;
  paragraphs: string[];
  signature: string;
  signatureTitle: string;
  image: AboutImage;
}

export interface AboutContent {
  story: AboutStoryContent;
  highlight: AboutHighlightContent;
  founder: AboutFounderContent;
}
