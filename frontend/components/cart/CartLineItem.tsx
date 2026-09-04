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
  showDivider?: boolean;
}

export function CartLineItem({
  item,
  onUpdated,
  showDivider = true,
}: CartLineItemProps) {
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
    <article className={showDivider ? "border-b border-viola-border pb-10" : ""}>
      <div className="flex gap-5">
        <div className="relative h-[190px] w-[190px] shrink-0 overflow-hidden bg-viola-category-bg">
          {item.image.src ? (
            <Image
              src={item.image.src}
              alt={item.image.alt}
              fill
              className="object-cover"
              sizes="190px"
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col pt-0.5">
          {item.permalink ? (
            <Link
              href={item.permalink}
              className="text-lg leading-[18px] tracking-viola-wide text-viola-text hover:text-viola-primary"
            >
              {item.name}
            </Link>
          ) : (
            <h3 className="text-lg leading-[18px] tracking-viola-wide text-viola-text">
              {item.name}
            </h3>
          )}

          <p className="mt-5 text-lg font-semibold leading-5 tracking-viola-wide text-viola-text">
            {item.unitPrice}
          </p>

          <div className="mt-5">
            <QuantityStepper
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              size="compact"
            />
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={removing || updating}
            className="mt-8 w-fit text-base tracking-viola-wide text-viola-primary hover:underline disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove"}
          </button>

          {error ? (
            <p className="mt-3 text-sm tracking-viola-wide text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
