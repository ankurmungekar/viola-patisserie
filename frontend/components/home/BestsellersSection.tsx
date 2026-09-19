import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface BestsellersSectionProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  return (
    <section className="py-16 md:py-20" aria-labelledby="bestsellers-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="mx-auto max-w-[610px] text-center">
          <h2
            id="bestsellers-heading"
            className="font-display text-4xl font-semibold leading-tight text-viola-text md:text-5xl"
          >
            Our <span className="text-viola-accent">Bestsellers</span>
          </h2>
          <p className="mt-4 text-base leading-5 tracking-viola-wide text-viola-text">
            Discover the handcrafted creations our customers love most—beautifully
            crafted with premium ingredients and timeless flavours.
          </p>
        </div>

        <div className="reveal-stagger mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
