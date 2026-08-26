import { DEFAULT_CATEGORY_IMAGE } from "@/lib/config/categories";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import type { Category } from "@/types/category";
import type { Product, ProductDetail } from "@/types/product";

import { DEFAULT_STORAGE_INSTRUCTIONS } from "@/lib/config/product-defaults";

const classicTruffleDetail: ProductDetail = {
  id: 102,
  name: "Classic chocolate truffle cake",
  slug: "classic-chocolate-truffle-cake",
  description:
    "A timeless indulgence crafted with layers of moist chocolate sponge, silky dark chocolate ganache, and finished with a smooth truffle glaze. Rich, decadent, and perfect for every celebration.",
  shortDescription:
    "A timeless indulgence crafted with layers of moist chocolate sponge, silky dark chocolate ganache, and finished with a smooth truffle glaze. Rich, decadent, and perfect for every celebration.",
  storageInstructions: DEFAULT_STORAGE_INSTRUCTIONS,
  price: 895,
  priceHtml: "₹ 895",
  image: {
    src: DEFAULT_PRODUCT_IMAGE,
    alt: "Classic chocolate truffle cake",
  },
  images: [
    { src: DEFAULT_PRODUCT_IMAGE, alt: "Classic chocolate truffle cake" },
    { src: DEFAULT_PRODUCT_IMAGE, alt: "Classic chocolate truffle cake side view" },
    { src: DEFAULT_PRODUCT_IMAGE, alt: "Classic chocolate truffle cake detail" },
    { src: DEFAULT_PRODUCT_IMAGE, alt: "Classic chocolate truffle cake slice" },
  ],
  categories: [{ slug: "cakes", name: "Cakes" }],
  primaryCategory: { slug: "cakes", name: "Cakes" },
  permalink: "/collections/cakes/classic-chocolate-truffle-cake",
  type: "variable",
  attributes: [
    {
      name: "Weight",
      options: ["500 g", "1Kg", "1.5Kg", "2Kg"],
    },
  ],
  variations: [
    {
      id: 1021,
      attributes: [{ name: "Weight", value: "500 g" }],
      price: 895,
      priceHtml: "₹ 895",
      inStock: true,
    },
    {
      id: 1022,
      attributes: [{ name: "Weight", value: "1Kg" }],
      price: 1599,
      priceHtml: "₹ 1599",
      inStock: true,
    },
    {
      id: 1023,
      attributes: [{ name: "Weight", value: "1.5Kg" }],
      price: 2199,
      priceHtml: "₹ 2199",
      inStock: true,
    },
    {
      id: 1024,
      attributes: [{ name: "Weight", value: "2Kg" }],
      price: 2799,
      priceHtml: "₹ 2799",
      inStock: true,
    },
  ],
};

function toProduct(detail: ProductDetail): Product {
  return {
    id: detail.id,
    name: detail.name,
    slug: detail.slug,
    description: detail.description,
    price: detail.price,
    priceHtml: detail.priceHtml,
    image: detail.image,
    permalink: detail.permalink,
  };
}

export const mockProductDetails: Record<string, ProductDetail> = {
  "classic-chocolate-truffle-cake": classicTruffleDetail,
  "nutella-cheesecake": {
    ...classicTruffleDetail,
    id: 101,
    name: "Nutella Cheesecake",
    slug: "nutella-cheesecake",
    price: 1899,
    priceHtml: "₹ 1899",
    permalink: "/collections/cakes/nutella-cheesecake",
    variations: [
      {
        id: 1011,
        attributes: [{ name: "Weight", value: "500 g" }],
        price: 1899,
        priceHtml: "₹ 1899",
        inStock: true,
      },
    ],
  },
  "cereal-milk-cupcake-box-of-4": {
    ...classicTruffleDetail,
    id: 103,
    name: "Cereal milk cupcake (Box Of 4)",
    slug: "cereal-milk-cupcake-box-of-4",
    price: 500,
    priceHtml: "₹ 500",
    permalink: "/collections/cupcakes/cereal-milk-cupcake-box-of-4",
    primaryCategory: { slug: "cupcakes", name: "Cupcakes" },
    categories: [{ slug: "cupcakes", name: "Cupcakes" }],
    variations: [
      {
        id: 1031,
        attributes: [{ name: "Weight", value: "Box of 4" }],
        price: 500,
        priceHtml: "₹ 500",
        inStock: true,
      },
    ],
  },
};

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
  {
    id: 7,
    name: "Floral Cupcakes",
    slug: "floral-cupcakes",
    description: "Handcrafted floral cupcakes",
    image: { src: DEFAULT_CATEGORY_IMAGE, alt: "Floral Cupcakes" },
    count: 4,
  },
  {
    id: 8,
    name: "Cheesecakes",
    slug: "cheesecakes",
    description: "Creamy artisan cheesecakes",
    image: { src: DEFAULT_CATEGORY_IMAGE, alt: "Cheesecakes" },
    count: 6,
  },
];

export const mockProducts: Product[] = [
  toProduct(mockProductDetails["nutella-cheesecake"]),
  toProduct(classicTruffleDetail),
  toProduct(mockProductDetails["cereal-milk-cupcake-box-of-4"]),
  toProduct(mockProductDetails["nutella-cheesecake"]),
];
