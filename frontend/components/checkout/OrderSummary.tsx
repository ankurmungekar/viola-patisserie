import type { CartTotals } from "@/types/cart";

interface OrderSummaryProps {
  totals: CartTotals;
  itemsCount: number;
}

export function OrderSummary({ totals, itemsCount }: OrderSummaryProps) {
  return (
    <aside className="border border-viola-border bg-white p-6">
      <h2 className="font-display text-2xl font-semibold text-viola-text">
        Order Summary
      </h2>
      <dl className="mt-6 space-y-3 text-base tracking-viola-wide text-viola-text">
        <div className="flex items-center justify-between">
          <dt>
            Items ({itemsCount})
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
    </aside>
  );
}
