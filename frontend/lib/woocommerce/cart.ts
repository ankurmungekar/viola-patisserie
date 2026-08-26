export interface AddToCartPayload {
  id: number;
  quantity: number;
  cakeMessage?: string;
  deliveryPincode?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  deliveryZone?: string;
}

export interface AddToCartResult {
  itemsCount: number;
}

export async function addToCart(
  payload: AddToCartPayload,
): Promise<AddToCartResult> {
  const response = await fetch("/api/cart/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;

    throw new Error(error?.message ?? "Failed to add item to cart");
  }

  return (await response.json()) as AddToCartResult;
}

export async function getCartItemsCount(): Promise<number> {
  const response = await fetch("/api/cart", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return 0;
  }

  const data = (await response.json()) as { itemsCount: number };
  return data.itemsCount;
}
