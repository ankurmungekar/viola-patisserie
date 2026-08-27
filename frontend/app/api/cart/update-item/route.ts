import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getItemsCountFromCart,
  mapStoreCartToCart,
  updateCartItem,
} from "@/lib/woocommerce/cart-server";

interface UpdateItemBody {
  key: string;
  quantity: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as UpdateItemBody;
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const result = await updateCartItem(session, body.key, body.quantity);
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
          error instanceof Error ? error.message : "Failed to update cart item",
      },
      { status: 400 },
    );
  }
}
