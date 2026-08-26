import type { ComponentType } from "react";
import {
  BadgeIcon,
  GiftBoxIcon,
  MixerIcon,
  TruckIcon,
} from "@/components/icons";
import type { ValuePropIcon } from "@/types/homepage";

export const valuePropIconMap: Record<ValuePropIcon, ComponentType> = {
  badge: BadgeIcon,
  mixer: MixerIcon,
  truck: TruckIcon,
  "gift-box": GiftBoxIcon,
};
