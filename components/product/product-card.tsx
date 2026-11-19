import Link from "next/link";
import type { Product } from "@/lib/types";
import { getCategory } from "@/lib/products";
import { discountPercent } from "@/lib/format";
import { cx } from "@/lib/style";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ProductImage } from "@/components/product/product-image";

export const CARD_IMAGE_SIZES = "(min-width: 1280px) 290px, (min-width: 768px) 30vw, 46vw";

export function ProductCard({ product, preload, className }: { product: Product; preload?: boolean; className?: string }) {
  const off = discountPercent(product.price, product.mrp);
  const category = getCategory(product.category);
  return (
    <article className={cx("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="focus-ring block rounded-sm">
        {/* Just the photo: no shadow, frame or big radius. The tall 2:3 crop trims plain studio
            background from the sides so the outfit fills more of it. */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-sm">
          <ProductImage
            product={product}
            alt=""
            sizes={CARD_IMAGE_SIZES}
            preload={preload}
            className={cx("absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]", !product.inStock && "opacity-60 grayscale-[35%]")}
          />
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {!product.inStock ? (
              <Badge tone="muted">Sold out</Badge>
            ) : (
              <>
                {product.isNew && <Badge tone="new">New</Badge>}
                {off > 0 && <Badge tone="sale">{off}% off</Badge>}
              </>
            )}
          </div>
        </div>

        <div className="mt-3 px-1 sm:mt-4">
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-muted">
            {category?.name} · {product.fabric}
          </p>
          <h3 className="mt-1 font-serif text-base font-medium sm:text-[1.15rem] leading-snug text-ink transition-colors group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <Price price={product.price} mrp={product.mrp} />
            {/* Colour squares from sm up; on phones the price gets the row to itself. */}
            <ul className="hidden shrink-0 -space-x-1 sm:flex" aria-label={`Colours: ${product.colors.map((c) => c.name).join(", ")}`}>
              {product.colors.map((c) => (
                <li
                  key={c.name}
                  title={c.name}
                  className="size-3.5 ring-2 ring-background"
                  style={{ background: c.hex }}
                />
              ))}
            </ul>
          </div>
        </div>
      </Link>
    </article>
  );
}
