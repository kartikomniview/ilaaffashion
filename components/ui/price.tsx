import { discountPercent, formatPrice } from "@/lib/format";
import { cx } from "@/lib/style";

/** Selling price, struck-through MRP and "% off" when discounted. */
export function Price({ price, mrp, size = "md" }: { price: number; mrp?: number; size?: "md" | "lg" }) {
  const off = discountPercent(price, mrp);
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cx("font-medium text-ink", size === "lg" ? "text-2xl" : "text-[0.95rem]")}>
        <span className="sr-only">Price: </span>
        {formatPrice(price)}
      </span>
      {off > 0 && mrp && (
        <>
          <s className={cx("text-muted", size === "lg" ? "text-base" : "text-xs")}>
            <span className="sr-only">MRP: </span>
            {formatPrice(mrp)}
          </s>
          <span className={cx("font-medium text-success", size === "lg" ? "text-sm" : "text-[0.7rem]")}>
            {off}% off
          </span>
        </>
      )}
    </p>
  );
}
