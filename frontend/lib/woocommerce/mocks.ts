import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

const PLACEHOLDER = "/images/placeholders/category.svg";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Cakes",
    slug: "cakes",
    description: "Classic and celebration cakes",
    image: { src: PLACEHOLDER, alt: "Cakes" },
    count: 12,
  },
  {
    id: 2,
    name: "Brownies",
    slug: "brownies",
    description: "Rich chocolate brownies",
    image: { src: PLACEHOLDER, alt: "Brownies" },
    count: 6,
  },
  {
    id: 3,
    name: "Macarons",
    slug: "macarons",
    description: "Delicate French macarons",
    image: { src: PLACEHOLDER, alt: "Macarons" },
    count: 8,
  },
  {
    id: 4,
    name: "Tea Cakes",
    slug: "tea-cakes",
    description: "Elegant tea-time cakes",
    image: { src: PLACEHOLDER, alt: "Tea Cakes" },
    count: 5,
  },
  {
    id: 5,
    name: "Cupcakes",
    slug: "cupcakes",
    description: "Handcrafted cupcakes",
    image: { src: PLACEHOLDER, alt: "Cupcakes" },
    count: 10,
  },
  {
    id: 6,
    name: "Bento Cakes",
    slug: "bento-cakes",
    description: "Personal-sized bento cakes",
    image: { src: PLACEHOLDER, alt: "Bento Cakes" },
    count: 7,
  },
];

export const mockProducts: Product[] = [
  {
    id: 101,
    name: "Classic chocolate truffle cake",
    slug: "classic-chocolate-truffle-cake",
    description: "Rich chocolate truffle cake",
    price: 1899,
    priceHtml: "₹ 1899",
    image: {
      src: "/images/placeholders/product.svg",
      alt: "Classic chocolate truffle cake",
    },
    permalink: "/cakes/classic-chocolate-truffle-cake",
  },
  {
    id: 102,
    name: "Cereal milk cupcake (Box of 4)",
    slug: "cereal-milk-cupcake-box-of-4",
    description: "Cereal milk cupcakes",
    price: 500,
    priceHtml: "₹ 500",
    image: {
      src: "/images/placeholders/product.svg",
      alt: "Cereal milk cupcake (Box of 4)",
    },
    permalink: "/cakes/cereal-milk-cupcake-box-of-4",
  },
  {
    id: 103,
    name: "Nutella Cheesecake",
    slug: "nutella-cheesecake",
    description: "Creamy Nutella cheesecake",
    price: 1899,
    priceHtml: "₹ 1899",
    image: {
      src: "/images/placeholders/product.svg",
      alt: "Nutella Cheesecake",
    },
    permalink: "/cakes/nutella-cheesecake",
  },
];
