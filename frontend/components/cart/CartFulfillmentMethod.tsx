"use client";

import { useState } from "react";
import { CartTruckIcon, StoreIcon } from "@/components/icons";

type FulfillmentMethod = "delivery" | "pickup";

interface CartFulfillmentMethodProps {
  value?: FulfillmentMethod;
  onChange?: (value: FulfillmentMethod) => void;
}

export function CartFulfillmentMethod({
  value,
  onChange,
}: CartFulfillmentMethodProps) {
  const [internalValue, setInternalValue] = useState<FulfillmentMethod>("delivery");
  const selected = value ?? internalValue;

  function handleSelect(method: FulfillmentMethod) {
    setInternalValue(method);
    onChange?.(method);
  }

  return (
    <div className="grid grid-cols-2 gap-[23px]">
      <button
        type="button"
        onClick={() => handleSelect("delivery")}
        className={`flex h-[46px] items-center justify-center gap-2.5 border px-3.5 text-sm tracking-viola-wide transition-colors ${
          selected === "delivery"
            ? "border-viola-primary bg-[#F0E9F3] text-viola-text"
            : "border-viola-border bg-white text-viola-text"
        }`}
      >
        <CartTruckIcon />
        Local Delivery
      </button>
      <button
        type="button"
        onClick={() => handleSelect("pickup")}
        className={`flex h-[46px] items-center justify-center gap-2.5 border px-3.5 text-sm tracking-viola-wide transition-colors ${
          selected === "pickup"
            ? "border-viola-primary bg-[#F0E9F3] text-viola-text"
            : "border-viola-border bg-white text-viola-text"
        }`}
      >
        <StoreIcon />
        Store Pickup
      </button>
    </div>
  );
}
