// Shared by the two /products/[slug]/photos/[n] pages: the full page (opened directly or refreshed)
// and the modal that intercepts it when you tap a photo on the product page.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { getProductViews } from "@/lib/product-views";
import { PhotoViewer } from "@/components/product/photo-viewer";

export type PhotoParams = Promise<{ slug: string; n: string }>;

function findPhoto(slug: string, n: string) {
  const product = getProductBySlug(slug);
  if (!product) return undefined;
  const views = getProductViews(product);
  const index = Number(n) - 1;
  return Number.isInteger(index) && views[index] ? { product, views, index } : undefined;
}

export function photoStaticParams() {
  return getAllProducts().flatMap((p) => getProductViews(p).map((_, i) => ({ slug: p.slug, n: String(i + 1) })));
}

export async function photoMetadata(params: PhotoParams): Promise<Metadata> {
  const { slug, n } = await params;
  const found = findPhoto(slug, n);
  if (!found) return {};
  return {
    title: `${found.product.name}: ${found.views[found.index].label}`,
    // The product page is the one to index and share.
    alternates: { canonical: `/products/${slug}` },
    robots: { index: false, follow: true },
  };
}

export async function PhotoViewerRoute({ params, modal }: { params: PhotoParams; modal: boolean }) {
  const { slug, n } = await params;
  const found = findPhoto(slug, n);
  if (!found) notFound();
  return (
    <PhotoViewer slug={slug} productName={found.product.name} views={found.views} start={found.index} modal={modal} />
  );
}
