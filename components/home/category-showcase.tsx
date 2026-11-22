import Image from "next/image";
import Link from "next/link";
import { getCategories, getCategoryCounts, productsHref } from "@/lib/products";
import { cssVars } from "@/lib/style";
import { fabricVars } from "@/components/product/fabric-swatch";
import { GarmentFigure } from "@/components/product/garment-icon";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Category tiles where the model steps out of the top of the panel.
 *
 * Each tile is a 2:3 stage (1.5x as tall as it is wide): a blush panel 1.15x the width tall at the
 * bottom, with the remaining 0.35x (pt-[35%]) above it. The model photo, cut out on a transparent
 * background, fills the whole stage. It's clipped to the panel's sides and bottom but free above it,
 * so the head and shoulders rise over the panel's top edge. On hover the model grows a little from the feet, into the
 * spare headroom above the stage.
 */
export function CategoryShowcase() {
  const counts = getCategoryCounts();
  return (
    <section aria-labelledby="categories-title" className="py-8 md:py-24">
      <Container>
        <SectionHeading title={<span id="categories-title">Shop by category</span>} />
        {/* A swipeable row on phones and tablets; all eight side by side from lg. */}
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 pt-4 sm:-mx-6 sm:scroll-px-6 sm:gap-4 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:px-0 lg:pt-0">
          {getCategories().map((c) => (
            <li key={c.slug} className="w-[30vw] max-w-40 shrink-0 snap-start sm:w-[20vw] lg:w-auto lg:max-w-none">
              <Link href={productsHref({ category: [c.slug] })} className="focus-ring group block rounded-sm text-center">
                <div className="relative pt-[35%]">
                  {/* Panel: the photos' own blush backdrop, deepening towards the floor */}
                  <div className="relative aspect-[20/23] overflow-hidden rounded-sm bg-linear-to-b from-[#ead3c4] to-[#dcbaa5]">
                    <span aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgb(255_255_255/0.45),transparent_65%)]" />
                    {/* Soft floor shadow, since cutting the model out removed the photo's own */}
                    <span aria-hidden className="absolute bottom-[2%] left-1/2 h-[5%] w-[55%] -translate-x-1/2 rounded-[50%] bg-[#5a2d22]/25 blur-md" />
                  </div>

                  {/* Clips the model to the panel's sides and bottom; -top-6 leaves headroom for the hover growth. */}
                  <div className="absolute inset-x-0 -top-6 bottom-0 overflow-hidden rounded-b-sm">
                    <div className="absolute inset-x-0 bottom-0 top-6 origin-bottom transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                      {c.image ? (
                        <Image
                          src={c.image}
                          alt="" // the category name right below labels the link
                          fill
                          // The photo is 4:5 in a 2:3 stage, so it's shown at 1.2x the tile's width.
                          sizes="(min-width: 1024px) 170px, (min-width: 640px) 24vw, 36vw"
                          className="object-cover object-bottom"
                        />
                      ) : (
                        // No photo yet: the garment drawn in bottle green and gold, rising over the panel like the models.
                        <div aria-hidden style={cssVars(fabricVars("#1F4D3A", "#D4A64A"))} className="absolute inset-0">
                          <GarmentFigure
                            category={c.slug}
                            pattern="floral"
                            className="absolute inset-x-[12%] bottom-[5%] top-[18%] drop-shadow-[0_10px_14px_rgb(58_37_37/0.3)]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="mt-2.5 font-serif text-base font-semibold leading-tight sm:mt-3 sm:text-lg text-ink transition-colors group-hover:text-primary">
                  {c.name}
                </h3>
                <p className="mt-1 text-[0.55rem] uppercase tracking-[0.2em] text-muted sm:text-[0.6rem] sm:tracking-[0.28em]">
                  {counts.get(c.slug) ?? 0} styles
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
