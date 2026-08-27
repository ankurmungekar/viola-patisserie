import Image from "next/image";
import type { AboutFounderContent } from "@/types/about";

interface AboutFounderSectionProps {
  content: AboutFounderContent;
}

export function AboutFounderSection({ content }: AboutFounderSectionProps) {
  const {
    eyebrow,
    titleLine1,
    titleAccent,
    paragraphs,
    signature,
    signatureTitle,
    image,
  } = content;

  return (
    <section aria-labelledby="about-founder-heading">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,569px)_minmax(0,1fr)] lg:gap-[103px]">
        <div className="relative">
          <div className="relative aspect-[569/570] w-full overflow-hidden lg:aspect-auto lg:h-[570px]">
            <Image
              src={image.src}
              alt={image.alt}
              width={569}
              height={570}
              className="h-full w-full object-cover"
              sizes="(max-width: 1024px) 100vw, 569px"
            />
          </div>

          <div className="about-founder-signature absolute bottom-0 right-0 flex max-w-[317px] flex-col items-start px-10 py-8 sm:right-4 sm:bottom-4">
            <p className="font-[family-name:var(--font-italianno)] text-[32px] leading-5 tracking-viola-wide text-viola-accent md:text-[36px]">
              -{signature}
            </p>
            <p className="mt-3 text-base leading-5 tracking-viola-wide text-viola-text">
              {signatureTitle}
            </p>
          </div>
        </div>

        <div className="lg:pt-2">
          <p className="text-sm uppercase tracking-viola text-viola-accent">
            {eyebrow}
          </p>
          <h2
            id="about-founder-heading"
            className="mt-3 font-display text-[40px] font-semibold leading-[1.15] md:text-[48px]"
          >
            <span className="text-viola-text">{titleLine1}</span>
            <br />
            <span className="text-viola-accent">{titleAccent}</span>
          </h2>

          <div className="mt-8 max-w-[568px] space-y-5 text-base leading-5 tracking-viola-wide text-viola-text">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
