import type { Cart } from "@/types/cart";

export function checkDeliveryMetaConflict(cart: Cart): {
  hasConflict: boolean;
  message: string;
} {
  if (cart.items.length <= 1) {
    return { hasConflict: false, message: "" };
  }

  const reference = cart.items[0]?.extensions;
  if (!reference) {
    return { hasConflict: false, message: "" };
  }

  const hasConflict = cart.items.some((item) => {
    const ext = item.extensions;
    return (
      ext.deliveryPincode !== reference.deliveryPincode ||
      ext.deliveryDate !== reference.deliveryDate ||
      ext.deliverySlot !== reference.deliverySlot
    );
  });

  return {
    hasConflict,
    message: hasConflict
      ? "Items in your cart have different delivery details. Please review each item before checkout."
      : "",
  };
}
