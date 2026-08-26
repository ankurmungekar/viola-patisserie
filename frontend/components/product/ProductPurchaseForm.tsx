"use client";

import { useMemo, useState } from "react";
import { CakeMessageInput } from "@/components/product/CakeMessageInput";
import { DeliveryLocation } from "@/components/product/DeliveryLocation";
import { DeliveryTimePicker } from "@/components/product/DeliveryTimePicker";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { StorageInstructions } from "@/components/product/StorageInstructions";
import { WeightSelector } from "@/components/product/WeightSelector";
import { addToCart } from "@/lib/woocommerce/cart";
import type { ProductDetail } from "@/types/product";

interface ProductPurchaseFormProps {
  product: ProductDetail;
  className?: string;
}

function getWeightOptions(product: ProductDetail): string[] {
  const weightAttribute = product.attributes.find(
    (attribute) => attribute.name.toLowerCase() === "weight",
  );

  if (weightAttribute?.options.length) {
    return weightAttribute.options;
  }

  if (product.variations.length > 0) {
    return product.variations.map(
      (variation) => variation.attributes[0]?.value ?? "",
    );
  }

  return [];
}

export function ProductPurchaseForm({
  product,
  className = "",
}: ProductPurchaseFormProps) {
  const weightOptions = getWeightOptions(product);
  const [selectedWeight, setSelectedWeight] = useState(
    weightOptions[0] ?? "",
  );
  const [cakeMessage, setCakeMessage] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeValidated, setPincodeValidated] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const selectedVariation = useMemo(() => {
    if (product.type === "variable") {
      return (
        product.variations.find((variation) =>
          variation.attributes.some(
            (attribute) =>
              attribute.name.toLowerCase() === "weight" &&
              attribute.value === selectedWeight,
          ),
        ) ?? product.variations[0]
      );
    }

    return product.variations[0] ?? null;
  }, [product, selectedWeight]);

  const displayPrice =
    selectedVariation?.priceHtml ||
    (selectedVariation?.price ? `₹ ${selectedVariation.price}` : "") ||
    product.priceHtml ||
    (product.price > 0 ? `₹ ${product.price}` : "Select weight for price");
  const canSubmit =
    Boolean(selectedVariation) &&
    pincodeValidated &&
    deliveryDate &&
    deliverySlot &&
    quantity >= 1 &&
    !submitting;

  async function handleAddToCart() {
    if (!selectedVariation || !canSubmit) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const result = await addToCart({
        id: selectedVariation.id,
        quantity,
        cakeMessage,
        deliveryPincode: pincode,
        deliveryDate,
        deliverySlot,
        deliveryZone,
      });

      setFeedback({
        type: "success",
        message: `Added to cart (${result.itemsCount} item${result.itemsCount === 1 ? "" : "s"})`,
      });

      window.dispatchEvent(
        new CustomEvent("viola:cart-updated", {
          detail: { itemsCount: result.itemsCount },
        }),
      );
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to add to cart. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`w-full max-w-[668px] ${className}`}>
      <h1 className="font-display text-[40px] font-semibold leading-tight text-viola-text">
        {product.name}
      </h1>

      <p className="mt-3 text-2xl leading-5 tracking-viola-wide text-viola-accent">
        {displayPrice}
      </p>

      {product.shortDescription ? (
        <p className="mt-4 max-w-[588px] text-base leading-5 tracking-viola-wide text-viola-text">
          {product.shortDescription}
        </p>
      ) : null}

      <div className="mt-8 space-y-6">
        {weightOptions.length > 0 ? (
          <WeightSelector
            options={weightOptions}
            selected={selectedWeight}
            onChange={setSelectedWeight}
          />
        ) : null}

        <CakeMessageInput value={cakeMessage} onChange={setCakeMessage} />

        <DeliveryLocation
          pincode={pincode}
          onPincodeChange={(value) => {
            setPincode(value);
            setPincodeValidated(false);
            setDeliveryDate("");
            setDeliverySlot("");
          }}
          onValidated={(serviceable, zone) => {
            setPincodeValidated(serviceable);
            setDeliveryZone(zone);
            if (!serviceable) {
              setDeliveryDate("");
              setDeliverySlot("");
            }
          }}
        />

        <DeliveryTimePicker
          pincode={pincode}
          pincodeValidated={pincodeValidated}
          selectedDate={deliveryDate}
          selectedSlot={deliverySlot}
          onDateChange={setDeliveryDate}
          onSlotChange={setDeliverySlot}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canSubmit}
            className="flex h-12 min-h-12 flex-1 items-center justify-center bg-viola-primary px-6 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add to Cart"}
          </button>
        </div>

        {feedback ? (
          <p
            className={`text-sm tracking-viola-wide ${
              feedback.type === "success" ? "text-viola-primary" : "text-red-600"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <StorageInstructions instructions={product.storageInstructions} />
      </div>
    </div>
  );
}
