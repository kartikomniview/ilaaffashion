// Discount banners shown part-way down the home page, hosted on the brand's S3 bucket (allowed in
// next.config.ts). The offer is printed on each banner, so `alt` repeats that text. Both invite people
// to the showroom, so they link to the showroom section further down the home page.
// They're 1920×640 (3:1) with no phone version; the frame in components/home/offer-banners.tsx uses
// that ratio, so keep new banners the same size (or update it there).
import type { BannerSlide } from "@/lib/types";

// The bucket folder really is spelled "disount".
const BASE = "https://aawsite.s3.ap-south-1.amazonaws.com/illaffashion/disount-banner";

export const offerBanners: BannerSlide[] = [
  {
    id: "showroom-offer-kurta",
    src: `${BASE}/1.webp`,
    title: "Up to 50% off at our showroom",
    alt: "Come and visit our showroom and get up to 50% discount. A smiling woman in a maroon embroidered kurta with a printed dupatta.",
    href: "/#visit",
  },
  {
    id: "showroom-offer-saree",
    src: `${BASE}/2.webp`,
    title: "Up to 50% off at our showroom",
    alt: "Come and visit our showroom and get up to 50% discount. A woman in a purple and gold Banarasi silk saree.",
    href: "/#visit",
  },
];
