"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Expand } from "lucide-react";
import type { Product } from "@/lib/types";
import { getProductViews, photoHref } from "@/lib/product-views";
import { cx } from "@/lib/style";
import { Badge } from "@/components/ui/badge";
import { ProductImage, ProductViewImage } from "@/components/product/product-image";

const MAIN_SIZES = "(min-width: 768px) 45vw, 92vw";
const thumbClass = (active: boolean) =>
  cx(
    "focus-ring relative block aspect-[3/4] w-16 overflow-hidden rounded-sm ring-1 transition sm:w-20",
    active ? "ring-2 ring-primary" : "ring-gold/40 opacity-75 hover:opacity-100"
  );

/**
 * The product page gallery. Swipe (or pick a thumbnail) to move between views; tapping a view opens
 * it full screen at /products/[slug]/photos/[n], where it can be zoomed. That route opens over this
 * page as a modal, so Back closes it.
 *
 * Without photos it shows the fabric placeholder, with one thumbnail per colourway.
 */
export function ProductGallery({
  product,
  colorIndex,
  onColorChange,
}: {
  product: Product;
  colorIndex: number;
  onColorChange: (index: number) => void;
}) {
  const views = getProductViews(product);
  const [index, setIndex] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);

  const soldOut = !product.inStock && (
    <Badge tone="muted" className="pointer-events-none absolute bottom-4 left-4">
      Sold out
    </Badge>
  );

  if (views.length === 0) {
    return (
      <div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
          <ProductImage product={product} colorIndex={colorIndex} sizes={MAIN_SIZES} preload className="absolute inset-0" />
          {soldOut}
        </div>
        {product.colors.length > 1 && (
          <ul className="mt-4 flex gap-3" aria-label="Colourways">
            {product.colors.map((c, i) => (
              <li key={c.name}>
                <button
                  type="button"
                  onClick={() => onColorChange(i)}
                  aria-label={c.name}
                  aria-pressed={colorIndex === i}
                  className={thumbClass(colorIndex === i)}
                >
                  <ProductImage product={product} colorIndex={i} alt="" sizes="80px" className="absolute inset-0" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted">Illustration only. Photos of this piece are coming soon.</p>
      </div>
    );
  }

  // Thumbnails scroll the strip; the scroll position then decides which view is current.
  function show(i: number) {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth });
  }

  return (
    <div>
      {/* Just the photo, like the product cards: no shadow, frame or big radius. */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
        <div
          ref={scroller}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          className="flex size-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {views.map((view, i) => (
            <Link
              key={i}
              href={photoHref(product.slug, i)}
              scroll={false}
              draggable={false}
              // Only the view in front can be clicked or tabbed to; the thumbnails move between them.
              inert={i !== index}
              className="relative block size-full shrink-0 snap-center snap-always cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-gold"
            >
              <ProductViewImage view={view} sizes={MAIN_SIZES} preload={i === 0} className="absolute inset-0" />
              <span className="sr-only"> (opens full screen)</span>
            </Link>
          ))}
        </div>
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-background/85 text-ink shadow-sm ring-1 ring-gold/40"
        >
          <Expand className="size-4" strokeWidth={1.75} />
        </span>
        {soldOut}
      </div>

      {views.length > 1 && (
        <ul className="mt-4 flex gap-3" aria-label="Photos">
          {views.map((view, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => show(i)}
                aria-label={view.label}
                aria-pressed={index === i}
                className={thumbClass(index === i)}
              >
                <ProductViewImage view={view} alt="" sizes="80px" className="absolute inset-0" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
