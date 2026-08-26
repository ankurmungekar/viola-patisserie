import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ProductBreadcrumbs } from "@/components/product/ProductBreadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchaseForm } from "@/components/product/ProductPurchaseForm";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { siteConfig } from "@/lib/config/site";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/woocommerce/products";

interface ProductPageProps {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription || product.description,
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.shortDescription || product.description,
      images: product.images[0]?.src ? [product.images[0].src] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  if (product.primaryCategory.slug !== categorySlug) {
    redirect(product.permalink);
  }

  const relatedProducts = await getRelatedProducts(
    product.primaryCategory.slug,
    product.id,
    4,
  );

  return (
    <>
      <section className="py-8 md:py-12">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8 xl:px-[100px]">
          <ProductBreadcrumbs
            category={product.primaryCategory}
            productName={product.name}
          />

          <div className="mt-8 grid gap-10 lg:grid-cols-[540px_minmax(0,1fr)] lg:gap-x-[68px]">
            <ProductGallery images={product.images} />
            <ProductPurchaseForm product={product} />
          </div>
        </div>
      </section>

      <RelatedProducts products={relatedProducts} />
    </>
  );
}
