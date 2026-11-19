"use client";

import { useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { mapsUrl, site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { cx } from "@/lib/style";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductImage } from "@/components/product/product-image";

/** Gallery plus colour/size pickers and the WhatsApp order button, sharing the selected options. */
export function ProductShowcase({
  product,
  categoryName,
  url,
}: {
  product: Product;
  categoryName: string;
  url: string;
}) {
  const hasPhotos = product.images.length > 0;
  const onlySize = product.sizes.length === 1 ? product.sizes[0] : undefined;

  const [colorIndex, setColorIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [size, setSize] = useState<string | undefined>(onlySize);
  const [sizeError, setSizeError] = useState(false);
  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);
  const uid = useId();

  const color = product.colors[colorIndex];

  const message = product.inStock
    ? [
        `Hi ${site.name}! I'd like to order:`,
        `• ${product.name} (${product.id})`,
        `• Colour: ${color.name}`,
        `• Size: ${size ?? "-"}`,
        `• Price: ${formatPrice(product.price)}`,
        url,
      ].join("\n")
    : [`Hi ${site.name}! Will ${product.name} (${product.id}) be back in stock?`, `Colour: ${color.name}`, url].join("\n");

  // Thumbnails: real photos when there are some, otherwise one placeholder per colourway.
  const thumbs = hasPhotos ? product.images.map((_, i) => i) : product.colors.map((_, i) => i);

  return (
    <div className="grid gap-7 md:grid-cols-2 md:gap-10 lg:gap-16">
      {/* Gallery */}
      <div className="md:sticky md:top-28 md:self-start">
        {/* Just the photo, like the product cards: no shadow, frame or big radius. */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
          <ProductImage
            product={product}
            colorIndex={colorIndex}
            imageIndex={imageIndex}
            sizes="(min-width: 768px) 45vw, 92vw"
            preload
            className="absolute inset-0"
          />
          {!product.inStock && (
            <Badge tone="muted" className="absolute bottom-4 left-4">
              Sold out
            </Badge>
          )}
        </div>

        {thumbs.length > 1 && (
          <ul className="mt-4 flex gap-3" aria-label={hasPhotos ? "Photos" : "Colourways"}>
            {thumbs.map((i) => {
              const active = hasPhotos ? imageIndex === i : colorIndex === i;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => (hasPhotos ? setImageIndex(i) : setColorIndex(i))}
                    aria-label={hasPhotos ? `Photo ${i + 1}` : product.colors[i].name}
                    aria-pressed={active}
                    className={cx(
                      "focus-ring relative block aspect-[3/4] w-16 overflow-hidden rounded-sm ring-1 transition sm:w-20",
                      active ? "ring-2 ring-primary" : "ring-gold/40 opacity-75 hover:opacity-100"
                    )}
                  >
                    <ProductImage
                      product={product}
                      colorIndex={hasPhotos ? colorIndex : i}
                      imageIndex={hasPhotos ? i : 0}
                      alt=""
                      sizes="80px"
                      className="absolute inset-0"
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {!hasPhotos && (
          <p className="mt-3 text-xs text-muted">Illustration only. Photos of this piece are coming soon.</p>
        )}
      </div>

      {/* Details and ordering */}
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.35em] text-primary">
          {categoryName} · {product.fabric}
        </p>
        <h1 className="mt-3 font-serif text-[clamp(1.6rem,4vw,3rem)] font-medium leading-[1.05] text-ink">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Price price={product.price} mrp={product.mrp} size="lg" />
          {product.isNew && product.inStock && <Badge tone="new">New</Badge>}
        </div>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">Code {product.id}</p>

        <p className="mt-5 text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">{product.description}</p>

        <div className="mt-8 space-y-7 border-t border-dashed border-gold/50 pt-7">
          {/* Colour */}
          <fieldset>
            <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.3em] text-ink">
              Colour: <span className="normal-case tracking-normal text-muted">{color.name}</span>
            </legend>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c, i) => (
                <label key={c.name} className="cursor-pointer" title={c.name}>
                  <input
                    type="radio"
                    name={`${uid}-color`}
                    value={c.name}
                    checked={colorIndex === i}
                    onChange={() => {
                      setColorIndex(i);
                      if (!hasPhotos) setImageIndex(0);
                    }}
                    className="peer sr-only"
                  />
                  <span className="sr-only">{c.name}</span>
                  <span
                    aria-hidden
                    className="block size-9 ring-1 ring-border ring-offset-[3px] ring-offset-background transition-shadow peer-checked:ring-2 peer-checked:ring-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[6px] peer-focus-visible:outline-gold"
                    style={{ background: c.hex }}
                  />
                </label>
              ))}
            </div>
          </fieldset>

          {/* Size */}
          <fieldset ref={sizeGroupRef} aria-describedby={sizeError ? `${uid}-size-error` : undefined}>
            <legend className="mb-3 text-[0.68rem] uppercase tracking-[0.3em] text-ink">
              Size{size && <span className="normal-case tracking-normal text-muted">: {size}</span>}
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`${uid}-size`}
                    value={s}
                    checked={size === s}
                    onChange={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    className="peer sr-only"
                  />
                  <span className="inline-flex h-11 min-w-12 items-center justify-center border border-border bg-surface px-4 text-sm text-ink transition-colors hover:border-gold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-light peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                    {s}
                  </span>
                </label>
              ))}
            </div>
            {sizeError && (
              <p id={`${uid}-size-error`} role="alert" className="mt-2 text-sm text-error">
                Please choose a size first.
              </p>
            )}
          </fieldset>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={whatsappUrl(message)}
            external
            variant="whatsapp"
            className="flex-1"
            onClick={(e) => {
              if (product.inStock && !size) {
                e.preventDefault();
                setSizeError(true);
                sizeGroupRef.current?.querySelector("input")?.focus();
              }
            }}
          >
            <WhatsAppIcon className="size-4" />
            {product.inStock ? "Order on WhatsApp" : "Ask about restock"}
          </ButtonLink>
          <ButtonLink href={mapsUrl} external variant="outline" className="flex-1">
            <MapPin aria-hidden className="size-4" strokeWidth={1.75} /> Visit showroom
          </ButtonLink>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {product.inStock
            ? "Opens WhatsApp with your choice filled in. We'll confirm availability and details with you."
            : "This piece is sold out right now. Message us and we'll let you know if it comes back."}
        </p>
      </div>
    </div>
  );
}
