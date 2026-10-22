"use client";

import { useState } from "react";
import { trackOrder } from "@/lib/woocommerce/orders";
import type { OrderTracking } from "@/types/order-tracking";

const fieldClassName =
  "h-12 w-full border border-viola-border px-4 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none";

interface TrackOrderFormProps {
  initialOrderNumber?: string;
}

export function TrackOrderForm({ initialOrderNumber = "" }: TrackOrderFormProps) {
  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OrderTracking | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!orderNumber.trim() || !email.trim()) {
      setError("Enter your order number and the email used at checkout.");
      return;
    }

    setLoading(true);
    try {
      setResult(await trackOrder(orderNumber, email));
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "We couldn't find an order with those details.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="order"
          inputMode="numeric"
          autoComplete="off"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="Order number"
          aria-label="Order number"
          className={fieldClassName}
          required
        />
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email used at checkout"
          aria-label="Email"
          className={fieldClassName}
          required
        />

        {error ? (
          <p className="text-sm tracking-viola-wide text-red-600">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center bg-viola-primary px-6 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
        >
          {loading ? "Looking up..." : "Track order"}
        </button>
      </form>

      {result ? <TrackingResult order={result} /> : null}
    </>
  );
}

function TrackingResult({ order }: { order: OrderTracking }) {
  return (
    <section className="mt-10 border border-viola-border bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            Order #{order.orderNumber}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-viola-text">
            {order.statusLabel}
          </h2>
        </div>
        {order.placedAt ? (
          <p className="shrink-0 text-sm tracking-viola-wide text-viola-text/70">
            {order.placedAt}
          </p>
        ) : null}
      </div>
      <p className="mt-3 text-base tracking-viola-wide text-viola-text/80">
        {order.detail}
      </p>

      {order.steps.length > 0 ? (
        <ol className="mt-6 grid grid-cols-4 gap-2">
          {order.steps.map((step) => (
            <li key={step.id} className="min-w-0">
              <span
                className={`block h-1.5 ${
                  step.state === "upcoming" ? "bg-viola-border" : "bg-viola-primary"
                }`}
              />
              <span
                className={`mt-2 block text-xs tracking-viola-wide md:text-sm ${
                  step.state === "upcoming"
                    ? "text-viola-text/50"
                    : "font-semibold text-viola-text"
                }`}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {order.delivery ? (
        <div className="mt-6 bg-viola-topbar px-4 py-4">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            Delivery
          </p>
          <p className="mt-1 text-base tracking-viola-wide text-viola-text">
            {[order.delivery.date, order.delivery.slot].filter(Boolean).join(" · ")}
          </p>
        </div>
      ) : null}

      {order.tracking ? (
        <div className="mt-4 bg-viola-topbar px-4 py-4">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            {order.tracking.carrier || "Tracking"}
          </p>
          {order.tracking.number ? (
            <p className="mt-1 text-base font-semibold tracking-viola-wide text-viola-text">
              {order.tracking.number}
            </p>
          ) : null}
          {order.tracking.url ? (
            <a
              href={order.tracking.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-base tracking-viola-wide text-viola-primary underline underline-offset-4"
            >
              Track with delivery partner
            </a>
          ) : null}
        </div>
      ) : null}

      {order.items.length > 0 ? (
        <ul className="mt-6 divide-y divide-viola-border border-t border-viola-border">
          {order.items.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-4 py-3 text-base tracking-viola-wide text-viola-text"
            >
              <span>
                {item.name}
                {item.cakeMessage ? (
                  <span className="mt-0.5 block text-sm text-viola-text/70">
                    Message: “{item.cakeMessage}”
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-viola-text/70">× {item.quantity}</span>
            </li>
          ))}
          {order.total ? (
            <li className="flex justify-between gap-4 py-3 text-base font-semibold tracking-viola-wide text-viola-text">
              <span>Total</span>
              <span>{order.total}</span>
            </li>
          ) : null}
        </ul>
      ) : null}
    </section>
  );
}
