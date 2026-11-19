import type { Product } from "@/lib/types";
import { cx } from "@/lib/style";
import { ProductCard } from "@/components/product/product-card";

/** Responsive product grid. Use `columns={3}` next to a sidebar, 4 for full width. */
export function ProductGrid({ products, columns = 4 }: { products: Product[]; columns?: 3 | 4 }) {
  return (
    <div
      className={cx(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3",
        columns === 4 && "xl:grid-cols-4"
      )}
    >
      {/* The first row (up to three across) is above the fold, and its biggest photo is the page's LCP. */}
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} preload={i < 3} />
      ))}
    </div>
  );
}
