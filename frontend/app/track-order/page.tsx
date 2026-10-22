import type { Metadata } from "next";
import Link from "next/link";
import { TrackOrderForm } from "@/components/order/TrackOrderForm";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: `Check the status of your ${siteConfig.name} order and delivery.`,
  alternates: {
    canonical: "/track-order",
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface TrackOrderPageProps {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function TrackOrderPage({
  searchParams,
}: TrackOrderPageProps) {
  const params = await searchParams;
  const initialOrderNumber = params.order ?? "";

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-[30px] md:px-8 xl:px-[100px]">
      <nav
        aria-label="Breadcrumb"
        className="text-sm uppercase tracking-viola text-viola-text/70"
      >
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <li>
            <Link href="/" className="hover:text-viola-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-viola-text" aria-current="page">
            Track Order
          </li>
        </ol>
      </nav>

      <div className="mx-auto mt-[30px] max-w-xl">
        <h1 className="font-display text-4xl font-semibold text-viola-text md:text-5xl">
          Track your order
        </h1>
        <p className="mt-4 text-base tracking-viola-wide text-viola-text/80">
          Enter the order number from your confirmation email and the email
          address you used at checkout.
        </p>
        <div className="mt-8">
          <TrackOrderForm
            key={initialOrderNumber}
            initialOrderNumber={initialOrderNumber}
          />
        </div>
        <p className="mt-8 text-sm tracking-viola-wide text-viola-text/70">
          Need help with your order? WhatsApp us at{" "}
          <a
            href={siteConfig.whatsappUrl}
            className="text-viola-primary hover:underline"
          >
            {siteConfig.phone}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
