import type { ReactNode } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { PromoBanner } from "@/components/shared/PromoBanner";
import type { PromoBannerContent } from "@/types/promo-banner";
import type { Product } from "@/types/product";

interface ProductGridWithBannerProps {
  products: Product[];
  banner: PromoBannerContent;
}

export function ProductGridWithBanner({
  products,
  banner,
}: ProductGridWithBannerProps) {
  const insertAfter = (banner.insertAfterRow ?? 3) * 4;

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg tracking-viola-wide text-viola-text">
          No products in this collection yet.
        </p>
      </div>
    );
  }

  const items: ReactNode[] = [];

  products.forEach((product, index) => {
    items.push(<ProductCard key={`${product.id}-${index}`} product={product} />);

    if (index + 1 === insertAfter) {
      items.push(
        <div key="promo-banner" className="col-span-full">
          <PromoBanner content={banner} />
        </div>,
      );
    }
  });

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items}
    </div>
  );
}
