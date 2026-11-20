// Home page hero banners, hosted on the brand's S3 bucket (allowed in next.config.ts).
// The headline and "Shop now" button are printed on each banner, so `alt` repeats that text and the
// whole banner links to `href`. Desktop banners are about 2.1:1; phones get a near-square version
// (`mobileSrc`, 1199×1312) of the same banner. The slider's aspect ratios in components/home/hero.tsx
// match these sizes, so keep new banners the same size (or update the ratios there).
import type { BannerSlide } from "@/lib/types";

const BASE = "https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/hero/v1";
const MOBILE = "https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/hero/mobile/v1";

export const heroSlides: BannerSlide[] = [
  {
    id: "traditional-sarees",
    src: `${BASE}/4.webp`,
    mobileSrc: `${MOBILE}/1.webp`,
    title: "Traditional Sarees",
    alt: "Traditional sarees, Grace Defined: timeless drapes for every celebration. Two women in green and purple silk sarees on a palace veranda.",
    href: "/products?category=sarees",
  },
  {
    id: "daily-wear",
    src: `${BASE}/3.webp`,
    mobileSrc: `${MOBILE}/2.webp`,
    title: "Daily Wear Collection",
    alt: "Daily Wear Collection: effortless style for everyday. Three women in printed kurta sets with dupattas in beige, olive green and dusty rose.",
    href: "/products?occasion=Everyday",
  },
  {
    id: "velvet-elegance",
    src: `${BASE}/2.webp`,
    mobileSrc: `${MOBILE}/3.webp`,
    title: "Velvet Elegance",
    alt: "Velvet Elegance: rich textures for timeless celebrations. A woman in a maroon velvet anarkali with gold embroidery and a mustard dupatta, among sandstone pillars.",
    href: "/products?category=anarkalis",
  },
  {
    id: "heritage-silk",
    src: `${BASE}/1.webp`,
    mobileSrc: `${MOBILE}/4.webp`,
    title: "Heritage Silk Collection",
    alt: "Heritage Silk Collection: timeless weaves, modern elegance. Four women in pink, teal and green silk sarees with wide gold zari borders.",
    href: "/products?fabric=Silk",
  },
];
