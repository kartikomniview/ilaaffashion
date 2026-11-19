// Line-art garment silhouettes (viewBox 0 0 64 96), one per category. Each has a closed `shape`
// (used as a CSS mask so the fabric pattern fills it) and open `details` (neckline, pleats, borders).
import type { CSSProperties } from "react";
import type { CategorySlug, Pattern } from "@/lib/types";
import { cx } from "@/lib/style";

type Garment = { shape: string; details: string };

const kurta: Garment = {
  shape:
    "M23 6 C27 10 37 10 41 6 L52 11 L60 36 L52 38.5 L46.5 23 L47.5 46 L54 90 L10 90 L16.5 46 L17.5 23 L12 38.5 L4 36 L12 11 Z",
  details: "M27.5 8.2 L32 17 L36.5 8.2 M11.1 82 L52.9 82 M50.6 33.5 L58.4 31 M13.4 33.5 L5.6 31 M32 17 L32 30",
};

const garments: Record<CategorySlug, Garment> = {
  kurtis: kurta,
  "kurta-sets": {
    shape: kurta.shape,
    details: `${kurta.details} M44 9 C52 28 54 56 50 88`,
  },
  anarkalis: {
    shape:
      "M24 6 C28 10 36 10 40 6 L50 11 L57 40 L50.5 42 L45 23 L44 33 C52 48 59 68 62 90 L2 90 C5 68 12 48 20 33 L19 23 L13.5 42 L7 40 L14 11 Z",
    details:
      "M27.5 8 C29 13 35 13 36.5 8 M20 33 Q32 37 44 33 M26 40 L18 88 M32 40 L32 89 M38 40 L46 88 M4 82 Q32 85 60 82",
  },
  sarees: {
    shape:
      "M22 8 C26 11 38 11 42 8 L47 13 L45 27 L19 27 L17 13 Z M19 30 L45 30 L50 90 L14 90 Z M40 9 L47 12 C46 34 36 50 18 62 L16 54 C30 44 38 30 40 9 Z",
    details: "M28 62 L26 90 M32 62 L32 90 M36 62 L38 90 M14.6 84 L49.4 84 M26 10.5 C28 14 36 14 38 10.5",
  },
  lehengas: {
    shape:
      "M22 8 C26 11 38 11 42 8 L48 12 L46 28 L18 28 L16 12 Z M19 33 Q32 37 45 33 C53 52 59 72 62 90 L2 90 C5 72 11 52 19 33 Z",
    details:
      "M26 40 L16 86 M32 40 L32 87 M38 40 L48 86 M3.5 82 Q32 86 60.5 82 M5.5 74 Q32 78 58.5 74 M44 12 C54 30 58 52 56 74",
  },
  "co-ords": {
    shape:
      "M21 6 C26 10 38 10 43 6 L55 12 L60 29 L52.5 31 L48 21 L48 44 L16 44 L16 21 L11.5 31 L4 29 L9 12 Z M17 48 L47 48 L49 90 L36.5 90 L32 60 L27.5 90 L15 90 Z",
    details: "M28 8.5 L32 14 L36 8.5 M32 14 L32 44 M17.3 53 L46.7 53 M21 34 L27 34",
  },
  dupattas: {
    shape: "M10 8 C24 3 36 18 54 10 L54 80 C36 88 24 73 10 78 Z",
    details:
      "M15 7.2 L15 76.5 M49 12 L49 81.5 M12 78 L12 86 M18 76.5 L18 84.5 M24 76 L24 84 M44 83.5 L44 91.5 M50 81.5 L50 89.5",
  },
};

const maskFor = (shape: string) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 96'><path d='${shape}'/></svg>`
  )}") center / contain no-repeat`;

/**
 * A garment silhouette filled with a fabric pattern and outlined in gold.
 * Colours come from --c1/--c2/--c3 set by a parent (see ProductPlaceholder).
 */
export function GarmentFigure({
  category,
  pattern,
  className,
}: {
  category: CategorySlug;
  pattern: Pattern;
  className?: string;
}) {
  const g = garments[category];
  const mask = maskFor(g.shape);
  return (
    <div className={className ?? "relative"}>
      <div
        className={cx("absolute inset-0", `fabric-${pattern}`)}
        style={{ mask, WebkitMask: mask } as CSSProperties}
      />
      <svg
        viewBox="0 0 64 96"
        aria-hidden
        className="absolute inset-0 size-full text-[color-mix(in_srgb,var(--gold)_75%,var(--text-primary))]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={g.shape} />
        <path d={g.details} opacity="0.75" />
      </svg>
    </div>
  );
}
