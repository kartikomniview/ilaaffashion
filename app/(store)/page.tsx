import type { Metadata } from "next";
import { mapsUrl, site } from "@/lib/site";
import { getByOccasion, getNewArrivals, productsHref } from "@/lib/products";
import { JsonLd } from "@/components/ui/json-ld";
import { Hero } from "@/components/home/hero";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { ProductRail } from "@/components/home/product-rail";
import { OccasionTiles } from "@/components/home/occasion-tiles";
import { VisitShowroom } from "@/components/home/visit-showroom";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Structured data so search engines can show the store in local results.
const storeJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: site.name,
  url: site.url,
  image: `${site.url}/og-share.jpg`,
  description: "Women's ethnic wear store at Jahangirabad Square, Bhopal: kurtis, kurta sets, sarees, lehengas and more.",
  telephone: site.contact.phone,
  // TODO(client): add `openingHours` here once the real hours are in lib/site.ts.
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: site.address.country,
  },
  hasMap: mapsUrl,
};

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryShowcase />

      <ProductRail
        id="new"
        title="New arrivals"
        products={getNewArrivals(8)}
        viewAllHref={productsHref({ sort: "newest" })}
      />

      <OccasionTiles />

      <ProductRail
        id="festive"
        title="For the shaadi season"
        products={getByOccasion(["Wedding", "Festive"], 8)}
        viewAllHref={productsHref({ occasion: ["Wedding", "Festive"] })}
      />

      <VisitShowroom />

      <JsonLd data={storeJsonLd} />
    </>
  );
}
