// Catalogue queries: lookups, search, faceted filtering, sorting and URL building.
// Everything here is pure and synchronous over the local dummy data. When products move to a
// CMS or API, keep these signatures and swap the internals (make them async if needed).
import { categories } from "@/data/categories";
import { colors } from "@/data/colors";
import { products } from "@/data/products";
import {
  CATEGORY_SLUGS,
  FABRICS,
  OCCASIONS,
  SIZES,
  SORT_KEYS,
  WORKS,
  type Category,
  type Occasion,
  type PriceRange,
  type Product,
  type ProductFilters,
  type SearchParams,
  type SortKey,
} from "@/lib/types";

export const PRICE_RANGES: PriceRange[] = [
  { id: "under-1500", label: "Under ₹1,500", min: 0, max: 1500 },
  { id: "1500-3000", label: "₹1,500 – ₹3,000", min: 1500, max: 3000 },
  { id: "3000-6000", label: "₹3,000 – ₹6,000", min: 3000, max: 6000 },
  { id: "6000-12000", label: "₹6,000 – ₹12,000", min: 6000, max: 12000 },
  { id: "over-12000", label: "Above ₹12,000", min: 12000 },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export const EMPTY_FILTERS: ProductFilters = {
  q: "",
  category: [],
  size: [],
  color: [],
  fabric: [],
  occasion: [],
  work: [],
  price: [],
  inStock: false,
  sort: "featured",
};

// ---------- Lookups ----------

export function getAllProducts() {
  return products;
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategories() {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

const byNewest = (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);
// In-stock items first, then featured, then newest.
const byFeatured = (a: Product, b: Product) =>
  Number(b.inStock) - Number(a.inStock) || Number(!!b.featured) - Number(!!a.featured) || byNewest(a, b);

export function getNewArrivals(limit = 8) {
  return products.filter((p) => p.inStock).sort(byNewest).slice(0, limit);
}

export function getFeatured(limit = 8) {
  return products.filter((p) => p.featured).sort(byFeatured).slice(0, limit);
}

export function getByOccasion(occasions: Occasion[], limit = 8) {
  return products
    .filter((p) => p.occasion.some((o) => occasions.includes(o)))
    .sort(byFeatured)
    .slice(0, limit);
}

/** Same category ranks highest, then a shared occasion. */
export function getRelatedProducts(product: Product, limit = 4) {
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + (p.occasion.some((o) => product.occasion.includes(o)) ? 1 : 0);
  return products
    .filter((p) => p.id !== product.id && score(p) > 0)
    .sort((a, b) => score(b) - score(a) || byFeatured(a, b))
    .slice(0, limit);
}

/** How many products each category has, for the landing page tiles. */
export function getCategoryCounts() {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return counts;
}

// ---------- Parsing search params ----------

const toList = (raw: string | string[] | undefined) =>
  (Array.isArray(raw) ? raw : raw ? [raw] : [])
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);

/** Keeps only known values (case-insensitive) and returns them in canonical spelling, deduplicated. */
function pick<T extends string>(raw: string | string[] | undefined, allowed: readonly T[]): T[] {
  const lookup = new Map(allowed.map((a) => [a.toLowerCase(), a]));
  const out = new Set<T>();
  for (const v of toList(raw)) {
    const match = lookup.get(v.toLowerCase());
    if (match) out.add(match);
  }
  return [...out];
}

const first = (raw: string | string[] | undefined) => (Array.isArray(raw) ? raw[0] : raw);

/** Every colour name used in the catalogue, in palette order. */
const COLOR_NAMES = Object.values(colors)
  .map((c) => c.name)
  .filter((name) => products.some((p) => p.colors.some((c) => c.name === name)));

export function parseFilters(sp: SearchParams): ProductFilters {
  const sort = first(sp.sort);
  return {
    q: (first(sp.q) ?? "").trim().slice(0, 100),
    category: pick(sp.category, CATEGORY_SLUGS),
    size: pick(sp.size, SIZES),
    color: pick(sp.color, COLOR_NAMES),
    fabric: pick(sp.fabric, FABRICS),
    occasion: pick(sp.occasion, OCCASIONS),
    work: pick(sp.work, WORKS),
    price: pick(
      sp.price,
      PRICE_RANGES.map((r) => r.id)
    ),
    inStock: first(sp.instock) === "1",
    sort: SORT_KEYS.find((k) => k === sort) ?? "featured",
  };
}

// ---------- Search ----------

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop accents left by NFKD (é → e)
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// Words shoppers type that the catalogue spells differently.
const SYNONYMS: Record<string, string> = {
  sari: "saree",
  lehnga: "lehenga",
  ghagra: "lehenga",
  chunni: "dupatta",
  chunri: "dupatta",
  kurtha: "kurta",
  suit: "kurta",
};

const searchIndex = new Map(
  products.map((p) => {
    const cat = getCategory(p.category);
    const text = normalize(
      [
        p.name,
        p.id,
        cat?.name,
        p.category,
        p.fabric,
        p.work,
        ...p.colors.map((c) => c.name),
        ...p.occasion,
        ...p.tags,
      ].join(" ")
    );
    // A compact copy (no spaces) lets "coord" match "co ord" and "kurtaset" match "kurta set".
    return [p.id, { text, compact: text.replace(/ /g, "") }];
  })
);

function tokenMatches(token: string, entry: { text: string; compact: string }) {
  const variants = [token, SYNONYMS[token]];
  // Simple plural handling: "kurtas" → "kurta", "sarees" → "saree".
  if (token.length > 3 && token.endsWith("s")) variants.push(token.slice(0, -1));
  return variants.some((v) => v && (entry.text.includes(v) || entry.compact.includes(v)));
}

/** Every word in the query must appear somewhere in the product's name, category, fabric, colours, tags… */
export function searchProducts(list: Product[], q: string) {
  const tokens = normalize(q).split(" ").filter(Boolean);
  // A query with no searchable words (only symbols, or another script) matches nothing.
  if (!tokens.length) return q.trim() ? [] : list;
  return list.filter((p) => {
    const entry = searchIndex.get(p.id);
    return !!entry && tokens.every((t) => tokenMatches(t, entry));
  });
}

// ---------- Filters ----------

export type FacetKey = "category" | "price" | "size" | "color" | "fabric" | "occasion" | "work";

const inRange = (price: number, r: PriceRange) => price >= r.min && (r.max === undefined || price < r.max);

const matchers: Record<FacetKey, (p: Product, selected: string[]) => boolean> = {
  category: (p, s) => s.includes(p.category),
  price: (p, s) => PRICE_RANGES.some((r) => s.includes(r.id) && inRange(p.price, r)),
  size: (p, s) => p.sizes.some((x) => s.includes(x)),
  color: (p, s) => p.colors.some((c) => s.includes(c.name)),
  fabric: (p, s) => s.includes(p.fabric),
  occasion: (p, s) => p.occasion.some((o) => s.includes(o)),
  work: (p, s) => s.includes(p.work),
};

const FACET_KEYS = Object.keys(matchers) as FacetKey[];

/** Within a group any selected value matches (OR); across groups all must match (AND). */
export function filterProducts(list: Product[], f: ProductFilters, skip?: FacetKey) {
  return list.filter(
    (p) =>
      (!f.inStock || p.inStock) &&
      FACET_KEYS.every((key) => key === skip || !f[key].length || matchers[key](p, f[key]))
  );
}

export function sortProducts(list: Product[], sort: SortKey) {
  const out = [...list];
  switch (sort) {
    case "newest":
      return out.sort((a, b) => Number(b.inStock) - Number(a.inStock) || byNewest(a, b));
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    default:
      return out.sort(byFeatured);
  }
}

/** Search → filter → sort, the full pipeline used by /products. */
export function queryProducts(f: ProductFilters) {
  return sortProducts(filterProducts(searchProducts(products, f.q), f), f.sort);
}

// ---------- Facets (filter options with live counts) ----------

export interface FacetOption {
  value: string;
  label: string;
  count: number;
  hex?: string;
}

const present = <T extends string>(all: readonly T[], has: (v: T) => boolean) => all.filter(has);

const FACET_OPTIONS: Record<FacetKey, { value: string; label: string; hex?: string }[]> = {
  category: categories.map((c) => ({ value: c.slug, label: c.name })),
  price: PRICE_RANGES.map((r) => ({ value: r.id, label: r.label })),
  size: present(SIZES, (s) => products.some((p) => p.sizes.includes(s))).map((s) => ({ value: s, label: s })),
  color: COLOR_NAMES.map((name) => ({
    value: name,
    label: name,
    hex: Object.values(colors).find((c) => c.name === name)?.hex,
  })),
  fabric: present(FABRICS, (x) => products.some((p) => p.fabric === x)).map((x) => ({ value: x, label: x })),
  occasion: present(OCCASIONS, (x) => products.some((p) => p.occasion.includes(x))).map((x) => ({
    value: x,
    label: x,
  })),
  work: present(WORKS, (x) => products.some((p) => p.work === x)).map((x) => ({ value: x, label: x })),
};

export const FACET_LABELS: Record<FacetKey, string> = {
  category: "Category",
  price: "Price",
  size: "Size",
  color: "Colour",
  fabric: "Fabric",
  occasion: "Occasion",
  work: "Work & print",
};

/**
 * Options for each filter group. Each count is "how many results you'd get if you ticked this",
 * i.e. it respects the search and every *other* group's selection.
 */
export function getFacets(f: ProductFilters) {
  const searched = searchProducts(products, f.q);
  return FACET_KEYS.map((key) => {
    const pool = filterProducts(searched, f, key);
    return {
      key,
      label: FACET_LABELS[key],
      options: FACET_OPTIONS[key].map((o) => ({
        ...o,
        count: pool.filter((p) => matchers[key](p, [o.value])).length,
      })),
    };
  });
}

// ---------- URLs ----------

/** `/products?…` for a set of filters, leaving out defaults so URLs stay short. */
export function productsHref(f: Partial<ProductFilters> = {}) {
  const params = new URLSearchParams();
  if (f.q) params.set("q", f.q);
  for (const key of FACET_KEYS) for (const v of f[key] ?? []) params.append(key, v);
  if (f.inStock) params.set("instock", "1");
  if (f.sort && f.sort !== "featured") params.set("sort", f.sort);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function hasActiveFilters(f: ProductFilters) {
  return !!f.q || f.inStock || FACET_KEYS.some((k) => f[k].length > 0);
}

/** One removable chip per active filter, each linking to the same results without it. */
export function getActiveChips(f: ProductFilters) {
  const chips: { id: string; label: string; href: string }[] = [];
  if (f.q) chips.push({ id: "q", label: `“${f.q}”`, href: productsHref({ ...f, q: "" }) });
  for (const key of FACET_KEYS) {
    for (const value of f[key]) {
      const label = FACET_OPTIONS[key].find((o) => o.value === value)?.label ?? value;
      chips.push({
        id: `${key}-${value}`,
        label,
        href: productsHref({ ...f, [key]: f[key].filter((v) => v !== value) }),
      });
    }
  }
  if (f.inStock) chips.push({ id: "instock", label: "In stock", href: productsHref({ ...f, inStock: false }) });
  return chips;
}
