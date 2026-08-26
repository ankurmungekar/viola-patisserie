import Link from "next/link";
import type { Category } from "@/types/category";

interface CategoryTabsProps {
  categories: Category[];
  activeCategorySlug: string | null;
  searchParams?: Record<string, string>;
  className?: string;
}

function buildHref(
  slug: string | null,
  searchParams?: Record<string, string>,
): string {
  const base = slug ? `/collections/${slug}` : "/collections";

  if (!searchParams || Object.keys(searchParams).length === 0) {
    return base;
  }

  const params = new URLSearchParams(searchParams);
  return `${base}?${params.toString()}`;
}

export function CategoryTabs({
  categories,
  activeCategorySlug,
  searchParams,
  className = "",
}: CategoryTabsProps) {
  const tabs = [
    { slug: null, name: "All" },
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
    })),
  ];

  return (
    <nav
      aria-label="Collection categories"
      className={`border-b border-viola-border ${className}`}
    >
      <ul className="-mb-px flex gap-6 overflow-x-auto pb-px md:gap-8">
        {tabs.map((tab) => {
          const isActive = tab.slug === activeCategorySlug;

          return (
            <li key={tab.slug ?? "all"} className="shrink-0">
              <Link
                href={buildHref(tab.slug, searchParams)}
                className={`inline-block border-b-2 pb-3 text-sm uppercase tracking-viola transition-colors ${
                  isActive
                    ? "border-viola-primary font-medium text-viola-text"
                    : "border-transparent font-normal text-viola-text hover:text-viola-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
