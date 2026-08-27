import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getItemsCountFromCart,
  mapStoreCartToCart,
  removeCartItem,
} from "@/lib/woocommerce/cart-server";

interface RemoveItemBody {
  key: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RemoveItemBody;
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const result = await removeCartItem(session, body.key);
    const response = NextResponse.json({
      cart: mapStoreCartToCart(result.cart),
      itemsCount: getItemsCountFromCart(result.cart),
    });

    applyCartSessionCookies(response, result.session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to remove cart item",
      },
      { status: 400 },
    );
  }
}
