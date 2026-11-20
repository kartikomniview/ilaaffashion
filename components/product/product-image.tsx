import Image from "next/image";
import type { CategorySlug, Pattern, Product } from "@/lib/types";
import { cropStyle, scaleSizes, type ProductView } from "@/lib/product-views";
import { cssVars, cx } from "@/lib/style";
import { fabricVars } from "@/components/product/fabric-swatch";
import { GarmentFigure } from "@/components/product/garment-icon";

/**
 * Stand-in "photo" until real product images exist: the garment's silhouette cut from its fabric,
 * standing in a frame, over a faint wash of the same fabric.
 */
export function ProductPlaceholder({
  category,
  pattern,
  colors: [ground, motif],
  className,
}: {
  category: CategorySlug;
  pattern: Pattern;
  colors: [string, string];
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cx("overflow-hidden", className ?? "relative")}
      style={{
        ...cssVars(fabricVars(ground, motif)),
        background: `color-mix(in srgb, ${ground} 10%, var(--background))`,
      }}
    >
      <div className={cx("absolute inset-0 opacity-[0.14]", `fabric-${pattern}`)} />
      <span className="absolute inset-x-[11%] bottom-[5%] top-[7%] rounded-xl border border-gold/50 bg-background/75 shadow-[inset_0_0_40px_-10px_rgb(212_166_74/0.35)]" />
      <GarmentFigure
        category={category}
        pattern={pattern}
        className="absolute inset-x-[20%] bottom-[9%] top-[15%] drop-shadow-[0_10px_14px_rgb(58_37_37/0.25)]"
      />
    </div>
  );
}

/**
 * The product's photo when it has one, otherwise the fabric placeholder.
 * `colorIndex` picks which colourway the placeholder shows (photos aren't per-colour yet).
 * `className` should position it (usually "absolute inset-0" inside an aspect-ratio box).
 */
export function ProductImage({
  product,
  colorIndex = 0,
  imageIndex = 0,
  sizes,
  preload,
  alt = product.name,
  className,
}: {
  product: Product;
  colorIndex?: number;
  imageIndex?: number;
  sizes: string;
  preload?: boolean;
  /** Pass "" when the product name is already shown next to the image (e.g. in a card link). */
  alt?: string;
  className?: string;
}) {
  const src = product.images[imageIndex];
  if (src) {
    return (
      <div className={cx("overflow-hidden bg-accent", className ?? "relative")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-cover object-[50%_25%] transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  const color = product.colors[colorIndex] ?? product.colors[0];
  // Pair the chosen colour with the product's other colour as the motif.
  const motif = product.colors.find((c) => c.hex !== color.hex)?.hex ?? "#D4A64A";
  return (
    <ProductPlaceholder
      category={product.category}
      pattern={product.pattern}
      colors={[color.hex, motif]}
      className={className}
    />
  );
}

/**
 * One gallery view filling its frame: the photo, or a zoomed-in crop of it (see lib/product-views).
 * `sizes` is for the frame; crops automatically ask for a proportionally larger file.
 */
export function ProductViewImage({
  view,
  sizes,
  alt = view.alt,
  preload,
  className,
}: {
  view: ProductView;
  sizes: string;
  alt?: string;
  preload?: boolean;
  className?: string;
}) {
  const { crop } = view;
  return (
    <div className={cx("overflow-hidden bg-accent", className ?? "relative")}>
      <Image
        src={view.src}
        alt={alt}
        fill
        sizes={crop ? scaleSizes(sizes, crop.zoom) : sizes}
        preload={preload}
        draggable={false}
        className={cx("object-cover", !crop && "object-[50%_25%]")}
        style={crop && cropStyle(crop)}
      />
    </div>
  );
}
