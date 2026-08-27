import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function CartEmpty() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="font-display text-4xl font-semibold text-viola-text">
        Your cart is empty
      </h1>
      <p className="mt-4 text-base tracking-viola-wide text-viola-text/80">
        Browse our signature collections and add something sweet to your cart.
      </p>
      <div className="mt-8">
        <Button href="/collections">Shop Collections</Button>
      </div>
      <p className="mt-6">
        <Link
          href="/"
          className="text-sm tracking-viola-wide text-viola-primary hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
