import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  footerExploreLinks,
  footerHelpLinks,
  siteConfig,
} from "@/lib/config/site";
import type { Category } from "@/types/category";

interface FooterProps {
  categories: Category[];
}

export function Footer({ categories }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-viola-border bg-white">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/images/logo.svg"
              alt={siteConfig.name}
              width={130}
              height={93}
              className="mb-4 h-[72px] w-auto"
            />
            <p className="max-w-xs text-base leading-5 tracking-viola-wide text-viola-text">
              {siteConfig.tagline}
            </p>
            <p className="mt-6 text-base tracking-viola-wide text-viola-text">
              {siteConfig.address}
            </p>
            <p className="mt-2 text-base tracking-viola-wide text-viola-text">
              {siteConfig.phoneDisplay}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-viola text-viola-accent">
              Signature collection
            </p>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-viola text-viola-accent">
              Explore
            </p>
            <ul className="space-y-2">
              {footerExploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm uppercase tracking-viola text-viola-accent">
              Help
            </p>
            <ul className="space-y-2">
              {footerHelpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base leading-[30px] tracking-viola-wide text-viola-text hover:text-viola-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <div className="bg-viola-topbar">
        <Container>
          <p className="py-2.5 text-center text-sm tracking-viola-wide text-viola-text">
            © {new Date().getFullYear()} {siteConfig.name}.
          </p>
        </Container>
      </div>
    </footer>
  );
}
