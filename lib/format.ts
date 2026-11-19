const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹2,499 · ₹12,999 (Indian digit grouping). */
export function formatPrice(amount: number) {
  return inr.format(amount);
}

/** Whole-number percentage saved, or 0 when there's no discount. */
export function discountPercent(price: number, mrp?: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}
