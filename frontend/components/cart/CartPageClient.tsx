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
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div>
        {cart.items.map((item) => (
          <CartLineItem key={item.key} item={item} onUpdated={refreshCart} />
        ))}
      </div>
      <CartSummary
        totals={cart.totals}
        itemsCount={cart.itemsCount}
        deliveryConflictMessage={
          conflict.hasConflict ? conflict.message : undefined
        }
      />
    </div>
  );
}
