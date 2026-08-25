import Image from "next/image";
import Link from "next/link";
import { getCategoryBackground } from "@/lib/config/categories";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className = "" }: CategoryCardProps) {
  const backgroundColor = getCategoryBackground(category.slug);

  return (
    <Link
      href={`/collections/${category.slug}`}
      className={`group relative block h-[449px] w-[295px] shrink-0 overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <Image
        src={category.image.src}
        alt=""
        fill
        aria-hidden
        className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.02]"
        sizes="295px"
      />

      <h3 className="relative z-10 px-4 pt-8 text-center font-display text-4xl font-semibold leading-tight text-viola-text">
        {category.name}
      </h3>
    </Link>
  );
}
