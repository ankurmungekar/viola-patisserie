import Image from "next/image";
import Link from "next/link";
import type { PromoBannerContent } from "@/types/promo-banner";

interface PromoBannerProps {
  content: PromoBannerContent;
  className?: string;
}

export function PromoBanner({ content, className = "" }: PromoBannerProps) {
  const { eyebrow, titlePrefix, titleAccent, ctaLabel, ctaUrl, image } = content;

  return (
    <div
      className={`custom-cakes-gradient flex min-h-[160px] flex-col overflow-hidden md:flex-row md:items-center ${className}`}
    >
      <div className="relative h-40 w-full shrink-0 md:h-[160px] md:w-[38%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 466px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            {eyebrow}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold leading-tight text-viola-text md:text-[40px]">
            {titlePrefix}{" "}
            <span className="font-[family-name:var(--font-italianno)] text-viola-accent">
              {titleAccent}
            </span>
          </p>
        </div>

        <Link
          href={ctaUrl}
          className="inline-flex h-12 shrink-0 items-center justify-center bg-viola-primary px-4 text-center text-base tracking-viola-wide text-white md:max-w-[307px]"
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
