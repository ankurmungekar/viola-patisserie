import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  clearCartSessionCookies,
  emptyCart,
  getCartSessionFromCookies,
} from "@/lib/woocommerce/cart-server";
import { verifyRazorpayPayment } from "@/lib/woocommerce/checkout-server";
import type { VerifyPaymentPayload } from "@/types/checkout";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPaymentPayload;
    const result = await verifyRazorpayPayment(body);

    const cookieStore = await cookies();
    const session = await getCartSessionFromCookies(cookieStore);

    try {
      await emptyCart(session);
    } catch {
      // Cart may already be empty after checkout.
    }

    const response = NextResponse.json({
      ...result,
      itemsCount: 0,
    });
    clearCartSessionCookies(response);
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Payment verification failed",
      },
      { status: 400 },
    );
  }
}
