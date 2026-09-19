import type { Metadata } from "next";
import { Cormorant_Garamond, Italianno, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { Footer } from "@/components/layout/Footer";
import { HeaderWithCart } from "@/components/layout/HeaderWithCart";
import { siteConfig } from "@/lib/config/site";
import { getHomepageContent } from "@/lib/wordpress/homepage";
import {
  CART_TOKEN_COOKIE,
  getCartWithSession,
  getItemsCountFromCart,
} from "@/lib/woocommerce/cart-server";
import { getNavCategories } from "@/lib/woocommerce/categories";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    type: "website",
    locale: "en_IN",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [categories, homepage] = await Promise.all([
    getNavCategories(),
    getHomepageContent(),
  ]);

  let cartCount = 0;

  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get(CART_TOKEN_COOKIE)?.value;
    const { cart } = await getCartWithSession(cartToken);
    cartCount = getItemsCountFromCart(cart);
  } catch {
    cartCount = 0;
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${sourceSans.variable} ${italianno.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-viola-text">
        <noscript>
          <style>{`.reveal,.reveal-stagger>*,.hero-copy>*,.hero-media{opacity:1;transform:none;animation:none;transition:none}`}</style>
        </noscript>
        <HeaderWithCart
          categories={categories}
          site={homepage.site}
          initialCartCount={cartCount}
        />
        <main className="flex-1 overflow-x-clip pt-[136px]">{children}</main>
        <Footer categories={categories} site={homepage.site} />
      </body>
    </html>
  );
}
