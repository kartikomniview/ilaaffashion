import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Occasion } from "@/lib/types";
import { getAllProducts, getProductBySlug, productsHref } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

// `cover` is the product whose photo fills the tile.
const tiles: { occasion: Occasion; line: string; cover: string }[] = [
  { occasion: "Everyday", line: "Easy cottons for long days", cover: "indigo-block-print-cotton-kurti" },
  { occasion: "Office", line: "Smart, quiet and comfortable", cover: "powder-blue-linen-office-kurti" },
  { occasion: "Festive", line: "Colour for Teej, Navratri and Diwali", cover: "rani-pink-bandhani-georgette-saree" },
  { occasion: "Wedding", line: "Silk and zari for the shaadi season", cover: "wine-silk-bridal-lehenga" },
];

export function OccasionTiles() {
  const all = getAllProducts();
  return (
    <section aria-labelledby="occasion-title" className="py-8 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Shop by occasion"
          title={<span id="occasion-title">Something for every moment</span>}
        />
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {tiles.map((t) => {
            const matches = all.filter((p) => p.occasion.includes(t.occasion));
            // If the chosen product is gone, use the first one for this occasion that has a photo.
            const photo = getProductBySlug(t.cover)?.images[0] ?? matches.find((p) => p.images[0])?.images[0];
            return (
              <li key={t.occasion}>
                <Link
                  href={productsHref({ occasion: [t.occasion] })}
                  className="focus-ring group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-primary p-4 text-light ring-1 ring-gold/50 sm:p-6"
                >
                  {photo && (
                    <Image
                      src={photo}
                      alt="" // the occasion name below labels the link
                      fill
                      sizes="(min-width: 1024px) 300px, 48vw"
                      className="object-cover object-[50%_20%] transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span aria-hidden className="absolute inset-0 bg-linear-to-t from-[#2a1414]/90 via-[#2a1414]/35 to-transparent" />
                  <span aria-hidden className="absolute inset-2 rounded-xl border border-dashed sm:inset-3 border-gold/50" />
                  <div className="relative">
                    <h3 className="font-serif text-xl font-medium leading-tight sm:text-3xl">{t.occasion}</h3>
                    <p className="mt-1 hidden text-sm leading-snug text-light/85 sm:block">{t.line}</p>
                    <p className="mt-1.5 inline-flex items-center gap-2 text-[0.6rem] sm:mt-4 sm:text-[0.62rem] uppercase tracking-[0.3em] text-gold">
                      {matches.length} styles{" "}
                      <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
