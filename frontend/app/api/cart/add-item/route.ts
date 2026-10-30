import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  addItemToCart,
  applyCartSessionCookies,
  getCartSessionFromCookies,
  getItemsCountFromCart,
} from "@/lib/woocommerce/cart-server";

interface AddItemBody {
  id: number;
  quantity: number;
  variation?: { attribute: string; value: string }[];
  cakeMessage?: string;
  orderNote?: string;
  color?: string;
  flavor?: string;
  deliveryPincode?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  deliveryZone?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AddItemBody;
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
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
