"use client";

import { useEffect } from "react";
import { clearCart } from "@/lib/woocommerce/cart";

export function CheckoutSuccessClient() {
  useEffect(() => {
    void clearCart();
  }, []);

  return null;
}
