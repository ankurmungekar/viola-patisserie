import Image from "next/image";
import Link from "next/link";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/config/products";
import { formatPrice } from "@/lib/utils/format-price";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const imageSrc = product.image.src || DEFAULT_PRODUCT_IMAGE;

  return (
    <article className={className}>
      <Link href={product.permalink} className="group block">
        <div className="relative aspect-square w-full overflow-hidden bg-[#F4F0F2]">
          <Image
            src={imageSrc}
            alt={product.image.alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 295px"
          />
        </div>
      </Link>

      <div className="mt-4">
        <Link href={product.permalink}>
          <h3 className="text-lg leading-[18px] tracking-viola-wide text-viola-text">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-lg font-semibold leading-5 tracking-viola-wide text-viola-text">
          {product.priceHtml || formatPrice(product.price)}
        </p>
        <Link
          href={product.permalink}
          className="mt-4 inline-block text-base tracking-viola-wide text-viola-primary hover:underline"
        >
          Add to cart
        </Link>
      </div>
    </article>
  );
}
