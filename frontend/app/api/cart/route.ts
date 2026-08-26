import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CART_TOKEN_COOKIE,
  applyCartSessionCookies,
  getCartWithSession,
  getItemsCountFromCart,
} from "@/lib/woocommerce/cart-server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
    const { session, cart } = await getCartWithSession(cartToken);
    const response = NextResponse.json({
      itemsCount: getItemsCountFromCart(cart),
    });

    applyCartSessionCookies(response, session);
    return response;
  } catch {
    return NextResponse.json({ itemsCount: 0 });
  }
}
