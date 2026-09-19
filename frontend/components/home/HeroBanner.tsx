import Image from "next/image";
import { HeroCopy } from "@/components/home/HeroCopy";
import { Button } from "@/components/ui/Button";
import type { HeroContent } from "@/types/homepage";

interface HeroBannerProps {
  content: HeroContent;
}

export function HeroBanner({ content }: HeroBannerProps) {
  const {
    eyebrowTags,
    titleLine1,
    titleLine2,
    description,
    ctaLabel,
    ctaUrl,
    image,
  } = content;

  return (
    <section className="relative min-h-[420px] overflow-hidden bg-[#F4F0F2] md:min-h-[664px]">
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          className="hero-media object-cover"
          style={{ objectPosition: "right center" }}
          sizes="100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/85 via-white/30 to-transparent md:from-white/70 md:via-white/15 md:to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[420px] w-full max-w-[1440px] items-center px-4 py-12 md:min-h-[664px] md:px-8 md:py-16 xl:px-[100px]">
        <HeroCopy>
          <p className="mb-4 flex flex-wrap items-center gap-3 text-sm uppercase tracking-viola text-viola-accent">
            {eyebrowTags.map((tag, index) => (
              <span key={tag} className="contents">
                {index > 0 ? (
                  <span
                    className="h-[3px] w-[3px] rounded-full bg-viola-accent"
                    aria-hidden="true"
                  />
                ) : null}
                <span>{tag}</span>
              </span>
            ))}
          </p>

          <h1 className="font-display text-4xl font-semibold uppercase leading-tight text-viola-text sm:text-5xl md:text-[60px] md:leading-[1.1]">
            {titleLine1}
            <span className="block text-viola-accent">{titleLine2}</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-6 tracking-viola-wide text-viola-text md:text-xl md:leading-6">
            {description}
          </p>

          <div className="mt-8">
            <Button href={ctaUrl}>{ctaLabel}</Button>
          </div>
        </HeroCopy>
      </div>
    </section>
  );
}
