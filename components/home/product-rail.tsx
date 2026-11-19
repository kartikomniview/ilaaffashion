import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cx } from "@/lib/style";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductCard } from "@/components/product/product-card";

/** A titled row of products: swipeable on phones, a four-column grid on large screens. */
export function ProductRail({
  id,
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  products: Product[];
  viewAllHref: string;
  className?: string;
}) {
  const viewAll = (
    <ButtonLink href={viewAllHref} variant="ghost">
      View all <ArrowRight aria-hidden className="size-3.5" />
    </ButtonLink>
  );
  return (
    <section aria-labelledby={`${id}-title`} className={cx("py-8 md:py-20", className)}>
      <Container>
        <SectionHeading
          align="left"
          eyebrow={eyebrow}
          title={<span id={`${id}-title`}>{title}</span>}
          description={description}
          action={viewAll}
        />
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 sm:scroll-px-6 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:gap-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {products.map((p) => (
            <li key={p.id} className="w-[44vw] max-w-72 shrink-0 snap-start sm:w-[30vw] lg:w-auto lg:max-w-none">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
