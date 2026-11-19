import type { Product } from "@/lib/types";
import { productsHref } from "@/lib/products";
import { ProductRail } from "@/components/home/product-rail";

/** "You may also like": same category first, then a shared occasion (see getRelatedProducts). */
export function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <ProductRail
      id="related"
      eyebrow="You may also like"
      title="More to love"
      products={products}
      viewAllHref={productsHref({ category: [products[0].category] })}
      className="mt-4"
    />
  );
}
