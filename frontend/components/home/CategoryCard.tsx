import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className = "" }: CategoryCardProps) {
  return (
    <Link
      href={`/collections/${category.slug}`}
      className={`group relative block overflow-hidden category-card-gradient ${className}`}
    >
      <div className="relative aspect-[190/289] w-full">
        <Image
          src={category.image.src}
          alt={category.image.alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 295px"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent px-4 py-6">
          <p className="font-display text-2xl text-white">{category.name}</p>
        </div>
      </div>
    </Link>
  );
}
