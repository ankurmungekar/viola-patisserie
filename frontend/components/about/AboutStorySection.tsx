import Image from "next/image";
import type { AboutStoryContent } from "@/types/about";

interface AboutStorySectionProps {
  content: AboutStoryContent;
}

export function AboutStorySection({ content }: AboutStorySectionProps) {
  const { eyebrow, titleLine1, titleAccent, paragraphs, image } = content;

  return (
    <section aria-labelledby="about-story-heading">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,569px)_minmax(0,1fr)] lg:gap-[103px]">
        <div className="relative aspect-[569/456] w-full overflow-hidden lg:aspect-auto lg:h-[456px]">
          <Image
            src={image.src}
            alt={image.alt}
            width={569}
            height={456}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 569px"
            priority
          />
        </div>

        <div className="lg:pt-2">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            {eyebrow}
          </p>
          <h1
            id="about-story-heading"
            className="mt-3 font-display text-[40px] font-semibold leading-[1.15] md:text-[48px]"
          >
            <span className="text-viola-text">{titleLine1}</span>
            <br />
            <span className="text-viola-accent">{titleAccent}</span>
          </h1>

          <div className="mt-8 max-w-[564px] space-y-5 text-base leading-5 tracking-viola-wide text-viola-text">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
