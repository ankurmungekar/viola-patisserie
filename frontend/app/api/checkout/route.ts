import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  applyCartSessionCookies,
  getCartSessionFromCookies,
} from "@/lib/woocommerce/cart-server";
import { getCheckoutData } from "@/lib/woocommerce/checkout-server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);
    const result = await getCheckoutData(session);
    const response = NextResponse.json(result.checkout);

    applyCartSessionCookies(response, result.session);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load checkout data",
      },
      { status: 400 },
    );
  }
}
