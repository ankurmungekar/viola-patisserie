import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CustomCakesSection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="custom-cakes-heading">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative overflow-hidden custom-cakes-gradient p-8 md:p-12">
            <SectionHeading
              eyebrow="Custom Cake Orders"
              title="Made Just for Your Celebration"
              align="left"
              className="max-w-none"
            />
            <p className="mt-4 max-w-md text-base leading-5 tracking-viola-wide text-viola-text">
              Every celebration is unique and your cake should be too. Share your
              ideas, theme, flavours, and inspiration, and we&apos;ll create a
              handcrafted cake designed exclusively for your special occasion
            </p>
            <div className="mt-8">
              <Button href="/contact">Contact Us for a Custom Order</Button>
            </div>
          </div>

          <div className="relative aspect-[1240/426] min-h-[260px] overflow-hidden">
            <Image
              src="/images/placeholders/custom-cakes.svg"
              alt="Custom celebration cakes"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
