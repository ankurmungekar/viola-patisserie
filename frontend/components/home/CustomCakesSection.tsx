import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { CustomCakesContent } from "@/types/homepage";

interface CustomCakesSectionProps {
  content: CustomCakesContent;
}

export function CustomCakesSection({ content }: CustomCakesSectionProps) {
  const {
    eyebrow,
    titleDark,
    titleAccent,
    description,
    ctaLabel,
    ctaUrl,
    image,
  } = content;

  return (
    <section className="py-16 md:py-20" aria-labelledby="custom-cakes-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="relative min-h-[320px] overflow-hidden md:min-h-[426px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1240px"
          />

          <div className="relative flex justify-end px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
            <div className="max-w-[440px]">
              <p className="text-sm uppercase tracking-viola text-viola-accent">
                {eyebrow}
              </p>
              <h2
                id="custom-cakes-heading"
                className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl"
              >
                <span className="text-viola-text">{titleDark}</span>
                <br />
                <span className="text-viola-accent">{titleAccent}</span>
              </h2>
              <p className="mt-4 text-base leading-5 tracking-viola-wide text-viola-text">
                {description}
              </p>
              <div className="mt-8">
                <Button href={ctaUrl}>{ctaLabel}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
