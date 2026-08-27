import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getCartWithSession,
  getItemsCountFromCart,
  mapStoreCartToCart,
} from "@/lib/woocommerce/cart-server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const { session: nextSession, cart } = await getCartWithSession(
      session.cartToken,
      session.nonce,
    );
    const mappedCart = mapStoreCartToCart(cart);
    const response = NextResponse.json({
      cart: mappedCart,
      itemsCount: getItemsCountFromCart(cart),
    });

    applyCartSessionCookies(response, nextSession);
    return response;
  } catch {
    const emptyCart = mapStoreCartToCart({ items: [] });
    return NextResponse.json({
      cart: emptyCart,
      itemsCount: 0,
    });
  }
}
