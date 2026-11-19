import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { Mandala } from "@/components/mandala";
import { ButtonLink } from "@/components/ui/button";
import { Finial } from "@/components/ui/sparkle";
import { Toran } from "@/components/ui/toran";
import { SearchBar } from "@/components/shop/search-bar";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

// Rendered for unknown URLs and notFound() calls. A notFound() from a shop page (e.g. an unknown
// product) renders inside the (store) layout's <main>; other unknown URLs get just the root layout,
// hence the small wordmark link. The wrapper is a <div> so <main> is never nested.
export default function NotFound() {
  return (
    <div className="silk-bg relative flex min-h-svh flex-1 flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <Toran className="absolute inset-x-0 top-0" />
      <Mandala className="mandala-spin pointer-events-none absolute left-1/2 top-1/2 w-[min(46rem,140vw)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-20" />

      <div className="relative max-w-lg">
        <Link href="/" className="focus-ring inline-block rounded-sm font-serif text-2xl italic text-primary">
          {site.shortName}
        </Link>
        <Finial className="mx-auto mt-10 w-12" />
        <p className="mt-4 font-serif text-[clamp(4rem,12vw,7rem)] font-medium italic leading-none text-primary">404</p>
        <h1 className="mt-4 font-serif text-3xl font-medium text-ink">This page slipped off the hanger</h1>
        <p className="mt-4 leading-relaxed text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try a search, or head back to the collection.
        </p>
        <SearchBar id="notfound-search" className="mx-auto mt-8 max-w-sm text-left" />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/products">
            Shop the collection <ArrowRight aria-hidden className="size-4" />
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Home
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
