import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  InstagramIcon,
  MapPinIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name} for orders, custom cakes, and delivery queries in Mumbai.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name} for orders, custom cakes, and delivery queries in Mumbai.`,
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-20 pt-[30px] md:px-8 xl:px-[100px]">
      <nav
        aria-label="Breadcrumb"
        className="text-sm uppercase tracking-viola text-viola-text/70"
      >
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <li>
            <Link href="/" className="hover:text-viola-primary">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-viola-text" aria-current="page">
            Contact Us
          </li>
        </ol>
      </nav>

      <div className="mt-[30px] grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div>
          <h1 className="font-display text-4xl font-semibold text-viola-text md:text-5xl">
            Contact us
          </h1>
          <p className="mt-4 max-w-xl text-base tracking-viola-wide text-viola-text/80">
            Have a question about an order, a custom cake, or delivery? Send us
            a message and we will get back to you.
          </p>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>

        <aside className="border border-viola-border bg-white p-6">
          <h2 className="font-display text-2xl font-semibold text-viola-text">
            Other ways to reach us
          </h2>
          <ul className="mt-6 space-y-5 text-base tracking-viola-wide text-viola-text">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                <WhatsAppIcon />
              </span>
              <div>
                <p className="text-sm uppercase tracking-viola text-viola-accent">
                  WhatsApp / Phone
                </p>
                <a
                  href={siteConfig.whatsappUrl}
                  className="mt-1 block hover:text-viola-primary"
                >
                  {siteConfig.phone}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                <MapPinIcon />
              </span>
              <div>
                <p className="text-sm uppercase tracking-viola text-viola-accent">
                  Studio
                </p>
                <p className="mt-1">{siteConfig.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">
                <InstagramIcon />
              </span>
              <div>
                <p className="text-sm uppercase tracking-viola text-viola-accent">
                  Instagram
                </p>
                <a
                  href={siteConfig.instagramUrl}
                  className="mt-1 block hover:text-viola-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {siteConfig.instagram}
                </a>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
