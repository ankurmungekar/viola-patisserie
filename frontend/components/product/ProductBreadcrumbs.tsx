import Link from "next/link";
import type { ProductCategoryRef } from "@/types/product";

interface ProductBreadcrumbsProps {
  category: ProductCategoryRef;
  productName: string;
  className?: string;
}

export function ProductBreadcrumbs({
  category,
  productName,
  className = "",
}: ProductBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`text-sm tracking-viola-wide text-viola-text/70 ${className}`}
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-viola-primary">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href="/collections" className="hover:text-viola-primary">
            Collection
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link
            href={`/collections/${category.slug}`}
            className="hover:text-viola-primary capitalize"
          >
            {category.name}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-viola-text capitalize" aria-current="page">
          {productName}
        </li>
      </ol>
    </nav>
  );
}
