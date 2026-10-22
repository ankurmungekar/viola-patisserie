import type { OrderTracking } from "@/types/order-tracking";

export async function trackOrder(
  orderNumber: string,
  email: string,
): Promise<OrderTracking> {
  const response = await fetch("/api/orders/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderNumber: orderNumber.trim(),
      email: email.trim(),
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | OrderTracking
    | { message?: string }
    | null;

  if (!response.ok) {
    const message =
      data && "message" in data && data.message
        ? data.message
        : "We couldn't find an order with those details.";
    throw new Error(message);
  }

  return data as OrderTracking;
}
