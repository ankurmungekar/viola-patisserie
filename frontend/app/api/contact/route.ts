import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/woocommerce/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      website?: string;
    };

    const response = await fetch(
      new URL("/wp-json/viola/v1/contact", getWordPressUrl()).toString(),
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: body.name ?? "",
          email: body.email ?? "",
          phone: body.phone ?? "",
          message: body.message ?? "",
          website: body.website ?? "",
        }),
        cache: "no-store",
      },
    );

    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      ok?: boolean;
    } | null;

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            payload?.message ?? "Unable to send your message. Please try again.",
        },
        { status: response.status === 429 ? 429 : 400 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to send your message. Please try again." },
      { status: 400 },
    );
  }
}
