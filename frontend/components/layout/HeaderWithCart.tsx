"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import type { Category } from "@/types/category";
import type { SiteContent } from "@/types/homepage";

interface HeaderWithCartProps {
  categories: Category[];
  site: SiteContent;
  initialCartCount: number;
}

export function HeaderWithCart({
  categories,
  site,
  initialCartCount,
}: HeaderWithCartProps) {
  const [cartCount, setCartCount] = useState(initialCartCount);

  useEffect(() => {
    function handleCartUpdated(event: Event) {
      const customEvent = event as CustomEvent<{ itemsCount: number }>;
      if (typeof customEvent.detail?.itemsCount === "number") {
        setCartCount(customEvent.detail.itemsCount);
      }
    }

    window.addEventListener("viola:cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("viola:cart-updated", handleCartUpdated);
    };
  }, []);

  return <Header categories={categories} site={site} cartCount={cartCount} />;
}
