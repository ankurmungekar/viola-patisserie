import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getCartWithSession,
  mapStoreCartToCart,
  updateCartDeliverySchedule,
} from "@/lib/woocommerce/cart-server";

interface UpdateDeliveryBody {
  deliveryDate: string;
  deliverySlot: string;
  deliveryPincode?: string;
  deliveryZone?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UpdateDeliveryBody;
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);

    await updateCartDeliverySchedule(session, {
      deliveryDate: body.deliveryDate,
      deliverySlot: body.deliverySlot,
      deliveryPincode: body.deliveryPincode,
      deliveryZone: body.deliveryZone,
    });

    const { session: nextSession, cart } = await getCartWithSession(
      session.cartToken,
      session.nonce,
    );

    const response = NextResponse.json({
      cart: mapStoreCartToCart(cart),
      itemsCount: cart.items_count ?? 0,
    });

    applyCartSessionCookies(response, nextSession);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update delivery schedule",
      },
      { status: 400 },
    );
  }
}
