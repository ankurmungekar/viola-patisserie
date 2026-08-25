import Link from "next/link";

interface AddToCartLinkProps {
  productSlug: string;
  productName: string;
}

export function AddToCartLink({ productSlug, productName }: AddToCartLinkProps) {
  return (
    <Link
      href={`/cakes/${productSlug}`}
      className="text-base tracking-viola-wide text-viola-primary hover:underline"
      aria-label={`View ${productName} to add to cart`}
    >
      Add to cart
    </Link>
  );
}
