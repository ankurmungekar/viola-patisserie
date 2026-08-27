import { isHiddenProductVariationAttribute } from "@/lib/config/product-variations";
import type { ProductAttribute } from "@/types/product";

export interface CartVariationAttribute {
  attribute: string;
  value: string;
}

function resolveCartAttributeKey(attribute: ProductAttribute): string {
  if (attribute.taxonomy) {
    return attribute.taxonomy;
  }

  return attribute.name;
}

export function resolveAttributeValueSlug(
  attribute: ProductAttribute,
  selectedValue: string,
): string {
  const match = attribute.options.find(
    (option) =>
      option.name === selectedValue ||
      option.slug === selectedValue ||
      option.name.toLowerCase() === selectedValue.toLowerCase(),
  );

  return match?.slug ?? selectedValue;
}

export function buildCartVariationPayload(
  attributes: ProductAttribute[],
  selectedValues: Record<string, string>,
): CartVariationAttribute[] {
  return attributes
    .filter((attribute) => selectedValues[attribute.name])
    .map((attribute) => ({
      attribute: resolveCartAttributeKey(attribute),
      value: resolveAttributeValueSlug(
        attribute,
        selectedValues[attribute.name],
      ),
    }));
}

export function getInitialAttributeSelections(
  attributes: ProductAttribute[],
): Record<string, string> {
  const selections: Record<string, string> = {};

  for (const attribute of attributes) {
    selections[attribute.name] = attribute.options[0]?.name ?? "";
  }

  return selections;
}

export function findMatchingVariation<
  T extends {
    attributes: { name: string; value: string }[];
    inStock: boolean;
  },
>(
  variations: T[],
  attributes: ProductAttribute[],
  selectedValues: Record<string, string>,
): T | null {
  const inStockMatch = variations.find((variation) =>
    variationMatchesSelection(variation, attributes, selectedValues),
  );

  if (inStockMatch) {
    return inStockMatch;
  }

  return (
    variations.find((variation) =>
      variationMatchesSelection(variation, attributes, selectedValues, false),
    ) ?? null
  );
}

function variationMatchesSelection<
  T extends { attributes: { name: string; value: string }[]; inStock: boolean },
>(
  variation: T,
  attributes: ProductAttribute[],
  selectedValues: Record<string, string>,
  requireInStock = true,
): boolean {
  if (requireInStock && !variation.inStock) {
    return false;
  }

  return attributes.every((attribute) => {
    const selected = selectedValues[attribute.name];
    if (!selected) {
      return true;
    }

    const variationAttribute = variation.attributes.find(
      (item) => item.name.toLowerCase() === attribute.name.toLowerCase(),
    );

    if (!variationAttribute?.value) {
      return true;
    }

    const selectedSlug = resolveAttributeValueSlug(attribute, selected);

    return (
      variationAttribute.value === selected ||
      variationAttribute.value === selectedSlug ||
      variationAttribute.value.toLowerCase() === selected.toLowerCase()
    );
  });
}

export function getVariationAttributes(
  attributes: ProductAttribute[],
): ProductAttribute[] {
  return attributes.filter((attribute) => attribute.options.length > 0);
}

export function getVisibleVariationAttributes(
  attributes: ProductAttribute[],
): ProductAttribute[] {
  return getVariationAttributes(attributes).filter(
    (attribute) => !isHiddenProductVariationAttribute(attribute.name),
  );
}

export function getHiddenVariationAttributes(
  attributes: ProductAttribute[],
): ProductAttribute[] {
  return getVariationAttributes(attributes).filter((attribute) =>
    isHiddenProductVariationAttribute(attribute.name),
  );
}

function resolveHiddenAttributeValue(
  attribute: ProductAttribute,
  matchedVariation: { attributes: { name: string; value: string }[] } | null,
): string {
  const variationValue = matchedVariation?.attributes.find(
    (item) => item.name.toLowerCase() === attribute.name.toLowerCase(),
  )?.value;

  if (variationValue) {
    const option = attribute.options.find(
      (item) =>
        item.slug === variationValue ||
        item.name === variationValue ||
        item.name.toLowerCase() === variationValue.toLowerCase(),
    );

    return option?.name ?? variationValue;
  }

  return attribute.options[0]?.name ?? "";
}

export function resolveCartAttributeSelections(
  attributes: ProductAttribute[],
  visibleSelections: Record<string, string>,
  matchedVariation: { attributes: { name: string; value: string }[] } | null,
): Record<string, string> {
  const resolved = { ...visibleSelections };

  for (const attribute of getHiddenVariationAttributes(attributes)) {
    resolved[attribute.name] = resolveHiddenAttributeValue(
      attribute,
      matchedVariation,
    );
  }

  return resolved;
}
