import Link from "next/link";
import { CartDeliverySchedule } from "@/components/cart/CartDeliverySchedule";
import { CartFulfillmentMethod } from "@/components/cart/CartFulfillmentMethod";
import type { Cart } from "@/types/cart";

interface CartSummaryProps {
  cart: Cart;
  deliveryConflictMessage?: string;
  onUpdated: () => Promise<void>;
}

function SummaryRow({
  label,
  value,
  valueClassName = "text-lg font-semibold leading-5 tracking-viola-wide text-viola-text",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-lg leading-5 tracking-viola-wide text-viola-text">
        {label}
      </dt>
      <dd className={valueClassName}>{value}</dd>
    </div>
  );
}

export function CartSummary({
  cart,
  deliveryConflictMessage,
  onUpdated,
}: CartSummaryProps) {
  const { totals, items, itemsCount } = cart;
  const itemLabel = itemsCount === 1 ? "Item" : "Items";

  return (
    <aside className="w-full max-w-[475px] lg:sticky lg:top-[156px]">
      <h2 className="font-display text-2xl font-semibold leading-[29px] text-viola-text lg:hidden">
        Order Summary
      </h2>

      <div className="mt-6 space-y-6 lg:mt-0">
        <CartDeliverySchedule items={items} onUpdated={onUpdated} />

        <dl className="space-y-4">
          <SummaryRow
            label={`Subtotal (${itemsCount} ${itemLabel})`}
            value={totals.subtotal}
          />
          <SummaryRow label={totals.taxLabel} value={totals.tax} />
        </dl>

        <div className="border-t border-viola-border pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold leading-5 tracking-viola-wide text-viola-text">
                Total
              </p>
              <p className="mt-2 text-lg leading-5 tracking-viola-wide text-viola-text">
                Inclusive of all taxes
              </p>
            </div>
            <p className="text-2xl font-semibold leading-5 tracking-viola-wide text-viola-text">
              {totals.total}
            </p>
          </div>
        </div>

        <CartFulfillmentMethod />

        {deliveryConflictMessage ? (
          <p className="text-sm tracking-viola-wide text-red-600">
            {deliveryConflictMessage}
          </p>
        ) : null}

        {deliveryConflictMessage ? (
          <span className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center bg-viola-primary/50 px-4 text-xl tracking-viola-wide text-white">
            Proceed to checkout
          </span>
        ) : (
          <Link
            href="/checkout"
            className="inline-flex h-12 w-full items-center justify-center bg-viola-primary px-4 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72]"
          >
            Proceed to checkout
          </Link>
        )}

        <p className="text-lg leading-5 tracking-viola-wide text-viola-text">
          Shipping calculated at checkout.
        </p>
      </div>
    </aside>
  );
}
