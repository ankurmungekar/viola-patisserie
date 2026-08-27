import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { siteConfig } from "@/lib/config/site";
import {
  CART_TOKEN_COOKIE,
  CART_NONCE_COOKIE,
  getCartWithSession,
  mapStoreCartToCart,
} from "@/lib/woocommerce/cart-server";

export const metadata: Metadata = {
  title: "Checkout",
  description: `Complete your order at ${siteConfig.name}.`,
  alternates: {
    canonical: "/checkout",
  },
};

export default async function CheckoutPage() {
  let cart = mapStoreCartToCart({ items: [] });

  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
    const nonce = cookieStore.get(CART_NONCE_COOKIE)?.value;
    const { cart: storeCart } = await getCartWithSession(cartToken, nonce);
    cart = mapStoreCartToCart(storeCart);
  } catch {
    cart = mapStoreCartToCart({ items: [] });
  }

  if (cart.itemsCount === 0) {
    redirect("/cart");
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-4xl font-semibold text-viola-text md:text-5xl">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="text-sm tracking-viola-wide text-viola-primary hover:underline"
          >
            Back to cart
          </Link>
        </div>
        <CheckoutForm cart={cart} />
      </div>
    </section>
  );
}
