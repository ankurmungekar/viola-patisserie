import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { OurStoryContent } from "@/types/homepage";

interface OurStorySectionProps {
  content: OurStoryContent;
}

export function OurStorySection({ content }: OurStorySectionProps) {
  const {
    eyebrow,
    titleDark,
    titleAccent,
    paragraphs,
    signature,
    signatureTitle,
    ctaLabel,
    ctaUrl,
    image,
  } = content;

  return (
    <section className="py-16 md:py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_531px]">
          <div className="flex flex-col justify-center custom-cakes-gradient px-6 py-12 md:px-[85px] md:py-16 lg:min-h-[664px]">
            <p className="text-sm uppercase tracking-viola text-viola-accent">
              {eyebrow}
            </p>
            <h2
              id="our-story-heading"
              className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl"
            >
              <span className="text-viola-text">{titleDark}</span>
              <br />
              <span className="text-viola-accent">{titleAccent}</span>
            </h2>

            <div className="mt-8 max-w-[440px] space-y-5 text-base leading-5 tracking-viola-wide text-viola-text">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-10 font-[family-name:var(--font-italianno)] text-4xl leading-5 tracking-viola-wide text-viola-accent">
              -{signature}
            </p>
            <p className="mt-2 text-base leading-5 tracking-viola-wide text-viola-text">
              {signatureTitle}
            </p>

            <div className="mt-8">
              <Button href={ctaUrl}>{ctaLabel}</Button>
            </div>
          </div>

          <div className="relative aspect-[531/664] w-full lg:aspect-auto lg:min-h-[664px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 531px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
