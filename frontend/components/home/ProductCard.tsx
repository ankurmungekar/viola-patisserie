import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/format-price";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group">
      <Link href={product.permalink} className="block">
        <div className="relative aspect-[320/425] overflow-hidden bg-[#F4F0F2]">
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        </div>
      </Link>

      <div className="mt-4">
        <Link href={product.permalink}>
          <h3 className="text-lg leading-[18px] tracking-viola-wide text-viola-text">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-lg font-semibold tracking-viola-wide text-viola-text">
          {product.priceHtml || formatPrice(product.price)}
        </p>
        <Link
          href={product.permalink}
          className="mt-2 inline-block text-base tracking-viola-wide text-viola-primary hover:underline"
        >
          Add to cart
        </Link>
      </div>
    </article>
  );
}
