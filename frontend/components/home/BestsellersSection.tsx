import { Container } from "@/components/layout/Container";
import { ProductCard } from "@/components/home/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/types/product";

interface BestsellersSectionProps {
  products: Product[];
}

export function BestsellersSection({ products }: BestsellersSectionProps) {
  return (
    <section className="py-16 md:py-20" aria-labelledby="bestsellers-heading">
      <Container>
        <SectionHeading
          title="Our Bestsellers"
          description="Discover the handcrafted creations our customers love most—beautifully crafted with premium ingredients and timeless flavours."
          className="mb-10"
        />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
