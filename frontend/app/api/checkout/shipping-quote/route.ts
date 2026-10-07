import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  applyShippingByPostcode,
  getCartSessionFromCookies,
  getItemsCountFromCart,
  mapStoreCartToCart,
} from "@/lib/woocommerce/cart-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pincode?: string };
    const pincode = (body.pincode ?? "").replace(/\D/g, "").slice(0, 6);

    if (pincode.length !== 6) {
      return NextResponse.json(
        { message: "Enter a valid 6-digit pincode." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const { session: nextSession, cart } = await applyShippingByPostcode(
      session,
      pincode,
    );
    const mappedCart = mapStoreCartToCart(cart);
    const response = NextResponse.json({
      cart: mappedCart,
      itemsCount: getItemsCountFromCart(cart),
    });

    applyCartSessionCookies(response, nextSession);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to calculate delivery.",
      },
      { status: 400 },
    );
  }
}
