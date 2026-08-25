export const DEFAULT_CATEGORY_IMAGE = "/images/cake-category.png";

export const categoryBackgrounds: Record<string, string> = {
  cakes: "#EADDD2",
  brownies: "#E8D5C4",
  macarons: "#E8EDE4",
  "tea-cakes": "#F0E6D8",
  cupcakes: "#F4E8F0",
  "bento-cakes": "#EAE0F5",
};

export function getCategoryBackground(slug: string): string {
  return categoryBackgrounds[slug] ?? "#EADDD2";
}
