import { getWordPressUrl } from "@/lib/woocommerce/client";
import {
  type CartSession,
  getCartWithSession,
  mapStoreCartToCart,
  updateCartCustomer,
} from "@/lib/woocommerce/cart-server";
import type { CheckoutAddress, PlaceOrderResult } from "@/types/checkout";

interface StoreCheckoutPaymentMethod {
  id: string;
  title: string;
  description: string;
}

interface StoreCheckoutResponse {
  order_id?: number;
  order_key?: string;
  status?: string;
  payment_methods?: StoreCheckoutPaymentMethod[];
  order?: {
    id: number;
    order_key: string;
    status: string;
  };
}

function parseStoreApiError(errorBody: string): string {
  try {
    const parsed = JSON.parse(errorBody) as {
      message?: string;
      code?: string;
    };

    if (parsed.message) {
      return parsed.message.replace(/<[^>]+>/g, "").trim();
    }
  } catch {
    // plain text response
  }

  return errorBody.replace(/<[^>]+>/g, "").trim() || "Store API checkout failed";
}

function resolveCheckoutOrder(data: StoreCheckoutResponse): {
  id: number;
  orderKey: string;
  status: string;
} | null {
  const id = data.order_id ?? data.order?.id;
  const orderKey = data.order_key ?? data.order?.order_key ?? "";
  const status = data.status ?? data.order?.status ?? "";

  if (!id) {
    return null;
  }

  return { id, orderKey, status };
}
interface RazorpayCreateResponse {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

async function fetchWithCartSession<T>(
  path: string,
  session: CartSession,
  options: {
    method?: string;
    body?: Record<string, unknown>;
  } = {},
): Promise<{ session: CartSession; data: T }> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (session.cartToken) {
    headers["Cart-Token"] = session.cartToken;
  }

  if (session.nonce) {
    headers["Nonce"] = session.nonce;
  }

  if (options.body) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(
    new URL(`/wp-json/wc/store/v1${path}`, getWordPressUrl()).toString(),
    {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(parseStoreApiError(errorBody) || `Store API error: ${response.status}`);
  }

  const nextCartToken =
    response.headers.get("cart-token") ?? session.cartToken ?? "";
  const nonce = response.headers.get("nonce") ?? session.nonce;
  const data = (await response.json()) as T;

  return {
    session: {
      cartToken: nextCartToken,
      nonce,
    },
    data,
  };
}

function mapAddress(address: CheckoutAddress) {
  return {
    first_name: address.firstName,
    last_name: address.lastName,
    address_1: address.address1,
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    country: address.country,
    email: address.email,
    phone: address.phone,
  };
}

export async function getCheckoutData(session: CartSession) {
  const result = await fetchWithCartSession<StoreCheckoutResponse>(
    "/checkout",
    session,
  );
  const { cart } = await getCartWithSession(session.cartToken, session.nonce);

  return {
    session: result.session,
    checkout: {
      paymentMethods: (result.data.payment_methods ?? []).map((method) => ({
        id: method.id,
        title: method.title,
        description: method.description,
      })),
      cart: mapStoreCartToCart(cart),
    },
  };
}

export async function placeOrder(
  session: CartSession,
  address: CheckoutAddress,
  customerNote?: string,
): Promise<{ session: CartSession; result: PlaceOrderResult }> {
  const customerUpdate = await updateCartCustomer(session, address);
  const billingAddress = mapAddress(address);

  const checkoutResult = await fetchWithCartSession<StoreCheckoutResponse>(
    "/checkout",
    customerUpdate.session,
    {
      method: "POST",
      body: {
        billing_address: billingAddress,
        shipping_address: billingAddress,
        payment_method: "razorpay",
        customer_note: customerNote ?? "",
      },
    },
  );

  const order = resolveCheckoutOrder(checkoutResult.data);

  if (!order) {
    throw new Error("Unable to create order. Please try again.");
  }

  let razorpay: PlaceOrderResult["razorpay"] = null;

  try {
    const razorpayResponse = await fetch(
      new URL(
        "/wp-json/viola/v1/checkout/razorpay/create",
        getWordPressUrl(),
      ).toString(),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: order.id }),
        cache: "no-store",
      },
    );

    if (razorpayResponse.ok) {
      const data = (await razorpayResponse.json()) as RazorpayCreateResponse;
      razorpay = {
        keyId: data.keyId,
        orderId: data.razorpayOrderId,
        amount: data.amount,
        currency: data.currency,
      };
    }
  } catch {
    razorpay = null;
  }

  return {
    session: checkoutResult.session,
    result: {
      orderId: order.id,
      orderKey: order.orderKey,
      status: order.status,
      razorpay,
    },
  };
}

export async function verifyRazorpayPayment(payload: {
  orderId: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const response = await fetch(
    new URL(
      "/wp-json/viola/v1/checkout/razorpay/verify",
      getWordPressUrl(),
    ).toString(),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: payload.orderId,
        razorpay_order_id: payload.razorpayOrderId,
        razorpay_payment_id: payload.razorpayPaymentId,
        razorpay_signature: payload.razorpaySignature,
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
      code?: string;
    } | null;
    throw new Error(
      error?.message ?? error?.code ?? "Payment verification failed",
    );
  }

  return (await response.json()) as {
    success: boolean;
    orderId: number;
    status: string;
  };
}

