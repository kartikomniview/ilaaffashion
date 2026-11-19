import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Ruler, Palette } from "lucide-react";
import { getAllProducts, getCategory, getProductBySlug, getRelatedProducts, productsHref } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { shareImage, site } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/ui/json-ld";
import { ProductShowcase } from "@/components/product/product-showcase";
import { RelatedProducts } from "@/components/product/related-products";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  const path = `/products/${product.slug}`;
  const title = `${product.name} · ${formatPrice(product.price)}`;
  const image = product.images[0] ? { url: product.images[0], alt: product.name } : shareImage;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: path },
    openGraph: { title, description: product.description, url: path, siteName: site.name, locale: "en_IN", images: [image] },
    twitter: { card: "summary_large_image", title, description: product.description, images: [image] },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const url = `${site.url}/products/${product.slug}`;
  const related = getRelatedProducts(product, 4);

  const facts = [
    { label: "Fabric", value: product.fabric },
    { label: "Work", value: product.work },
    { label: "Occasion", value: product.occasion.join(", ") },
    { label: "Colours", value: product.colors.map((c) => c.name).join(", ") },
    { label: "Sizes", value: product.sizes.join(", ") },
    { label: "Code", value: product.id },
  ];

  return (
    <>
      <Container className="pb-4 pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/products" },
            ...(category ? [{ label: category.name, href: productsHref({ category: [category.slug] }) }] : []),
            { label: product.name },
          ]}
        />
        <div className="mt-8">
          <ProductShowcase product={product} categoryName={category?.name ?? ""} url={url} />
        </div>

        {/* Details */}
        <section aria-labelledby="details-title" className="mt-12 grid gap-8 md:mt-20 md:grid-cols-[1.4fr_1fr] md:gap-10 lg:gap-16">
          <div className="rounded-sm border border-gold/40 bg-surface/70 p-5 sm:p-8">
            <h2 id="details-title" className="font-serif text-2xl font-medium text-ink">
              Product details
            </h2>
            <ul className="mt-4 list-inside list-['✿__'] space-y-2 text-sm leading-relaxed text-muted marker:text-gold">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-dashed border-gold/50 pt-6 text-sm sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.62rem] uppercase tracking-[0.3em] text-muted">{f.label}</dt>
                  <dd className="mt-1 text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-medium text-ink">Good to know</h2>
            <ul className="mt-5 space-y-5 text-sm leading-relaxed text-muted">
              <li className="flex gap-3">
                <Palette aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
                Colours can look a little different on every screen. Ask us for a photo or video of the
                actual piece on WhatsApp.
              </li>
              <li className="flex gap-3">
                <Ruler aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
                Not sure about your size? Send us your measurements and we&apos;ll help you choose.
              </li>
              <li className="flex gap-3">
                <MessageCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.5} />
                Prefer to see it first? Visit our showroom at Jahangirabad Square, Bhopal.
              </li>
            </ul>
          </div>
        </section>
      </Container>

      {related.length > 0 && <RelatedProducts products={related} />}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.id,
          description: product.description,
          image: product.images.length ? product.images.map((src) => `${site.url}${src}`) : `${site.url}${shareImage.url}`,
          brand: { "@type": "Brand", name: site.name },
          category: category?.name,
          material: product.fabric,
          color: product.colors.map((c) => c.name).join(", "),
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: "INR",
            price: product.price,
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: site.name },
          },
        }}
      />
    </>
  );
}
