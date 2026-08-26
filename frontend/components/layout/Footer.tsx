import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, WhatsAppIcon } from "@/components/icons";
import { footerExploreLinks, footerHelpLinks } from "@/lib/config/site";
import type { Category } from "@/types/category";
import type { SiteContent } from "@/types/homepage";

interface FooterProps {
  categories: Category[];
  site: SiteContent;
}

const footerCategoryLabels: Record<string, string> = {
  cakes: "Cake",
  macarons: "Macarons",
  "tea-cakes": "Tea cakes",
  "bento-cakes": "Bento Cakes",
  cupcakes: "Cupcakes",
  brownies: "Brownies",
};

export function Footer({ categories, site }: FooterProps) {
  return (
    <footer className="border-t border-viola-border bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 md:px-8 xl:px-[100px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full max-w-[346px] shrink-0">
            <Image
              src="/images/logo.svg"
              alt={site.name}
              width={130}
              height={93}
              className="h-[93px] w-[130px]"
            />
            <p className="mt-3 max-w-[346px] text-base leading-5 tracking-viola-wide text-viola-text">
              {site.tagline}
            </p>
            <div className="mt-6 flex items-start gap-2 text-base leading-5 tracking-viola-wide text-viola-text">
              <span className="mt-0.5 shrink-0 text-viola-text">
                <MapPinIcon />
              </span>
              <span>{site.address}</span>
            </div>
            <div className="mt-2 flex items-start gap-2 text-base leading-5 tracking-viola-wide text-viola-text">
              <span className="mt-1 shrink-0 text-viola-text">
                <WhatsAppIcon />
              </span>
              <span>{site.phoneDisplay}</span>
            </div>
          </div>

          <div className="w-full max-w-[233px] shrink-0">
            <p className="text-sm uppercase tracking-viola text-viola-accent">
              Signature collection
            </p>
            <ul className="mt-4 space-y-0">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="block py-0.5 text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {footerCategoryLabels[category.slug] ?? category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-[232px] shrink-0">
            <p className="text-sm uppercase tracking-viola text-viola-accent">
              Explore
            </p>
            <ul className="mt-4 space-y-0">
              {footerExploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-0.5 text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full max-w-[232px] shrink-0">
            <p className="text-sm uppercase tracking-viola text-viola-accent">
              Help
            </p>
            <ul className="mt-4 space-y-0">
              {footerHelpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-0.5 text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-viola-border bg-viola-topbar">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
          <p className="py-2.5 text-center text-sm tracking-viola-wide text-viola-text">
            © {new Date().getFullYear()} {site.name}.
          </p>
        </div>
      </div>
    </footer>
  );
}
