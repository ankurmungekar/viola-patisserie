"use client";

import { useMemo, useState } from "react";
import { CakeMessageInput } from "@/components/product/CakeMessageInput";
import { DeliveryLocation } from "@/components/product/DeliveryLocation";
import { DeliveryTimePicker } from "@/components/product/DeliveryTimePicker";
import { OrderNoteInput } from "@/components/product/OrderNoteInput";
import { ProductOptionSelect } from "@/components/product/ProductOptionSelect";
import { ProductDetailInfo } from "@/components/product/ProductDetailInfo";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { WeightSelector } from "@/components/product/WeightSelector";
import { cakeMessageCategorySlugs } from "@/lib/config/product-defaults";
import { addToCart } from "@/lib/woocommerce/cart";
import {
  buildCartVariationPayload,
  findMatchingVariation,
  getInitialAttributeSelections,
  getVariationAttributes,
  getVisibleVariationAttributes,
  resolveCartAttributeSelections,
} from "@/lib/woocommerce/variation-attributes";
import type { ProductDetail } from "@/types/product";

interface ProductPurchaseFormProps {
  product: ProductDetail;
  className?: string;
}

function getWeightOptions(product: ProductDetail): string[] {
  const weightAttribute = getVisibleVariationAttributes(product.attributes).find(
    (attribute) => attribute.name.toLowerCase() === "weight",
  );

  if (weightAttribute?.options.length) {
    return weightAttribute.options.map((option) => option.name);
  }

  if (product.variations.length > 0) {
    return product.variations.map(
      (variation) => variation.attributes[0]?.value ?? "",
    );
  }

  return [];
}

function productSupportsCakeMessage(product: ProductDetail): boolean {
  return product.categories.some((category) =>
    cakeMessageCategorySlugs.includes(
      category.slug as (typeof cakeMessageCategorySlugs)[number],
    ),
  );
}

export function ProductPurchaseForm({
  product,
  className = "",
}: ProductPurchaseFormProps) {
  const variationAttributes = getVariationAttributes(product.attributes);
  const visibleAttributes = getVisibleVariationAttributes(product.attributes);
  const weightOptions = getWeightOptions(product);
  const colorOptions = product.colorOptions;
  const flavorOptions = product.flavorOptions;
  const showCakeMessage = productSupportsCakeMessage(product);
  const [selectedAttributes, setSelectedAttributes] = useState(() =>
    getInitialAttributeSelections(visibleAttributes),
  );
  const [cakeMessage, setCakeMessage] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    () => product.colorOptions[0] ?? "",
  );
  const [selectedFlavor, setSelectedFlavor] = useState(
    () => product.flavorOptions[0] ?? "",
  );
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

  const weightAttribute = visibleAttributes.find(
    (attribute) => attribute.name.toLowerCase() === "weight",
  );
  const selectedWeight = weightAttribute
    ? (selectedAttributes[weightAttribute.name] ?? weightOptions[0] ?? "")
    : (weightOptions[0] ?? "");

  const selectedVariation = useMemo(() => {
    if (product.type === "variable") {
      return findMatchingVariation(
        product.variations,
        visibleAttributes,
        selectedAttributes,
      );
    }

    return product.variations[0] ?? null;
  }, [product, selectedAttributes, visibleAttributes]);

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

  function updateWeightSelection(value: string) {
    const weightAttribute = visibleAttributes.find(
      (attribute) => attribute.name.toLowerCase() === "weight",
    );

    if (!weightAttribute) {
      return;
    }

    setSelectedAttributes((current) => ({
      ...current,
      [weightAttribute.name]: value,
    }));
  }

  async function handleAddToCart() {
    if (!selectedVariation || !canSubmit) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const cartSelections = resolveCartAttributeSelections(
        variationAttributes,
        selectedAttributes,
        selectedVariation,
      );
      const result = await addToCart({
        id: selectedVariation.id,
        quantity,
        variation: buildCartVariationPayload(
          variationAttributes,
          cartSelections,
        ),
        cakeMessage: showCakeMessage ? cakeMessage : "",
        orderNote,
        color: colorOptions.length > 0 ? selectedColor : undefined,
        flavor: flavorOptions.length > 0 ? selectedFlavor : undefined,
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

      <ProductDetailInfo
        product={product}
        fields={["allergens"]}
        className="mt-8"
      />

      <div className="mt-8 space-y-6">
        {weightOptions.length > 0 ? (
          <WeightSelector
            options={weightOptions}
            selected={selectedWeight}
            onChange={updateWeightSelection}
          />
        ) : null}

        <ProductOptionSelect
          id="product-color"
          label="Color"
          options={colorOptions}
          value={selectedColor}
          onChange={setSelectedColor}
        />

        <ProductOptionSelect
          id="product-flavor"
          label="Flavor"
          options={flavorOptions}
          value={selectedFlavor}
          onChange={setSelectedFlavor}
        />

        <ProductDetailInfo
          product={product}
          fields={["consumption", "storageInfo"]}
        />

        {showCakeMessage ? (
          <CakeMessageInput value={cakeMessage} onChange={setCakeMessage} />
        ) : null}

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

        <OrderNoteInput value={orderNote} onChange={setOrderNote} />
      </div>
    </div>
  );
}
