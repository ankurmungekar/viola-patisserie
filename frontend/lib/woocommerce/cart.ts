import type { Cart, CartResponse } from "@/types/cart";
import type {
  CheckoutData,
  CheckoutFormData,
  PlaceOrderResult,
  VerifyPaymentPayload,
  VerifyPaymentResult,
} from "@/types/checkout";

export interface AddToCartPayload {
  id: number;
  quantity: number;
  variation?: { attribute: string; value: string }[];
  cakeMessage?: string;
  deliveryPincode?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  deliveryZone?: string;
}

export interface AddToCartResult {
  itemsCount: number;
}

function dispatchCartUpdated(itemsCount: number) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("viola:cart-updated", {
        detail: { itemsCount },
      }),
    );
  }
}

async function parseError(response: Response): Promise<string> {
  const error = (await response.json().catch(() => null)) as {
    message?: string;
  } | null;

  if (!error?.message) {
    return "Something went wrong. Please try again.";
  }

  try {
    const nested = JSON.parse(error.message) as { message?: string };
    if (nested.message) {
      return nested.message.replace(/<[^>]+>/g, "").trim();
    }
  } catch {
    // message is plain text
  }

  return error.message.replace(/<[^>]+>/g, "").trim();
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
    throw new Error(await parseError(response));
  }

  const result = (await response.json()) as AddToCartResult;
  dispatchCartUpdated(result.itemsCount);
  return result;
}

export async function getCart(): Promise<CartResponse> {
  const response = await fetch("/api/cart", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as CartResponse;
}

export async function getCartItemsCount(): Promise<number> {
  try {
    const data = await getCart();
    return data.itemsCount;
  } catch {
    return 0;
  }
}

export async function updateCartItem(
  key: string,
  quantity: number,
): Promise<CartResponse> {
  const response = await fetch("/api/cart/update-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, quantity }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result = (await response.json()) as CartResponse;
  dispatchCartUpdated(result.itemsCount);
  return result;
}

export async function updateCartDeliverySchedule(payload: {
  deliveryDate: string;
  deliverySlot: string;
  deliveryPincode?: string;
  deliveryZone?: string;
}): Promise<CartResponse> {
  const response = await fetch("/api/cart/update-delivery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result = (await response.json()) as CartResponse;
  dispatchCartUpdated(result.itemsCount);
  return result;
}

export async function removeCartItem(key: string): Promise<CartResponse> {
  const response = await fetch("/api/cart/remove-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key }),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result = (await response.json()) as CartResponse;
  dispatchCartUpdated(result.itemsCount);
  return result;
}

export async function getCheckoutData(): Promise<CheckoutData> {
  const response = await fetch("/api/checkout", {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as CheckoutData;
}

export async function placeOrder(
  data: CheckoutFormData,
): Promise<PlaceOrderResult> {
  const response = await fetch("/api/checkout/place-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as PlaceOrderResult;
}

export async function verifyRazorpayPayment(
  payload: VerifyPaymentPayload,
): Promise<VerifyPaymentResult> {
  const response = await fetch("/api/payment/razorpay/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const result = (await response.json()) as VerifyPaymentResult;
  dispatchCartUpdated(0);
  return result;
}

export async function clearCart(): Promise<void> {
  await fetch("/api/cart/clear", {
    method: "POST",
    credentials: "include",
  });
  dispatchCartUpdated(0);
}

export type { Cart };
