import Link from "next/link";

interface AddToCartLinkProps {
  permalink: string;
  productName: string;
}

export function AddToCartLink({ permalink, productName }: AddToCartLinkProps) {
  return (
    <Link
      href={permalink}
      className="text-base tracking-viola-wide text-viola-primary hover:underline"
      aria-label={`View ${productName} to add to cart`}
    >
      Add to cart
    </Link>
  );
}
