// DUMMY CONTENT: placeholder categories for building the site. Replace with the real range.
import type { Category } from "@/lib/types";

// Category photos with the background removed, so the model can step out of the tile. Kept in
// /public/images/categories. Kurtis, Kurta Sets and Co-ords come from the S3 originals
// (illaffashion/catagories/v1/<slug>.webp). The rest use product photos, reframed to match: the Teal
// Georgette Anarkali, Bottle Green Zari Brocade Silk Saree, Mustard Mirror-Work Lehenga and Rani Pink
// Bandhani Dupatta.
const IMG = "/images/categories";

export const categories: Category[] = [
  {
    slug: "kurtis",
    name: "Kurtis",
    blurb: "Easy, everyday kurtis for college, office and everything in between.",
    image: `${IMG}/kurtis.webp`,
  },
  {
    slug: "kurta-sets",
    name: "Kurta Sets",
    blurb: "Kurta, bottoms and dupatta, put together and ready to wear.",
    image: `${IMG}/kurta-sets.webp`,
  },
  {
    slug: "anarkalis",
    name: "Anarkalis",
    blurb: "Flowing, floor-sweeping silhouettes for festive evenings.",
    image: `${IMG}/anarkalis-teal.webp`,
  },
  {
    slug: "sarees",
    name: "Sarees",
    blurb: "Six yards of drape, from daily cotton to wedding silk.",
    image: `${IMG}/sarees-bottle-green.webp`,
  },
  {
    slug: "lehengas",
    name: "Lehengas",
    blurb: "For the sangeet, the shaadi and every celebration around it.",
    image: `${IMG}/lehengas-mustard.webp`,
  },
  {
    slug: "co-ords",
    name: "Co-ord Sets",
    blurb: "Matching sets with an Indian touch, for work and weekends.",
    image: `${IMG}/co-ords.webp`,
  },
  {
    slug: "dupattas",
    name: "Dupattas",
    blurb: "The finishing touch: sheer, bright or richly bordered.",
    image: `${IMG}/dupattas-rani-pink.webp`,
  },
];
