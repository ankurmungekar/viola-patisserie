import { Button } from "@/components/ui/Button";
import type { CartTotals } from "@/types/cart";

interface CartSummaryProps {
  totals: CartTotals;
  itemsCount: number;
  deliveryConflictMessage?: string;
}

export function CartSummary({
  totals,
  itemsCount,
  deliveryConflictMessage,
}: CartSummaryProps) {
  return (
    <aside className="border border-viola-border bg-white p-6">
      <h2 className="font-display text-2xl font-semibold text-viola-text">
        Order Summary
      </h2>
      <dl className="mt-6 space-y-3 text-base tracking-viola-wide text-viola-text">
        <div className="flex items-center justify-between">
          <dt>
            Subtotal ({itemsCount} item{itemsCount === 1 ? "" : "s"})
          </dt>
          <dd>{totals.subtotal}</dd>
        </div>
        {totals.shippingMinor > 0 ? (
          <div className="flex items-center justify-between">
            <dt>Delivery</dt>
            <dd>{totals.shipping}</dd>
          </div>
        ) : null}
        <div className="flex items-center justify-between border-t border-viola-border pt-3 text-lg font-medium">
          <dt>Total</dt>
          <dd>{totals.total}</dd>
        </div>
      </dl>

      {deliveryConflictMessage ? (
        <p className="mt-4 text-sm tracking-viola-wide text-red-600">
          {deliveryConflictMessage}
        </p>
      ) : null}

      <div className="mt-6">
        {deliveryConflictMessage ? (
          <span className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center bg-viola-primary/50 px-4 text-xl tracking-viola-wide text-white">
            Proceed to Checkout
          </span>
        ) : (
          <Button href="/checkout" className="w-full">
            Proceed to Checkout
          </Button>
        )}
      </div>
    </aside>
  );
}
