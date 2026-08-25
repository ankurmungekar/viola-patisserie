import { Container } from "@/components/layout/Container";
import {
  BadgeIcon,
  GiftBoxIcon,
  MixerIcon,
  TruckIcon,
} from "@/components/icons";

const valueProps = [
  {
    title: "Premium Ingredients",
    description:
      "We use the finest ingredients sourced from trusted artisans worldwide",
    icon: MixerIcon,
  },
  {
    title: "Artisan Craftsmanship",
    description:
      "Each creation is handcrafted with precision, passion and artistic touch",
    icon: BadgeIcon,
  },
  {
    title: "Fresh & Reliable Delivery",
    description:
      "Timely delivery with the utmost care to ensure freshness and perfection",
    icon: TruckIcon,
  },
  {
    title: "Beautiful Packaging",
    description: "Elegantly packaged to make every moment extra special",
    icon: GiftBoxIcon,
  },
] as const;

export function ValuePropsSection() {
  return (
    <section className="border-y border-viola-border bg-white py-16 md:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {valueProps.map(({ title, description, icon: Icon }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-4 flex h-[46px] w-[46px] items-center justify-center">
                <Icon />
              </div>
              <h3 className="font-display text-xl text-viola-accent">{title}</h3>
              <p className="mt-3 text-sm leading-5 tracking-viola-wide text-viola-text">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
