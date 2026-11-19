import { cx } from "@/lib/style";

/** Festive garland of mango leaves and marigolds. `id` must be unique if two appear on one page. */
export function Toran({ className, id = "toran" }: { className?: string; id?: string }) {
  return (
    <svg aria-hidden className={cx("toran pointer-events-none h-10 w-full", className)}>
      <defs>
        <pattern id={id} width="56" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 4 Q28 13 56 4" fill="none" className="stroke-gold" strokeWidth="1.2" />
          <path d="M28 8 C35 15 34 26 28 34 C22 26 21 15 28 8 Z" className="fill-primary" />
          <path d="M28 11 L28 31" className="stroke-gold" strokeWidth="0.8" />
          {[0, 56].map((x) => (
            <g key={x}>
              <circle cx={x} cy="6" r="6" className="fill-secondary" />
              <circle cx={x} cy="6" r="3.6" className="fill-secondary-hover" />
              <circle cx={x} cy="6" r="1.4" className="fill-primary" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="40" fill={`url(#${id})`} />
    </svg>
  );
}
