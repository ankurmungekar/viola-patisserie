import { Container } from "@/components/layout/Container";
import { CategoryCarousel } from "@/components/home/CategoryCarousel";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/types/category";

interface SignatureCollectionSectionProps {
  categories: Category[];
}

export function SignatureCollectionSection({
  categories,
}: SignatureCollectionSectionProps) {
  return (
    <section
      className="py-16 md:py-20"
      aria-labelledby="signature-collection-heading"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p
            id="signature-collection-heading"
            className="mb-3 text-sm uppercase tracking-viola text-viola-accent"
          >
            our Signature Collection
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-viola-text md:text-5xl">
            Crafted to{" "}
            <span className="text-viola-accent">Perfection</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-5 tracking-viola-wide text-viola-text">
            Discover our most loved creations, made with the finest ingredients
            and a touch of artistry.
          </p>
        </div>
      </Container>

      <div className="mt-10 w-full">
        <CategoryCarousel categories={categories} />
      </div>

      <Container>
        <div className="mt-10 flex justify-center">
          <Button variant="outline" href="/collections">
            Explore All Collections
          </Button>
        </div>
      </Container>
    </section>
  );
}
