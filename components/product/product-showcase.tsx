"use client";

import { useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { mapsUrl, site } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { WhatsAppIcon } from "@/components/ui/icons";
import { ProductGallery } from "@/components/product/product-gallery";

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
  const onlySize = product.sizes.length === 1 ? product.sizes[0] : undefined;

  const [colorIndex, setColorIndex] = useState(0);
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

  return (
    <div className="grid gap-7 md:grid-cols-2 md:gap-10 lg:gap-16">
      <div className="md:sticky md:top-28 md:self-start">
        <ProductGallery product={product} colorIndex={colorIndex} onColorChange={setColorIndex} />
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
                    onChange={() => setColorIndex(i)}
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
