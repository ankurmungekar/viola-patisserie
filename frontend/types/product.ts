export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceHtml: string;
  image: {
    src: string;
    alt: string;
  };
  permalink: string;
}
