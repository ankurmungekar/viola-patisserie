import Image from "next/image";
import Link from "next/link";
import { EyeIcon, InstagramIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";

const instagramPosts = [
  { id: 1, views: "2,186", image: "/images/instagram-1.jpg" },
  { id: 2, views: "1,599", image: "/images/instagram-2.jpg" },
  { id: 3, views: "18.1K", image: "/images/instagram-3.jpg" },
] as const;

export function InstagramSection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="instagram-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="w-full shrink-0 lg:w-[440px]">
            <InstagramIcon />
            <p className="mt-4 text-sm uppercase tracking-viola text-viola-accent">
              Follow Our journey
            </p>
            <h2
              id="instagram-heading"
              className="mt-3 font-display text-[40px] font-semibold leading-[1.1] text-viola-accent md:text-5xl"
            >
              {siteConfig.instagram}
            </h2>
            <p className="mt-4 max-w-[440px] text-base leading-5 tracking-viola-wide text-viola-text">
              Join our growing community on Instagram. Tag us to be featured
            </p>
            <div className="mt-8">
              <Button variant="outline" href={siteConfig.instagramUrl}>
                Follow Us
              </Button>
            </div>
          </div>

          <div className="min-w-0 flex-1 overflow-x-auto lg:overflow-visible">
            <div className="grid w-max grid-cols-3 gap-5 lg:w-full">
              {instagramPosts.map(({ id, views, image }) => (
                <Link
                  key={id}
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-[259/401] w-[259px] overflow-hidden lg:w-auto"
                >
                  <Image
                    src={image}
                    alt={`Instagram post ${id}`}
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
