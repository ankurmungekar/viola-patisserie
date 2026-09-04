"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { CartEmpty } from "@/components/cart/CartEmpty";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { checkDeliveryMetaConflict } from "@/lib/utils/cart-delivery";
import { getCart } from "@/lib/woocommerce/cart";
import type { Cart } from "@/types/cart";

interface CartPageClientProps {
  initialCart: Cart;
}

export function CartPageClient({ initialCart }: CartPageClientProps) {
  const router = useRouter();
  const [cart, setCart] = useState(initialCart);
  const conflict = checkDeliveryMetaConflict(cart);

  const refreshCart = useCallback(async () => {
    const response = await getCart();
    setCart(response.cart);
    router.refresh();
  }, [router]);

  if (cart.itemsCount === 0) {
    return <CartEmpty />;
  }

  return (
    <>
      <div className="grid gap-2 lg:grid-cols-[minmax(0,668px)_475px] lg:items-end lg:justify-between lg:gap-x-12 xl:gap-x-[95px]">
        <div>
          <h1 className="font-display text-[40px] font-semibold leading-[48px] text-viola-text">
            Your Cart
          </h1>
          <p className="mt-1 max-w-[588px] text-base leading-5 tracking-viola-wide text-viola-text">
            Review your items and confirm your delivery date &amp; time.
          </p>
        </div>
        <h2 className="hidden font-display text-2xl font-semibold leading-[29px] text-viola-text lg:block">
          Order Summary
        </h2>
      </div>

      <div className="mt-8 lg:mt-[30px] grid gap-10 lg:grid-cols-[minmax(0,668px)_475px] lg:items-start lg:justify-between lg:gap-x-12 xl:gap-x-[95px]">
      <div className="space-y-10">
        {cart.items.map((item, index) => (
          <CartLineItem
            key={item.key}
            item={item}
            onUpdated={refreshCart}
            showDivider={index < cart.items.length - 1}
          />
        ))}
      </div>

      <CartSummary
        cart={cart}
        deliveryConflictMessage={
          conflict.hasConflict ? conflict.message : undefined
        }
        onUpdated={refreshCart}
      />
      </div>
    </>
  );
}
