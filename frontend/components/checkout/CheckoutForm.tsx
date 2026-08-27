"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { placeOrder, verifyRazorpayPayment, clearCart } from "@/lib/woocommerce/cart";
import { checkDeliveryMetaConflict } from "@/lib/utils/cart-delivery";
import type { Cart } from "@/types/cart";
import type { CheckoutFormData } from "@/types/checkout";

interface CheckoutFormProps {
  cart: Cart;
}

const fieldClassName =
  "h-12 w-full border border-viola-border px-4 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none";

const initialFormState: CheckoutFormData = {
  firstName: "",
  lastName: "",
  address1: "",
  city: "Mumbai",
  state: "MH",
  postcode: "",
  country: "IN",
  email: "",
  phone: "",
  customerNote: "",
};

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayHandlerResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CheckoutFormData>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const conflict = checkDeliveryMetaConflict(cart);

  function updateField<K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  const canSubmit =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.address1.trim() &&
    form.city.trim() &&
    form.postcode.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    !submitting &&
    !conflict.hasConflict;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const orderResult = await placeOrder(form);

      if (!orderResult.razorpay) {
        await clearCart();
        router.push(
          `/checkout/success?order_id=${orderResult.orderId}&status=${orderResult.status}`,
        );
        return;
      }

      if (!window.Razorpay) {
        throw new Error("Payment gateway failed to load. Please try again.");
      }

      const razorpay = new window.Razorpay({
        key: orderResult.razorpay.keyId,
        amount: orderResult.razorpay.amount,
        currency: orderResult.razorpay.currency,
        name: "Viola Patisserie",
        description: `Order #${orderResult.orderId}`,
        order_id: orderResult.razorpay.orderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        handler: async (response) => {
          try {
            await verifyRazorpayPayment({
              orderId: orderResult.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            router.push(`/checkout/success?order_id=${orderResult.orderId}`);
          } catch (verifyError) {
            setError(
              verifyError instanceof Error
                ? verifyError.message
                : "Payment verification failed.",
            );
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      });

      razorpay.open();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to place order. Please try again.",
      );
      setSubmitting(false);
    }
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-display text-2xl font-semibold text-viola-text">
              Contact Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={form.firstName}
                onChange={(event) => updateField("firstName", event.target.value)}
                placeholder="First name"
                className={fieldClassName}
                required
              />
              <input
                type="text"
                value={form.lastName}
                onChange={(event) => updateField("lastName", event.target.value)}
                placeholder="Last name"
                className={fieldClassName}
                required
              />
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="Email"
                className={`${fieldClassName} sm:col-span-2`}
                required
              />
              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value.replace(/\D/g, ""))
                }
                placeholder="Phone"
                className={`${fieldClassName} sm:col-span-2`}
                required
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-viola-text">
              Delivery Address
            </h2>
            <div className="mt-4 grid gap-4">
              <input
                type="text"
                value={form.address1}
                onChange={(event) => updateField("address1", event.target.value)}
                placeholder="Address"
                className={fieldClassName}
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={form.city}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder="City"
                  className={fieldClassName}
                  required
                />
                <input
                  type="text"
                  value={form.postcode}
                  onChange={(event) =>
                    updateField(
                      "postcode",
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="Pincode"
                  className={fieldClassName}
                  required
                />
              </div>
              <textarea
                value={form.customerNote}
                onChange={(event) =>
                  updateField("customerNote", event.target.value)
                }
                placeholder="Order notes (optional)"
                rows={3}
                className="w-full border border-viola-border px-4 py-3 text-base tracking-viola-wide text-viola-text placeholder:text-viola-text/50 focus:border-viola-primary focus:outline-none"
              />
            </div>
          </div>

          {cart.items.length > 0 ? (
            <div className="rounded border border-viola-border bg-viola-category-bg/40 p-4">
              <p className="text-sm uppercase tracking-viola text-viola-accent">
                Scheduled Delivery
              </p>
              <div className="mt-2 space-y-1 text-sm tracking-viola-wide text-viola-text">
                {cart.items.map((item) => (
                  <p key={item.key}>
                    {item.name}: {item.extensions.deliveryDate}{" "}
                    {item.extensions.deliverySlot
                      ? `(${item.extensions.deliverySlot})`
                      : ""}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {conflict.hasConflict ? (
            <p className="text-sm tracking-viola-wide text-red-600">
              {conflict.message}
            </p>
          ) : null}

          {error ? (
            <p className="text-sm tracking-viola-wide text-red-600">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className="flex h-12 w-full items-center justify-center bg-viola-primary px-6 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
          >
            {submitting ? "Processing..." : "Pay with Razorpay"}
          </button>
        </form>

        <OrderSummary totals={cart.totals} itemsCount={cart.itemsCount} />
      </div>
    </>
  );
}
