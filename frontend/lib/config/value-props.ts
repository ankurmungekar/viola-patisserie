import {
  BadgeIcon,
  GiftBoxIcon,
  MixerIcon,
  TruckIcon,
} from "@/components/icons";

export const valueProps = [
  {
    title: "Premium Ingredients",
    description:
      "We use the finest ingredients sourced from trusted artisans worldwide",
    icon: BadgeIcon,
  },
  {
    title: "Artisan Craftsmanship",
    description:
      "Each creation is handcrafted with precision, passion and artistic touch",
    icon: MixerIcon,
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
