// Shared types for the catalogue. The data in /data follows these shapes, so swapping the
// dummy data for a real source (CMS, API, spreadsheet export) only means matching them.

export const CATEGORY_SLUGS = [
  "kurtis",
  "pakistani-suits",
  "kurta-sets",
  "anarkalis",
  "sarees",
  "lehengas",
  "co-ords",
  "dupattas",
] as const;
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"] as const;
export type Size = (typeof SIZES)[number];

export const FABRICS = [
  "Cotton",
  "Chanderi",
  "Georgette",
  "Silk",
  "Rayon",
  "Organza",
  "Muslin",
  "Linen",
  "Crepe",
  "Lawn",
] as const;
export type Fabric = (typeof FABRICS)[number];

export const OCCASIONS = ["Everyday", "Office", "Festive", "Wedding", "Party"] as const;
export type Occasion = (typeof OCCASIONS)[number];

export const WORKS = [
  "Zari",
  "Chikankari",
  "Block print",
  "Mirror work",
  "Gota patti",
  "Thread embroidery",
  "Printed",
  "Plain",
] as const;
export type Work = (typeof WORKS)[number];

/** Which CSS textile pattern the image placeholder uses (see `.fabric-*` in globals.css). */
export type Pattern = "bandhani" | "leheriya" | "buti" | "zari" | "ikat" | "chikankari" | "floral" | "solid";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  description: string;
  details: string[];
  /** Selling price in ₹. */
  price: number;
  /** Original price in ₹, shown struck through with a "% off" label. */
  mrp?: number;
  colors: ProductColor[];
  sizes: Size[];
  fabric: Fabric;
  work: Work;
  occasion: Occasion[];
  pattern: Pattern;
  /** Paths under /public, e.g. "/images/products/<slug>-1.webp". Empty → fabric placeholder. */
  images: string[];
  /** Extra search keywords. */
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  featured?: boolean;
  /** ISO date, used for the "Newest" sort. */
  createdAt: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  /**
   * Portrait 4:5 photo of the model on a transparent background, used on the category tiles.
   * Leave it out until a photo exists: the tile shows a drawing of the garment instead.
   */
  image?: string;
}

export const SORT_KEYS = ["featured", "newest", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export interface PriceRange {
  id: string;
  label: string;
  min: number;
  /** Exclusive upper bound; omitted for the last bucket. */
  max?: number;
}

export interface ProductFilters {
  q: string;
  category: CategorySlug[];
  size: Size[];
  color: string[];
  fabric: Fabric[];
  occasion: Occasion[];
  work: Work[];
  price: string[];
  inStock: boolean;
  sort: SortKey;
}

export type SearchParams = Record<string, string | string[] | undefined>;

/** What the search box suggests underneath itself while someone types (served by /api/search). */
export interface SearchSuggestions {
  q: string;
  /** Categories the words name or start to name, with how many styles each has. */
  categories: { slug: CategorySlug; name: string; count: number }[];
  /** The best few matching products. */
  products: { slug: string; name: string; price: number; image?: string; category: string; inStock: boolean }[];
  /** False when nothing matched every word and `products` are the closest styles instead. */
  exact: boolean;
}

/** A banner in one of the home page sliders (the hero, the offers). */
export interface BannerSlide {
  id: string;
  /** Absolute image URL. Its host must be allowed in next.config.ts (images.remotePatterns). */
  src: string;
  /** Optional version of the same banner for phones, shown in place of `src` below the `sm` breakpoint. */
  mobileSrc?: string;
  /** Short name used by the slider controls, e.g. "Show slide 2: Velvet Elegance". */
  title: string;
  /** Describes the banner, including any text printed on it (screen readers can't read that). */
  alt: string;
  /** Where tapping the banner goes. */
  href: string;
}

/** A clip in the home page's "Moments in Style" row. */
export interface StyleVideo {
  id: string;
  /** Absolute URL of the portrait 9:16 MP4. */
  src: string;
  /** Absolute URL of the cover image shown until the clip plays. Its host must be allowed in next.config.ts. */
  poster: string;
  /** The category the clip shows: its name captions the tile, which links to that category. */
  category: CategorySlug;
}
