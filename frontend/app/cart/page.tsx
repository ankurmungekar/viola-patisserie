import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { siteConfig } from "@/lib/config/site";
import {
  CART_TOKEN_COOKIE,
  CART_NONCE_COOKIE,
  getCartWithSession,
  mapStoreCartToCart,
} from "@/lib/woocommerce/cart-server";

export const metadata: Metadata = {
  title: "Cart",
  description: `Review your cart and proceed to checkout at ${siteConfig.name}.`,
  alternates: {
    canonical: "/cart",
  },
};

export default async function CartPage() {
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

  return (
    <section className="py-8 md:py-10">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <CartPageClient initialCart={cart} />
      </div>
    </section>
  );
}
