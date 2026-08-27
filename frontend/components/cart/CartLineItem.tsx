"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { removeCartItem, updateCartItem } from "@/lib/woocommerce/cart";
import type { CartItem } from "@/types/cart";

interface CartLineItemProps {
  item: CartItem;
  onUpdated: () => Promise<void>;
}

function DeliveryMetaRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <p>
      <span className="text-viola-text/70">{label}: </span>
      {value}
    </p>
  );
}

export function CartLineItem({ item, onUpdated }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");

  async function handleQuantityChange(nextQuantity: number) {
    setQuantity(nextQuantity);
    setUpdating(true);
    setError("");

    try {
      await updateCartItem(item.key, nextQuantity);
      await onUpdated();
    } catch (updateError) {
      setQuantity(item.quantity);
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update quantity.",
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleRemove() {
    setRemoving(true);
    setError("");

    try {
      await removeCartItem(item.key);
      await onUpdated();
    } catch (removeError) {
      setError(
        removeError instanceof Error
          ? removeError.message
          : "Unable to remove item.",
      );
    } finally {
      setRemoving(false);
    }
  }

  return (
    <article className="grid gap-4 border-b border-viola-border py-6 md:grid-cols-[120px_minmax(0,1fr)] md:gap-6">
      <div className="relative aspect-square w-full max-w-[120px] overflow-hidden bg-viola-category-bg">
        {item.image.src ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : null}
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {item.permalink ? (
              <Link
                href={item.permalink}
                className="font-display text-2xl font-semibold text-viola-text hover:text-viola-primary"
              >
                {item.name}
              </Link>
            ) : (
              <h3 className="font-display text-2xl font-semibold text-viola-text">
                {item.name}
              </h3>
            )}
            <p className="mt-1 text-base tracking-viola-wide text-viola-accent">
              {item.unitPrice}
            </p>
          </div>
          <p className="text-lg tracking-viola-wide text-viola-text">
            {item.lineTotal}
          </p>
        </div>

        <div className="mt-4 space-y-1 text-sm tracking-viola-wide text-viola-text">
          <DeliveryMetaRow
            label="Pincode"
            value={item.extensions.deliveryPincode}
          />
          <DeliveryMetaRow
            label="Delivery date"
            value={item.extensions.deliveryDate}
          />
          <DeliveryMetaRow
            label="Delivery slot"
            value={item.extensions.deliverySlot}
          />
          <DeliveryMetaRow
            label="Cake message"
            value={item.extensions.cakeMessage}
          />
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <QuantityStepper
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing || updating}
            className="text-sm tracking-viola-wide text-viola-text/70 underline-offset-2 hover:text-red-600 hover:underline disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>
        </div>

        {error ? (
          <p className="mt-3 text-sm tracking-viola-wide text-red-600">
            {error}
          </p>
        ) : null}
      </div>
    </article>
  );
}
