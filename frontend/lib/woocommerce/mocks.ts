import { DEFAULT_CATEGORY_IMAGE } from "@/lib/config/categories";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Cakes",
    slug: "cakes",
    description: "Classic and celebration cakes",
    image: { src: "/images/cake-category.png", alt: "Cakes" },
    count: 12,
  },
  {
    id: 2,
    name: "Brownies",
    slug: "brownies",
    description: "Rich chocolate brownies",
    image: { src: "/images/cake-category.png", alt: "Brownies" },
    count: 6,
  },
  {
    id: 3,
    name: "Macarons",
    slug: "macarons",
    description: "Delicate French macarons",
    image: { src: "/images/macarons-category.jpg", alt: "Macarons" },
    count: 8,
  },
  {
    id: 4,
    name: "Tea Cakes",
    slug: "tea-cakes",
    description: "Elegant tea-time cakes",
    image: { src: "/images/tea-cake-category.jpg", alt: "Tea Cakes" },
    count: 5,
  },
  {
    id: 5,
    name: "Cupcakes",
    slug: "cupcakes",
    description: "Handcrafted cupcakes",
    image: { src: DEFAULT_CATEGORY_IMAGE, alt: "Cupcakes" },
    count: 10,
  },
  {
    id: 6,
    name: "Bento Cakes",
    slug: "bento-cakes",
    description: "Personal-sized bento cakes",
    image: { src: "/images/bento-cake-category.jpg", alt: "Bento Cakes" },
    count: 7,
  },
];

export const mockProducts: Product[] = [
  {
    id: 101,
    name: "Nutella Cheesecake",
    slug: "nutella-cheesecake",
    description: "Creamy Nutella cheesecake",
    price: 1899,
    priceHtml: "₹ 1899",
    image: {
      src: DEFAULT_PRODUCT_IMAGE,
      alt: "Nutella Cheesecake",
    },
    permalink: "/cakes/nutella-cheesecake",
  },
  {
    id: 102,
    name: "Classic chocolate truffle cake",
    slug: "classic-chocolate-truffle-cake",
    description: "Rich chocolate truffle cake",
    price: 1899,
    priceHtml: "₹ 1899",
    image: {
      src: DEFAULT_PRODUCT_IMAGE,
      alt: "Classic chocolate truffle cake",
    },
    permalink: "/cakes/classic-chocolate-truffle-cake",
  },
  {
    id: 103,
    name: "Cereal milk cupcake (Box Of 4)",
    slug: "cereal-milk-cupcake-box-of-4",
    description: "Cereal milk cupcakes",
    price: 500,
    priceHtml: "₹ 500",
    image: {
      src: DEFAULT_PRODUCT_IMAGE,
      alt: "Cereal milk cupcake (Box Of 4)",
    },
    permalink: "/cakes/cereal-milk-cupcake-box-of-4",
  },
  {
    id: 104,
    name: "Nutella Cheesecake",
    slug: "nutella-cheesecake-2",
    description: "Creamy Nutella cheesecake",
    price: 1899,
    priceHtml: "₹ 1899",
    image: {
      src: DEFAULT_PRODUCT_IMAGE,
      alt: "Nutella Cheesecake",
    },
    permalink: "/cakes/nutella-cheesecake",
  },
];
