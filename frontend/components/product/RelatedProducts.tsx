import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20" aria-labelledby="related-products-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <h2
          id="related-products-heading"
          className="font-display text-4xl font-semibold text-viola-text md:text-5xl"
        >
          You May Also Like
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
