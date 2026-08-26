import { getWordPressUrl } from "@/lib/woocommerce/client";

const CART_TOKEN_COOKIE = "viola_cart_token";
const CART_NONCE_COOKIE = "viola_cart_nonce";

interface CartSession {
  cartToken: string;
  nonce: string;
}

interface StoreCartItem {
  quantity: number;
}

interface StoreCart {
  items: StoreCartItem[];
}

function getItemsCount(cart: StoreCart): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}

async function fetchCartSession(
  cartToken?: string,
): Promise<{ session: CartSession; cart: StoreCart }> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  const response = await fetch(
    new URL("/wp-json/wc/store/v1/cart", getWordPressUrl()).toString(),
    {
      headers,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Cart session error: ${response.status}`);
  }

  const nextCartToken = response.headers.get("cart-token") ?? cartToken ?? "";
  const nonce = response.headers.get("nonce") ?? "";
  const cart = (await response.json()) as StoreCart;

  return {
    session: {
      cartToken: nextCartToken,
      nonce,
    },
    cart,
  };
}

export async function getCartWithSession(cartToken?: string) {
  return fetchCartSession(cartToken);
}

export async function addItemToCart(
  session: CartSession,
  payload: {
    id: number;
    quantity: number;
    cakeMessage?: string;
    deliveryPincode?: string;
    deliveryDate?: string;
    deliverySlot?: string;
    deliveryZone?: string;
  },
): Promise<{ session: CartSession; cart: StoreCart }> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (session.cartToken) {
    headers["Cart-Token"] = session.cartToken;
  }

  if (session.nonce) {
    headers["Nonce"] = session.nonce;
  }

  const body: Record<string, unknown> = {
    id: payload.id,
    quantity: payload.quantity,
  };

  if (
    payload.cakeMessage ||
    payload.deliveryPincode ||
    payload.deliveryDate ||
    payload.deliverySlot
  ) {
    body.extensions = {
      viola_commerce: {
        cake_message: payload.cakeMessage ?? "",
        delivery_pincode: payload.deliveryPincode ?? "",
        delivery_date: payload.deliveryDate ?? "",
        delivery_slot: payload.deliverySlot ?? "",
        delivery_zone: payload.deliveryZone ?? "",
      },
    };
  }

  const response = await fetch(
    new URL("/wp-json/wc/store/v1/cart/add-item", getWordPressUrl()).toString(),
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Add to cart failed: ${response.status}`);
  }

  const nextCartToken = response.headers.get("cart-token") ?? session.cartToken;
  const nonce = response.headers.get("nonce") ?? session.nonce;
  const cart = (await response.json()) as StoreCart;

  return {
    session: {
      cartToken: nextCartToken,
      nonce,
    },
    cart,
  };
}

export function applyCartSessionCookies(
  response: { cookies: { set: (name: string, value: string, options?: { path?: string; maxAge?: number; sameSite?: "lax" | "strict" | "none" }) => void } },
  session: CartSession,
): void {
  const options = {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax" as const,
  };

  if (session.cartToken) {
    response.cookies.set(CART_TOKEN_COOKIE, session.cartToken, options);
  }

  if (session.nonce) {
    response.cookies.set(CART_NONCE_COOKIE, session.nonce, options);
  }
}

export function getCartTokenFromCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CART_TOKEN_COOKIE}=`));

  if (!match) {
    return undefined;
  }

  return decodeURIComponent(match.slice(CART_TOKEN_COOKIE.length + 1));
}

export function getItemsCountFromCart(cart: StoreCart): number {
  return getItemsCount(cart);
}

export { CART_TOKEN_COOKIE, CART_NONCE_COOKIE };
