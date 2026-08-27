export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductCategoryRef {
  slug: string;
  name: string;
}

export interface ProductVariation {
  id: number;
  attributes: { name: string; value: string }[];
  price: number;
  priceHtml: string;
  inStock: boolean;
}

export interface ProductAttributeOption {
  name: string;
  slug: string;
}

export interface ProductAttribute {
  name: string;
  taxonomy: string;
  options: ProductAttributeOption[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceHtml: string;
  image: ProductImage;
  permalink: string;
}

export interface ProductDetail extends Product {
  shortDescription: string;
  storageInstructions: string;
  images: ProductImage[];
  categories: ProductCategoryRef[];
  primaryCategory: ProductCategoryRef;
  type: "simple" | "variable";
  variations: ProductVariation[];
  attributes: ProductAttribute[];
}
