export const HIDDEN_PRODUCT_VARIATION_ATTRIBUTES = [
  "flavour",
  "dietary",
] as const;

export function isHiddenProductVariationAttribute(name: string): boolean {
  return HIDDEN_PRODUCT_VARIATION_ATTRIBUTES.includes(
    name.toLowerCase() as (typeof HIDDEN_PRODUCT_VARIATION_ATTRIBUTES)[number],
  );
}
