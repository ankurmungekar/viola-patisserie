import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { CUSTOM_CAKES_IMAGE } from "@/lib/config/home-images";

export function CustomCakesSection() {
  return (
    <section className="py-16 md:py-20" aria-labelledby="custom-cakes-heading">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
        <div className="relative min-h-[320px] overflow-hidden md:min-h-[426px]">
          <Image
            src={CUSTOM_CAKES_IMAGE}
            alt="Custom celebration cake with floral decorations"
            fill
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1240px"
          />

          <div className="relative flex justify-end px-6 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
            <div className="max-w-[440px]">
              <p className="text-sm uppercase tracking-viola text-viola-accent">
                Custom Cake Orders
              </p>
              <h2
                id="custom-cakes-heading"
                className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl"
              >
                <span className="text-viola-text">Made Just for Your</span>
                <br />
                <span className="text-viola-accent">Celebration</span>
              </h2>
              <p className="mt-4 text-base leading-5 tracking-viola-wide text-viola-text">
                Every celebration is unique and your cake should be too. Share
                your ideas, theme, flavours, and inspiration, and we&apos;ll
                create a handcrafted cake designed exclusively for your special
                occasion
              </p>
              <div className="mt-8">
                <Button href="/contact">Contact Us for a Custom Order</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
