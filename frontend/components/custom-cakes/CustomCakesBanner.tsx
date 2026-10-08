import Image from "next/image";
import { WhatsAppIcon } from "@/components/icons";
import type { CustomCakeBannerContent } from "@/types/custom-cakes";

interface CustomCakesBannerProps {
  content: CustomCakeBannerContent;
}

export function CustomCakesBanner({ content }: CustomCakesBannerProps) {
  const {
    eyebrow,
    titleLead,
    titleAccent,
    description,
    ctaLabel,
    ctaUrl,
    image,
  } = content;

  return (
    <section
      className="relative min-h-[280px] overflow-hidden md:min-h-[316px]"
      aria-labelledby="custom-cakes-hero"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        className="object-cover object-left"
        sizes="(max-width: 1440px) 100vw, 1240px"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#F3E6F4]/30 to-[#F3E6F4]/85"
        aria-hidden="true"
      />
      <div className="relative flex min-h-[280px] items-center justify-end px-5 py-10 md:min-h-[316px] md:px-12 lg:px-16">
        <div className="max-w-[720px]">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            {eyebrow}
          </p>
          <h1
            id="custom-cakes-hero"
            className="mt-2 whitespace-nowrap font-display text-[clamp(1.5rem,3.6vw,3.75rem)] font-semibold uppercase leading-none"
          >
            <span className="text-viola-text">{titleLead} </span>
            <span className="text-viola-accent">{titleAccent}</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-base leading-6 tracking-viola-wide text-viola-text md:text-xl md:leading-6">
            {description}
          </p>
          <a
            href={ctaUrl}
            className="mt-8 inline-flex h-12 items-center gap-2.5 bg-viola-primary px-4 text-xl tracking-viola-wide text-white transition-colors hover:bg-[#5a1a72]"
          >
            {ctaLabel}
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
