import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getCartWithSession,
  mapStoreCartToCart,
} from "@/lib/woocommerce/cart-server";
import { placeOrder } from "@/lib/woocommerce/checkout-server";
import { checkDeliveryMetaConflict } from "@/lib/utils/cart-delivery";
import type { CheckoutFormData } from "@/types/checkout";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutFormData;
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const { cart } = await getCartWithSession(session.cartToken, session.nonce);
    const mappedCart = mapStoreCartToCart(cart);
    const conflict = checkDeliveryMetaConflict(mappedCart);

    if (conflict.hasConflict) {
      return NextResponse.json({ message: conflict.message }, { status: 400 });
    }

    if (mappedCart.itemsCount === 0) {
      return NextResponse.json(
        { message: "Your cart is empty." },
        { status: 400 },
      );
    }

    const result = await placeOrder(session, body, body.customerNote);
    const response = NextResponse.json(result.result);

    applyCartSessionCookies(response, result.session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Unable to place order",
      },
      { status: 400 },
    );
  }
}
