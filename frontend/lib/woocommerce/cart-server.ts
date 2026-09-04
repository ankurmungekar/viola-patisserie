import { getWordPressUrl } from "@/lib/woocommerce/client";
import type { Cart, CartItem, CartItemExtensions } from "@/types/cart";
import { formatPrice } from "@/lib/utils/format-price";

const CART_TOKEN_COOKIE = "viola_cart_token";
const CART_NONCE_COOKIE = "viola_cart_nonce";

export interface CartSession {
  cartToken: string;
  nonce: string;
}

interface StoreCartImage {
  src?: string;
  thumbnail?: string;
  alt?: string;
}

interface StoreCartItemExtensions {
  viola_commerce?: {
    cake_message?: string;
    delivery_pincode?: string;
    delivery_date?: string;
    delivery_slot?: string;
    delivery_zone?: string;
  };
}

interface StoreCartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  permalink?: string;
  images?: StoreCartImage[];
  totals?: {
    line_total?: string;
    currency_minor_unit?: number;
  };
  prices?: {
    price?: string;
    currency_minor_unit?: number;
  };
  extensions?: StoreCartItemExtensions;
}

interface StoreCartTotals {
  total_items?: string;
  total_shipping?: string;
  total_tax?: string;
  total_price?: string;
  currency_code?: string;
  currency_minor_unit?: number;
}

export interface StoreCart {
  items: StoreCartItem[];
  totals?: StoreCartTotals;
  items_count?: number;
  needs_shipping?: boolean;
  has_calculated_shipping?: boolean;
}

function parseMinorUnits(
  amount: string | undefined,
  minorUnit = 2,
): number {
  if (!amount) {
    return 0;
  }

  const value = Number.parseInt(amount, 10);
  if (Number.isNaN(value)) {
    return 0;
  }

  return value / 10 ** minorUnit;
}

function formatMinorUnits(
  amount: string | undefined,
  minorUnit = 2,
): string {
  return formatPrice(parseMinorUnits(amount, minorUnit));
}

function mapExtensions(
  extensions?: StoreCartItemExtensions,
): CartItemExtensions {
  const viola = extensions?.viola_commerce;

  return {
    cakeMessage: viola?.cake_message ?? "",
    deliveryPincode: viola?.delivery_pincode ?? "",
    deliveryDate: viola?.delivery_date ?? "",
    deliverySlot: viola?.delivery_slot ?? "",
    deliveryZone: viola?.delivery_zone ?? "",
  };
}

function mapCartItem(item: StoreCartItem): CartItem {
  const minorUnit =
    item.totals?.currency_minor_unit ??
    item.prices?.currency_minor_unit ??
    2;
  const image = item.images?.[0];

  return {
    key: item.key,
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    permalink: item.permalink ?? "",
    image: {
      src: image?.src ?? image?.thumbnail ?? "",
      alt: image?.alt ?? item.name,
      thumbnail: image?.thumbnail,
    },
    lineTotal: formatMinorUnits(item.totals?.line_total, minorUnit),
    lineTotalMinor: parseMinorUnits(item.totals?.line_total, minorUnit),
    unitPrice: formatMinorUnits(item.prices?.price, minorUnit),
    extensions: mapExtensions(item.extensions),
  };
}

export function mapStoreCartToCart(cart: StoreCart): Cart {
  const minorUnit = cart.totals?.currency_minor_unit ?? 2;
  const items = (cart.items ?? []).map(mapCartItem);
  const subtotalMinor = parseMinorUnits(cart.totals?.total_items, minorUnit);
  const shippingMinor = parseMinorUnits(cart.totals?.total_shipping, minorUnit);
  const totalMinor = parseMinorUnits(cart.totals?.total_price, minorUnit);
  const taxMinor =
    parseMinorUnits(cart.totals?.total_tax, minorUnit) ||
    Math.max(0, totalMinor - subtotalMinor - shippingMinor);
  const taxRate =
    subtotalMinor > 0 ? Math.round((taxMinor / subtotalMinor) * 100) : 18;

  return {
    items,
    totals: {
      subtotal: formatMinorUnits(cart.totals?.total_items, minorUnit),
      shipping: formatMinorUnits(cart.totals?.total_shipping, minorUnit),
      tax:
        parseMinorUnits(cart.totals?.total_tax, minorUnit) > 0
          ? formatMinorUnits(cart.totals?.total_tax, minorUnit)
          : formatPrice(taxMinor),
      total: formatMinorUnits(cart.totals?.total_price, minorUnit),
      subtotalMinor,
      shippingMinor,
      taxMinor,
      totalMinor,
      currencyCode: cart.totals?.currency_code ?? "INR",
      taxLabel: taxMinor > 0 ? `Taxes (${taxRate}%)` : "Taxes (18%)",
    },
    itemsCount: cart.items_count ?? getItemsCount(cart),
    needsShipping: cart.needs_shipping ?? false,
    hasCalculatedShipping: cart.has_calculated_shipping ?? false,
  };
}

function getItemsCount(cart: StoreCart): number {
  return (cart.items ?? []).reduce((total, item) => total + item.quantity, 0);
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
    throw new Error(errorBody || `Store API error: ${response.status}`);
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

async function fetchCartSession(
  cartToken?: string,
  nonce?: string,
): Promise<{ session: CartSession; cart: StoreCart }> {
  const session: CartSession = {
    cartToken: cartToken ?? "",
    nonce: nonce ?? "",
  };
  const result = await fetchWithCartSession<StoreCart>("/cart", session);

  return {
    session: result.session,
    cart: result.data,
  };
}

export async function getCartWithSession(
  cartToken?: string,
  nonce?: string,
) {
  return fetchCartSession(cartToken, nonce);
}

export async function getCartSessionFromCookies(cookieStore: {
  get: (name: string) => { value: string } | undefined;
}): Promise<CartSession> {
  const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value ?? "";
  const nonce = cookieStore.get(CART_NONCE_COOKIE)?.value ?? "";

  if (cartToken && nonce) {
    return { cartToken, nonce };
  }

  const { session } = await getCartWithSession(cartToken || undefined);
  return session;
}

export async function addItemToCart(
  session: CartSession,
  payload: {
    id: number;
    quantity: number;
    variation?: { attribute: string; value: string }[];
    cakeMessage?: string;
    deliveryPincode?: string;
    deliveryDate?: string;
    deliverySlot?: string;
    deliveryZone?: string;
  },
): Promise<{ session: CartSession; cart: StoreCart }> {
  const body: Record<string, unknown> = {
    id: payload.id,
    quantity: payload.quantity,
  };

  if (payload.variation && payload.variation.length > 0) {
    body.variation = payload.variation;
  }

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

  const result = await fetchWithCartSession<StoreCart>(
    "/cart/add-item",
    session,
    {
      method: "POST",
      body,
    },
  );

  return {
    session: result.session,
    cart: result.data,
  };
}

export async function updateCartItem(
  session: CartSession,
  key: string,
  quantity: number,
): Promise<{ session: CartSession; cart: StoreCart }> {
  const result = await fetchWithCartSession<StoreCart>(
    "/cart/update-item",
    session,
    {
      method: "POST",
      body: { key, quantity },
    },
  );

  return {
    session: result.session,
    cart: result.data,
  };
}

export async function updateCartDeliverySchedule(
  session: CartSession,
  payload: {
    deliveryDate: string;
    deliverySlot: string;
    deliveryPincode?: string;
    deliveryZone?: string;
  },
): Promise<void> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (session.cartToken) {
    headers["Cart-Token"] = session.cartToken;
  }

  if (session.nonce) {
    headers.Nonce = session.nonce;
  }

  const response = await fetch(
    new URL(
      "/wp-json/viola/v1/cart/delivery-schedule",
      getWordPressUrl(),
    ).toString(),
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        delivery_date: payload.deliveryDate,
        delivery_slot: payload.deliverySlot,
        delivery_pincode: payload.deliveryPincode ?? "",
        delivery_zone: payload.deliveryZone ?? "",
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || `Delivery update error: ${response.status}`);
  }
}

export async function removeCartItem(
  session: CartSession,
  key: string,
): Promise<{ session: CartSession; cart: StoreCart }> {
  const result = await fetchWithCartSession<StoreCart>(
    "/cart/remove-item",
    session,
    {
      method: "POST",
      body: { key },
    },
  );

  return {
    session: result.session,
    cart: result.data,
  };
}

export async function emptyCart(
  session: CartSession,
): Promise<{ session: CartSession }> {
  const result = await fetchWithCartSession<StoreCart>("/cart/items", session, {
    method: "DELETE",
  });

  return {
    session: result.session,
  };
}

export async function updateCartCustomer(
  session: CartSession,
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  },
): Promise<{ session: CartSession; cart: StoreCart }> {
  const billingAddress = {
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

  const result = await fetchWithCartSession<StoreCart>(
    "/cart/update-customer",
    session,
    {
      method: "POST",
      body: {
        billing_address: billingAddress,
        shipping_address: billingAddress,
      },
    },
  );

  return {
    session: result.session,
    cart: result.data,
  };
}

export function applyCartSessionCookies(
  response: {
    cookies: {
      set: (
        name: string,
        value: string,
        options?: {
          path?: string;
          maxAge?: number;
          sameSite?: "lax" | "strict" | "none";
        },
      ) => void;
    };
  },
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

export function clearCartSessionCookies(response: {
  cookies: {
    delete: (name: string) => void;
  };
}): void {
  response.cookies.delete(CART_TOKEN_COOKIE);
  response.cookies.delete(CART_NONCE_COOKIE);
}

export function getCartTokenFromCookie(
  cookieHeader: string | null,
): string | undefined {
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
  return cart.items_count ?? getItemsCount(cart);
}

export { CART_TOKEN_COOKIE, CART_NONCE_COOKIE };
