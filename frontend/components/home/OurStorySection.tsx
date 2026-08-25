import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { InstagramIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/config/site";

export function OurStorySection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="our-story-heading">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_259px] xl:grid-cols-[1fr_320px]">
          <div>
            <SectionHeading
              eyebrow="our Story"
              title="Meet the Heart Behind Viola"
              align="left"
              className="max-w-none"
            />

            <p className="mt-6 max-w-xl text-base leading-5 tracking-viola-wide text-viola-text">
              Every dessert at Viola Patisserie begins with a passion for
              craftsmanship, thoughtful design, and creating moments worth
              celebrating. Founded by Chef Aishwarya, Viola brings together
              classic pastry techniques and modern elegance to create handcrafted
              desserts that are as memorable as the occasions they celebrate.
            </p>
            <p className="mt-4 max-w-xl text-base leading-5 tracking-viola-wide text-viola-text">
              From intimate celebrations to grand milestones, every creation
              reflects the care, creativity, and dedication that define the
              brand.
            </p>

            <p className="mt-8 text-sm uppercase tracking-viola text-viola-accent">
              Follow Our journey
            </p>
            <Link
              href={siteConfig.instagramUrl}
              className="mt-2 inline-flex items-center gap-3 text-viola-text hover:text-viola-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
              <span className="text-base tracking-viola-wide">
                {siteConfig.instagram}
              </span>
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="outline" href="/about">
                Discover Our Story
              </Button>
              <Button variant="outline" href={siteConfig.instagramUrl}>
                Follow Us
              </Button>
            </div>

            <div className="mt-10 border-t border-viola-border pt-6">
              <p className="text-base tracking-viola-wide text-viola-text">
                -{siteConfig.founder.name}
              </p>
              <p className="mt-1 text-sm tracking-viola-wide text-viola-text">
                {siteConfig.founder.title}
              </p>
            </div>
          </div>

          <div className="relative mx-auto aspect-[259/401] w-full max-w-[259px] overflow-hidden">
            <Image
              src="/images/placeholders/founder.svg"
              alt={`${siteConfig.founder.name}, ${siteConfig.founder.title}`}
              fill
              className="object-cover"
              sizes="259px"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
