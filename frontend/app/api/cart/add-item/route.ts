import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  CART_TOKEN_COOKIE,
  addItemToCart,
  applyCartSessionCookies,
  getCartWithSession,
  getItemsCountFromCart,
} from "@/lib/woocommerce/cart-server";

interface AddItemBody {
  id: number;
  quantity: number;
  cakeMessage?: string;
  deliveryPincode?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  deliveryZone?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddItemBody;
    const cookieStore = await cookies();
    const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;

    let session = {
      cartToken: cartToken ?? "",
      nonce: "",
    };

    if (!session.cartToken || !session.nonce) {
      const cartSession = await getCartWithSession(cartToken);
      session = cartSession.session;
    }

    const result = await addItemToCart(session, body);
    const response = NextResponse.json({
      itemsCount: getItemsCountFromCart(result.cart),
    });

    applyCartSessionCookies(response, result.session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to add item to cart",
      },
      { status: 400 },
    );
  }
}
