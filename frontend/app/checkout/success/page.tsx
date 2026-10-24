import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: `Your order has been placed with ${siteConfig.name}.`,
  robots: {
    index: false,
    follow: false,
  },
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    order_id?: string;
    status?: string;
  }>;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderId = params.order_id;
  const status = params.status;

  return (
    <section className="py-16 md:py-24">
      <CheckoutSuccessClient />
      <div className="mx-auto w-full max-w-xl px-4 text-center md:px-8">
        <p className="text-sm uppercase tracking-viola text-viola-accent">
          Thank you
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-viola-text md:text-5xl">
          Order Confirmed
        </h1>
        <p className="mt-4 text-base tracking-viola-wide text-viola-text/80">
          {orderId
            ? `Your order #${orderId} has been received.`
            : "Your order has been received."}
          {status ? ` Status: ${status}.` : ""} We will prepare your order for
          the scheduled delivery window. A confirmation email with your
          tracking link is on its way.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Button
            href={
              orderId
                ? `/track-order?order=${encodeURIComponent(orderId)}`
                : "/track-order"
            }
            className="whitespace-nowrap px-6"
          >
            Track Your Order
          </Button>
          <Button
            href="/collections"
            variant="outline"
            className="whitespace-nowrap px-6"
          >
            Continue Shopping
          </Button>
        </div>
        <Link
          href="/"
          className="mt-6 inline-block text-sm tracking-viola-wide text-viola-primary hover:underline"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
