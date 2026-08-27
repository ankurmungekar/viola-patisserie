import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearCartSessionCookies,
  emptyCart,
  getCartSessionFromCookies,
} from "@/lib/woocommerce/cart-server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);

    try {
      await emptyCart(session);
    } catch {
      // Cart may already be empty after checkout.
    }

    const response = NextResponse.json({ itemsCount: 0 });
    clearCartSessionCookies(response);
    return response;
  } catch {
    const response = NextResponse.json({ itemsCount: 0 });
    clearCartSessionCookies(response);
    return response;
  }
}
