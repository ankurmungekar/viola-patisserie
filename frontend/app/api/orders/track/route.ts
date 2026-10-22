import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/woocommerce/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderNumber?: string;
      email?: string;
    };

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const clientIp =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip");

    if (clientIp) {
      headers["X-Forwarded-For"] = clientIp;
    }

    const response = await fetch(
      new URL("/wp-json/viola/v1/orders/track", getWordPressUrl()).toString(),
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          order_number: body.orderNumber?.trim() ?? "",
          email: body.email?.trim() ?? "",
        }),
        cache: "no-store",
      },
    );

    const payload = (await response.json().catch(() => null)) as
      | Record<string, unknown>
      | null;

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            typeof payload?.message === "string"
              ? payload.message
              : "We couldn't find an order with those details.",
        },
        { status: [400, 404, 429].includes(response.status) ? response.status : 400 },
      );
    }

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { message: "Unable to look up your order. Please try again." },
      { status: 400 },
    );
  }
}
