import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";

const OUR_STORY_IMAGE = "/images/about-viola.jpg";

export function OurStorySection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="grid overflow-hidden lg:grid-cols-[minmax(0,1fr)_531px]">
          <div className="flex flex-col justify-center custom-cakes-gradient px-6 py-12 md:px-[85px] md:py-16 lg:min-h-[664px]">
            <p className="text-sm uppercase tracking-viola text-viola-accent">
              our Story
            </p>
            <h2
              id="our-story-heading"
              className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl"
            >
              <span className="text-viola-text">Meet the Heart Behind</span>
              <br />
              <span className="text-viola-accent">Viola</span>
            </h2>

            <div className="mt-8 max-w-[440px] space-y-5 text-base leading-5 tracking-viola-wide text-viola-text">
              <p>
                Every dessert at Viola Patisserie begins with a passion for
                craftsmanship, thoughtful design, and creating moments worth
                celebrating. Founded by Chef Aishwarya, Viola brings together
                classic pastry techniques and modern elegance to create
                handcrafted desserts that are as memorable as the occasions they
                celebrate.
              </p>
              <p>
                From intimate celebrations to grand milestones, every creation
                reflects the care, creativity, and dedication that define the
                brand.
              </p>
            </div>

            <p className="mt-10 font-[family-name:var(--font-italianno)] text-4xl leading-5 tracking-viola-wide text-viola-accent">
              -{siteConfig.founder.name}
            </p>
            <p className="mt-2 text-base leading-5 tracking-viola-wide text-viola-text">
              {siteConfig.founder.title}
            </p>

            <div className="mt-8">
              <Button href="/about">Discover Our Story</Button>
            </div>
          </div>

          <div className="relative aspect-[531/664] w-full lg:aspect-auto lg:min-h-[664px]">
            <Image
              src={OUR_STORY_IMAGE}
              alt={`${siteConfig.founder.name}, ${siteConfig.founder.title}`}
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
