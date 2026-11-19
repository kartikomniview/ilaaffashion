// Home page hero banners, hosted on the brand's S3 bucket (allowed in next.config.ts).
// The headline and "Shop now" button are printed on each banner, so `alt` repeats that text and the
// whole banner links to `href`. Banners are about 2.1:1 and fill the slider edge to edge.
import type { HeroSlide } from "@/lib/types";

const BASE = "https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/hero/v1";

export const heroSlides: HeroSlide[] = [
 
    {
    id: "traditional-sarees",
    src: `${BASE}/4.webp`,
    title: "Traditional Sarees",
    alt: "Traditional sarees, Grace Defined: timeless drapes for every celebration. Two women in green and purple silk sarees on a palace veranda.",
    href: "/products?category=sarees",
  },

  {
    id: "daily-wear",
    src: `${BASE}/3.webp`,
    title: "Daily Wear Collection",
    alt: "Daily Wear Collection: effortless style for everyday. Three women in printed kurta sets with dupattas in beige, olive green and dusty rose.",
    href: "/products?occasion=Everyday",
  },
    {
    id: "velvet-elegance",
    src: `${BASE}/2.webp`,
    title: "Velvet Elegance",
    alt: "Velvet Elegance: rich textures for timeless celebrations. A woman in a maroon velvet anarkali with gold embroidery and a mustard dupatta, among sandstone pillars.",
    href: "/products?category=anarkalis",
  },
   {
    id: "heritage-silk",
    src: `${BASE}/1.webp`,
    title: "Heritage Silk Collection",
    alt: "Heritage Silk Collection: timeless weaves, modern elegance. Four women in pink, teal and green silk sarees with wide gold zari borders.",
    href: "/products?fabric=Silk",
  }

];
