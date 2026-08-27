import Image from "next/image";
import { CakeIcon } from "@/components/icons";
import type { AboutHighlightContent } from "@/types/about";

interface AboutHighlightSectionProps {
  content: AboutHighlightContent;
}

export function AboutHighlightSection({ content }: AboutHighlightSectionProps) {
  const { paragraphs, statValue, statLabel, image } = content;

  return (
    <section aria-label="Viola Patisserie highlights">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="about-highlight-bg flex flex-col gap-10 px-10 py-8 sm:flex-row sm:items-center lg:min-h-[266px] lg:flex-1 lg:max-w-[904px] lg:gap-8">
          <div className="max-w-[565px] space-y-5 text-base leading-5 tracking-viola-wide text-viola-text sm:flex-1">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="flex shrink-0 flex-col items-center justify-center text-center sm:px-4">
            <CakeIcon className="h-[60px] w-[60px]" />
            <p className="mt-3 font-sans text-[48px] font-semibold leading-none text-viola-accent md:text-[60px]">
              {statValue}
            </p>
            <p className="mt-2 text-sm leading-5 tracking-viola-wide text-viola-text">
              {statLabel}
            </p>
          </div>
        </div>

        <div className="relative aspect-[316/266] w-full shrink-0 overflow-hidden lg:aspect-auto lg:h-[266px] lg:w-[316px]">
          <Image
            src={image.src}
            alt={image.alt}
            width={316}
            height={266}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 316px"
          />
        </div>
      </div>
    </section>
  );
}
