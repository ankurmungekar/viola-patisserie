import { Container } from "@/components/layout/Container";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Category } from "@/types/category";

interface SignatureCollectionSectionProps {
  categories: Category[];
}

export function SignatureCollectionSection({
  categories,
}: SignatureCollectionSectionProps) {
  return (
    <section className="py-16 md:py-20" aria-labelledby="signature-collection-heading">
      <Container>
        <SectionHeading
          eyebrow="our Signature Collection"
          title="Crafted to Perfection"
          description="Discover our most loved creations, made with the finest ingredients and a touch of artistry."
          className="mb-10"
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {categories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              className={
                index === 0 || index === 4
                  ? "md:row-span-2"
                  : index === 2
                    ? "lg:col-span-1"
                    : ""
              }
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button variant="outline" href="/collections">
            Explore All Collections
          </Button>
        </div>
      </Container>
    </section>
  );
}
