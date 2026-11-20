// The images a product page's gallery and full-screen viewer step through. No catalogue imports,
// so client components can use it.
//
// Until there are several photos per product, a single photo is shown as four views: the full look
// plus three zoomed-in crops of it. When a product has two or more photos, each photo is a view and
// nothing is cropped.
import type { CSSProperties } from "react";
import type { Product } from "@/lib/types";

/** A zoomed-in part of a photo: the focal point (as % of the photo's width and height) and how far to magnify it. */
export interface Crop {
  x: number;
  y: number;
  zoom: number;
}

export interface ProductView {
  src: string;
  /** Short caption, e.g. "Fabric and work". */
  label: string;
  alt: string;
  crop?: Crop;
}

// Tuned for full-length model shots: shoulders and neckline, the middle of the garment, the hem.
// Zooms stay modest because the photos are only about 900px wide.
const DETAIL_CROPS: (Crop & { label: string })[] = [
  { label: "Upper detail", x: 50, y: 24, zoom: 2 },
  { label: "Fabric and work", x: 50, y: 55, zoom: 2.2 },
  { label: "Hem and border", x: 50, y: 92, zoom: 2 },
];

export function getProductViews(product: Product): ProductView[] {
  const { images, name } = product;
  if (images.length !== 1) {
    return images.map((src, i) => ({ src, label: `Photo ${i + 1}`, alt: i === 0 ? name : `${name}, photo ${i + 1}` }));
  }
  const [src] = images;
  return [
    { src, label: "Full look", alt: name },
    ...DETAIL_CROPS.map(({ label, ...crop }) => ({
      src,
      label,
      alt: `${name}, close-up: ${label.toLowerCase()}`,
      crop,
    })),
  ];
}

/** The full-screen viewer's URL for a view (1-based in the URL). */
export function photoHref(slug: string, index: number) {
  return `/products/${slug}/photos/${index + 1}`;
}

/**
 * Styles for a cropped view on an `object-cover` image filling its frame. `object-position` lines the
 * focal point up with the same point of the frame, and scaling around it keeps it there, so the
 * magnified image always covers the frame, whatever the photo's aspect ratio.
 */
export function cropStyle({ x, y, zoom }: Crop): CSSProperties {
  const point = `${x}% ${y}%`;
  return { objectPosition: point, transformOrigin: point, transform: `scale(${zoom})` };
}

/**
 * Multiplies the widths in an `<Image sizes>` value, so a magnified crop loads a sharper file.
 * Only each entry's final length is scaled, not the media query in front of it:
 * "(min-width: 768px) 45vw, 92vw" × 2 → "(min-width: 768px) 90vw, 184vw".
 */
export function scaleSizes(sizes: string, factor: number) {
  return sizes
    .split(",")
    .map((entry) =>
      entry.trim().replace(/(\d+(?:\.\d+)?)(vw|px)$/, (_, n: string, unit: string) => `${Math.round(Number(n) * factor)}${unit}`)
    )
    .join(", ");
}
