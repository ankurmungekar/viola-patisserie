import Image from "next/image";
import Link from "next/link";
import { EyeIcon, InstagramIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { InstagramContent } from "@/types/homepage";

interface InstagramSectionProps {
  content: InstagramContent;
}

export function InstagramSection({ content }: InstagramSectionProps) {
  const { eyebrow, handle, description, ctaLabel, ctaUrl, posts } = content;

  return (
    <section className="py-16 md:py-20" aria-labelledby="instagram-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="w-full shrink-0 lg:w-[440px]">
            <InstagramIcon />
            <p className="mt-4 text-sm uppercase tracking-viola text-viola-accent">
              {eyebrow}
            </p>
            <h2
              id="instagram-heading"
              className="mt-3 font-display text-[40px] font-semibold leading-[1.1] text-viola-accent md:text-5xl"
            >
              {handle}
            </h2>
            <p className="mt-4 max-w-[440px] text-base leading-5 tracking-viola-wide text-viola-text">
              {description}
            </p>
            <div className="mt-8">
              <Button variant="outline" href={ctaUrl}>
                {ctaLabel}
              </Button>
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto lg:overflow-visible">
            <div className="reveal-stagger grid w-max grid-cols-3 gap-5 lg:w-full">
              {posts.map(({ id, views, url, image }) => (
                <Link
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[259/401] w-[259px] overflow-hidden lg:w-auto"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="259px"
                  />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm leading-none text-white">
                    <EyeIcon />
                    <span>{views}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
