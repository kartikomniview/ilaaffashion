// Product search that copes with how shoppers actually type.
//
// - The usual ways of writing Hindi words in English count as the same word (sari = saree = saari,
//   lehenga = lehnga = lengha, kurti = kurthi = kurtee), plurals don't matter, and small typos are
//   corrected against the catalogue's own words.
// - A word that names a category ("saree", "suit", "gown", "co-ord") narrows the results to that
//   category, so "saree" shows the sarees rather than everything that mentions one.
// - Filler words ("for", "with", "women") are skipped, and prices are understood: "under 3000",
//   "below ₹2,500", "2k-5k", "above 6000", "rs 2000".
// - When nothing matches every word, the closest styles come back instead, best first, flagged with
//   `exact: false` so the page can say so.
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import type { CategorySlug, Product } from "@/lib/types";

// ---------- Vocabulary (add shoppers' words here) ----------

/** Words for each category beyond its own name, including common spellings and other names for it. */
const CATEGORY_WORDS: Record<CategorySlug, string[]> = {
  kurtis: ["kurti", "tunic"],
  "kurta-sets": ["kurta set", "suit", "salwar", "salwar suit", "salwar kameez", "kameez"],
  anarkalis: ["anarkali", "gown"],
  sarees: ["saree", "sadi"],
  lehengas: ["lehenga", "ghagra", "lehenga choli", "chaniya choli", "choli"],
  "co-ords": ["co ord", "two piece", "2 piece", "matching set"],
  dupattas: ["dupatta", "chunni", "chunri", "chunari", "odhni", "stole"],
};

/** Words that could mean more than one category. */
const SHARED_CATEGORY_WORDS: [string, CategorySlug[]][] = [["kurta", ["kurtis", "kurta-sets"]]];

/** Shoppers' words → the catalogue's words for the same thing. The original word still counts too. */
const SYNONYMS: Record<string, string[]> = {
  shaadi: ["wedding", "bridal"],
  marriage: ["wedding", "bridal"],
  bride: ["bridal"],
  bridal: ["wedding"],
  festival: ["festive"],
  puja: ["festive"],
  casual: ["everyday"],
  daily: ["everyday"],
  regular: ["everyday"],
  work: ["office"],
  formal: ["office"],
  workwear: ["office"],
  golden: ["gold"],
  navy: ["blue"],
  magenta: ["pink"],
  cream: ["ivory", "white"],
  offwhite: ["white"],
  violet: ["purple", "lavender"],
  lucknowi: ["chikankari"],
  banarasi: ["brocade"],
  bandhani: ["bandhej"],
  embroidered: ["embroidery"],
};

/** Words that say nothing about which product someone wants. */
const STOP_WORDS = new Set(
  (
    "a an and or the for with in on of to at by my me i want need show looking search " +
    "women womens woman ladies lady girl girls female buy online shop shopping store price prices " +
    "cost latest new best good nice beautiful collection design designs designer set sets wear " +
    "dress dresses outfit outfits clothes clothing ethnic indian traditional ilaaf fashion bhopal"
  ).split(" ")
);

const MAX_PRICE_WORDS = new Set(["under", "below", "less", "within", "upto", "up", "max", "maximum", "budget", "till"]);
const MIN_PRICE_WORDS = new Set(["above", "over", "more", "min", "minimum", "from", "starting"]);
const PRICE_FILLER = new Set(["than", "to", "of", "rs", "inr", "rupee", "rupees"]);
const RANGE_JOINERS = new Set(["to", "and", "rs", "inr"]);
const CURRENCY = new Set(["rs", "inr", "rupee", "rupees"]);

// ---------- Words and spelling keys ----------

/** Lower-case words without accents or punctuation, with prices made plain: "₹2,500" → "rs 2500", "3k" → "3000". */
function toWords(s: string) {
  return s
    .toLowerCase()
    .replace(/₹/g, " rs ")
    .replace(/(\d),(?=\d)/g, "$1")
    .replace(/(\d+(?:\.\d+)?)\s*k\b/g, (_, n: string) => String(Math.round(parseFloat(n) * 1000)))
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

const isNumber = (w: string | undefined) => w !== undefined && /^\d+$/.test(w);

/**
 * Folds the usual spellings of a word onto one key, so they match each other: saree/sari/saari →
 * "sari", lehenga/lehnga/lengha → "lenga", kurthi/kurtee → "kurti", dupatta/dupata → "dupata". A
 * plural "s" is dropped first (sarees, kurtis). Applied to both the catalogue and the query.
 */
function spellingKey(word: string) {
  if (isNumber(word)) return word;
  const singular = word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word;
  return singular
    .replace(/ee/g, "i")
    .replace(/oo/g, "u")
    .replace(/w/g, "v")
    .replace(/z/g, "j")
    .replace(/([^sc])h/g, "$1") // kurthi → kurti, lengha → lenga (but "sh" and "ch" stay: shaadi ≠ saadi)
    .replace(/(.)\1+/g, "$1"); // saari → sari, dupatta → dupata
}

/** Keys for a phrase: word by word ("co ord"), and run together ("coord"), so either spelling matches. */
function phraseKeys(phrase: string) {
  const ws = toWords(phrase);
  return [ws.map(spellingKey).join(" "), spellingKey(ws.join(""))];
}

/** Damerau–Levenshtein distance (with adjacent swaps), for catching typos. Words here are short. */
function editDistance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

// ---------- Indexes, built once ----------

/** Category phrase key → categories. */
const categoryKeys = new Map<string, CategorySlug[]>();
function addCategoryWord(phrase: string, slugs: CategorySlug[]) {
  for (const key of phraseKeys(phrase)) categoryKeys.set(key, [...new Set([...(categoryKeys.get(key) ?? []), ...slugs])]);
}
for (const c of categories) {
  addCategoryWord(c.name, [c.slug]);
  for (const w of CATEGORY_WORDS[c.slug]) addCategoryWord(w, [c.slug]);
}
for (const [w, slugs] of SHARED_CATEGORY_WORDS) addCategoryWord(w, slugs);
const LONGEST_CATEGORY_PHRASE = Math.max(...[...categoryKeys.keys()].map((k) => k.split(" ").length));

const synonymKeys = new Map(
  Object.entries(SYNONYMS).map(([word, alts]) => [spellingKey(word), alts.map(spellingKey)])
);

interface Entry {
  /** Spelling keys of every word, plus each pair of neighbouring words run together ("block print" → "blockprint"). */
  keys: Set<string>;
  /** The words as written, for matching the start of a word while someone is still typing. */
  words: string[];
}

function indexProduct(p: Product): Entry {
  const cat = categories.find((c) => c.slug === p.category);
  const fields = [p.name, p.id, cat?.name, p.fabric, p.work, ...p.colors.map((c) => c.name), ...p.occasion, ...p.tags];
  const words: string[] = [];
  const keys = new Set<string>();
  for (const field of fields) {
    const ws = toWords(field ?? "");
    ws.forEach((w, i) => {
      words.push(w);
      keys.add(spellingKey(w));
      if (i > 0) keys.add(spellingKey(ws[i - 1] + w));
    });
  }
  return { keys, words };
}

const index = new Map(products.map((p) => [p.id, indexProduct(p)]));

/** Every key in the catalogue, to tell real words from unfinished or misspelt ones. */
const vocabulary = new Set([...index.values()].flatMap((e) => [...e.keys]));

/**
 * What a typo can be corrected to, as [a spelling, its key]: catalogue, category and synonym words,
 * each both as written and as its key (so "grean" finds "green" and "lehngaa" finds "lenga").
 */
const typoTargets = [
  ...new Map(
    [
      ...[...index.values()].flatMap((e) => e.words),
      ...Object.values(CATEGORY_WORDS).flat().flatMap((w) => toWords(w)),
      ...categories.flatMap((c) => toWords(c.name)),
      ...Object.keys(SYNONYMS),
    ]
      .filter((w) => w.length >= 4 && !isNumber(w))
      .flatMap((w) => [w, spellingKey(w)].map((spelling) => [`${spelling}|${spellingKey(w)}`, [spelling, spellingKey(w)]] as const))
  ).values(),
];

/** The catalogue word a misspelt word was most likely meant to be, as a key. */
function correctTypo(word: string, key: string) {
  const allowed = word.length >= 8 ? 2 : word.length >= 5 ? 1 : 0;
  let best: string | undefined;
  let bestDistance = allowed + 1;
  for (const [written, targetKey] of typoTargets) {
    if (Math.abs(written.length - word.length) > allowed && Math.abs(written.length - key.length) > allowed) continue;
    const d = Math.min(editDistance(word, written), editDistance(key, written));
    // On a tie, a category beats an ordinary word.
    if (d < bestDistance || (d === bestDistance && best && categoryKeys.has(targetKey) && !categoryKeys.has(best))) {
      best = targetKey;
      bestDistance = d;
    }
  }
  return best;
}

// ---------- Understanding the query ----------

interface Term {
  /** Any of these keys counts as a match (the word, plus its synonyms). */
  keys: string[];
  /** Set for an unfinished word ("sar", "chikan"): it matches the start of a catalogue word. */
  prefix?: { word: string; key: string };
}

interface ParsedQuery {
  categories: Set<CategorySlug>;
  terms: Term[];
  minPrice?: number;
  maxPrice?: number;
}

/** Takes price limits out of the words ("under 3000", "1000 to 3000", "rs 2000") and returns the rest. */
function takePrices(ws: string[]) {
  const rest: string[] = [];
  let min: number | undefined;
  let max: number | undefined;
  const skip = (from: number, set: Set<string>) => {
    let i = from;
    while (i < ws.length && set.has(ws[i])) i++;
    return i;
  };

  for (let i = 0; i < ws.length; i++) {
    const w = ws[i];
    if (MAX_PRICE_WORDS.has(w) || MIN_PRICE_WORDS.has(w) || w === "between") {
      const j = skip(i + 1, PRICE_FILLER);
      if (isNumber(ws[j])) {
        const k = skip(j + 1, RANGE_JOINERS);
        if (!MAX_PRICE_WORDS.has(w) && isNumber(ws[k])) {
          // "between 1000 and 3000", "from 1000 to 3000"
          [min, max] = [Number(ws[j]), Number(ws[k])];
          i = k;
        } else {
          if (MAX_PRICE_WORDS.has(w)) max = Number(ws[j]);
          else min = Number(ws[j]);
          i = j;
        }
      }
      continue; // with no amount after it ("saree from bhopal") it's just a filler word
    }
    if (isNumber(w)) {
      const k = skip(i + 1, RANGE_JOINERS);
      if (w.length >= 3 && isNumber(ws[k]) && ws[k].length >= 3) {
        // "1000-3000", "1000 to 3000"
        [min, max] = [Number(w), Number(ws[k])];
        i = k;
        continue;
      }
      // "rs 2000", "2000 rs", or a bare amount like "saree 2000": a budget. (Small numbers stay as
      // words, so a product code like "ILF-012" still finds its product.)
      if (CURRENCY.has(ws[i - 1]) || CURRENCY.has(ws[i + 1]) || Number(w) >= 300) {
        max = Number(w);
        if (CURRENCY.has(ws[i + 1])) i++;
        continue;
      }
    }
    if (CURRENCY.has(w) && isNumber(ws[i + 1])) continue; // the amount comes next
    rest.push(w);
  }
  if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
  return { rest, min, max };
}

function parseQuery(q: string): ParsedQuery {
  const { rest, min, max } = takePrices(toWords(q));
  const found = new Set<CategorySlug>();
  const terms: Term[] = [];
  const addCategories = (slugs: CategorySlug[]) => slugs.forEach((s) => found.add(s));

  for (let i = 0; i < rest.length; i++) {
    // Category phrases first, longest first ("salwar suit", "co ord", "kurta set").
    let matched = false;
    for (let n = Math.min(LONGEST_CATEGORY_PHRASE, rest.length - i); n >= 2 && !matched; n--) {
      const slugs = phraseKeys(rest.slice(i, i + n).join(" ")).map((k) => categoryKeys.get(k)).find(Boolean);
      if (slugs) {
        addCategories(slugs);
        i += n - 1;
        matched = true;
      }
    }
    if (matched) continue;

    const word = rest[i];
    // A lone letter is usually the start of a word being typed; skip it rather than match nothing.
    if (STOP_WORDS.has(word) || (word.length === 1 && !isNumber(word))) continue;
    const key = spellingKey(word);
    const slugs = categoryKeys.get(key);
    if (slugs) {
      addCategories(slugs);
      continue;
    }

    const withSynonyms = (k: string) => [k, ...(synonymKeys.get(k) ?? [])];
    if (withSynonyms(key).some((k) => vocabulary.has(k))) {
      terms.push({ keys: withSynonyms(key) });
      continue;
    }
    // Not a whole catalogue word: maybe still being typed…
    const isStart = word.length >= 2 && [...index.values()].some((e) => startsAWord({ word, key }, e));
    if (isStart) {
      terms.push({ keys: [], prefix: { word, key } });
      continue;
    }
    // …or misspelt.
    const fixed = isNumber(word) ? undefined : correctTypo(word, key);
    const fixedSlugs = fixed && categoryKeys.get(fixed);
    if (fixedSlugs) addCategories(fixedSlugs);
    else terms.push({ keys: fixed ? withSynonyms(fixed) : [key] }); // an unknown word matches nothing
  }

  return { categories: found, terms, minPrice: min, maxPrice: max };
}

function termMatches(term: Term, entry: Entry) {
  if (term.keys.some((k) => entry.keys.has(k))) return true;
  const start = term.prefix;
  return !!start && startsAWord(start, entry);
}

/**
 * Whether an unfinished word is the start of one of the product's words. Spelling keys only count
 * from three letters: shorter ones are too loose ("leh" → "le" would match "length").
 */
function startsAWord(start: { word: string; key: string }, entry: Entry) {
  return (
    entry.words.some((w) => w.startsWith(start.word)) ||
    (start.key.length >= 3 && [...entry.keys].some((k) => k.startsWith(start.key)))
  );
}

// ---------- Search ----------

/**
 * Categories to suggest while someone types: the ones the query names ("sari" → sarees, "salwar
 * suit" → kurta sets), plus any that its last, possibly unfinished, word could be the start of
 * ("leh" → lehengas, "ku" → kurtis and kurta sets). In catalogue order.
 */
export function categoriesInQuery(q: string): CategorySlug[] {
  const found = new Set(parseQuery(q).categories);
  const last = toWords(q).at(-1);
  if (last && last.length >= 2 && !STOP_WORDS.has(last) && !isNumber(last)) {
    const key = spellingKey(last);
    for (const [phrase, slugs] of categoryKeys) if (phrase.startsWith(key)) slugs.forEach((s) => found.add(s));
    for (const c of categories) if (toWords(c.name).some((w) => w.startsWith(last))) found.add(c.slug);
  }
  return categories.map((c) => c.slug).filter((s) => found.has(s));
}

export interface SearchResult {
  matches: Product[];
  /** False when nothing matched every word and `matches` holds the closest styles instead. */
  exact: boolean;
  /** How well each product matched (higher is better), for ordering close matches. */
  scores: Map<string, number>;
}

/** Products matching the query (see the notes at the top of this file). An empty query matches everything. */
export function searchProducts(list: Product[], q: string): SearchResult {
  const query = parseQuery(q);
  const { categories: cats, terms, minPrice = 0, maxPrice = Infinity } = query;
  const hasPrice = query.minPrice !== undefined || query.maxPrice !== undefined;
  if (!cats.size && !terms.length && !hasPrice) return { matches: list, exact: true, scores: new Map() };

  const scores = new Map<string, number>();
  const exactMatches: Product[] = [];
  for (const p of list) {
    const entry = index.get(p.id);
    if (!entry) continue;
    const inCategory = !cats.size || cats.has(p.category);
    const inBudget = !hasPrice || (p.price >= minPrice && p.price <= maxPrice);
    const termsMatched = terms.filter((t) => termMatches(t, entry)).length;
    if (inCategory && inBudget && termsMatched === terms.length) exactMatches.push(p);
    // For close matches: the category counts most, then each word, then the budget.
    scores.set(p.id, (cats.size && inCategory ? 3 : 0) + termsMatched + (hasPrice && inBudget ? 1 : 0));
  }
  if (exactMatches.length) return { matches: exactMatches, exact: true, scores };

  const close = list.filter((p) => (scores.get(p.id) ?? 0) > 0);
  close.sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));
  return { matches: close, exact: false, scores };
}
