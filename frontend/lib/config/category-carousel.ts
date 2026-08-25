export const CATEGORY_CARD_WIDTH = 295;
export const CATEGORY_CARD_GAP = 20;
export const CATEGORY_CAROUSEL_VISIBLE = 4;

export const CATEGORY_CAROUSEL_CONTENT_WIDTH =
  CATEGORY_CARD_WIDTH * CATEGORY_CAROUSEL_VISIBLE +
  CATEGORY_CARD_GAP * (CATEGORY_CAROUSEL_VISIBLE - 1);

export function getCategoryCarouselOffset(containerWidth: number): number {
  if (containerWidth <= CATEGORY_CAROUSEL_CONTENT_WIDTH) {
    return 16;
  }

  return (containerWidth - CATEGORY_CAROUSEL_CONTENT_WIDTH) / 2;
}
