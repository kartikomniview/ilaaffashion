"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import type { SearchSuggestions } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cx } from "@/lib/style";
import { useCancelPendingSearch } from "@/components/shop/filter-form";

export const SEARCH_PLACEHOLDER = "Search kurtis, sarees, chanderi, pink…";

const MIN_CHARS = 2;
const FETCH_DELAY_MS = 150; // pause in typing before asking for suggestions

/** Suggestions already fetched during this visit, by query. */
const cache = new Map<string, SearchSuggestions>();

type Option = { id: string } & ({ kind: "category" | "product"; href: string } | { kind: "all" });

export const searchInputClass = (size: "sm" | "md" = "md") =>
  cx(
    // appearance-none: Safari otherwise draws search fields with rounded ends.
    "focus-ring w-full appearance-none border border-border bg-surface text-ink placeholder:text-muted/70 transition-colors hover:border-gold/70 focus:border-gold",
    size === "sm" ? "h-10 pl-9 pr-4 text-sm" : "h-12 pl-11 pr-5 text-base sm:text-[0.95rem]"
  );

export const searchIconClass = (size: "sm" | "md" = "md") =>
  cx(
    "pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted",
    size === "sm" ? "left-3 size-4" : "left-4 size-[1.1rem]"
  );

/**
 * Product search box with suggestions underneath as someone types: the categories their words name
 * and the best few matching styles (from /api/search), then "See all results", which submits the
 * surrounding form. It must sit inside a form that searches /products.
 *
 * Keyboard: up/down move through the suggestions, Enter opens the highlighted one (or searches, if
 * none is), Esc closes them. Tapping or clicking works as usual.
 */
export function SearchBox({
  id,
  defaultValue,
  size = "md",
  placeholder = SEARCH_PLACEHOLDER,
  inputClassName,
  popupClassName = "inset-x-0",
}: {
  id: string;
  /** The search in the URL, on /products. The box keeps in step with it except while focused. */
  defaultValue?: string;
  size?: "sm" | "md";
  placeholder?: string;
  inputClassName?: string;
  /** Position and width of the suggestions, e.g. "right-0 w-96". Defaults to the input's width. */
  popupClassName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const cancelPendingSearch = useCancelPendingSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = `${id}-suggestions`;

  const [text, setText] = useState(defaultValue ?? "");
  const [suggestions, setSuggestions] = useState<SearchSuggestions | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [shownPath, setShownPath] = useState(pathname);

  // Close when the page changes.
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
    setActive(-1);
  }

  // Follow the URL (e.g. after a filter chip is removed), but never overwrite what someone is typing.
  useEffect(() => {
    const el = inputRef.current;
    if (el && defaultValue !== undefined && document.activeElement !== el) el.value = defaultValue;
  }, [defaultValue]);

  const query = text.trim();
  useEffect(() => {
    if (query.length < MIN_CHARS) return;
    const controller = new AbortController();
    const show = (data: SearchSuggestions) => {
      setSuggestions(data);
      setActive(-1);
    };
    const cached = cache.get(query);
    const timer = setTimeout(
      async () => {
        if (cached) return show(cached);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
          if (!res.ok) return;
          const data = (await res.json()) as SearchSuggestions;
          cache.set(query, data);
          show(data);
        } catch {
          // Superseded by newer typing, or offline: keep showing what's there.
        }
      },
      cached ? 0 : FETCH_DELAY_MS
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Until the new suggestions arrive, the previous ones stay up, so the list doesn't flicker.
  const visible = open && query.length >= MIN_CHARS && suggestions !== null;
  const categories = suggestions?.categories ?? [];
  const products = suggestions?.products ?? [];
  const options: Option[] = [
    ...categories.map((c) => ({ kind: "category" as const, id: `${listId}-c-${c.slug}`, href: `/products?category=${c.slug}` })),
    ...products.map((p) => ({ kind: "product" as const, id: `${listId}-p-${p.slug}`, href: `/products/${p.slug}` })),
    ...(categories.length || products.length ? [{ kind: "all" as const, id: `${listId}-all` }] : []),
  ];
  const activeId = visible ? options[active]?.id : undefined;

  // Keep the highlighted suggestion in view when moving with the arrow keys.
  useEffect(() => {
    if (activeId) document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  function close() {
    setOpen(false);
    setActive(-1);
  }

  /** After opening a suggestion: close, drop any search still waiting to run, and tidy the box. */
  function afterPick() {
    close();
    cancelPendingSearch?.();
    const el = inputRef.current;
    el?.blur();
    // The header box isn't tied to the URL, so it starts empty again.
    if (el && defaultValue === undefined) {
      el.value = "";
      setText("");
    }
  }

  function choose(option: Option) {
    if (option.kind === "all") {
      close();
      inputRef.current?.form?.requestSubmit();
      return;
    }
    afterPick();
    router.push(option.href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        if (!options.length || query.length < MIN_CHARS) return;
        e.preventDefault();
        if (!visible) {
          setOpen(true);
          return;
        }
        const down = e.key === "ArrowDown";
        setActive((a) => (a < 0 ? (down ? 0 : options.length - 1) : (a + (down ? 1 : -1) + options.length) % options.length));
        break;
      }
      case "Enter":
        if (visible && activeId) {
          e.preventDefault(); // open the suggestion instead of submitting the form
          choose(options[active]);
        } else {
          close();
        }
        break;
      case "Escape":
        if (visible) {
          e.preventDefault(); // close the list without also clearing the box
          close();
        }
        break;
      case "Tab":
        close();
        break;
    }
  }

  const optionClass = (i: number) =>
    cx("flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-ink", i === active && "bg-accent/45");
  const groupLabelClass = "px-4 pb-1 pt-3 text-[0.62rem] uppercase tracking-[0.25em] text-muted";
  const popupClass = cx(
    "absolute top-full z-50 mt-1 max-h-[min(28rem,60dvh)] overflow-y-auto overscroll-contain border border-border bg-surface shadow-[0_18px_40px_-18px_rgb(43_23_18/0.35)]",
    popupClassName
  );
  const matchCount = categories.length + products.length;

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Search aria-hidden className={searchIconClass(size)} strokeWidth={1.75} />
      <input
        ref={inputRef}
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={listId}
        aria-activedescendant={activeId}
        className={cx(searchInputClass(size), inputClassName)}
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={(e) => {
          // The URL may have changed the text while the box wasn't focused.
          setText(e.currentTarget.value);
          setOpen(true);
        }}
        onBlur={close}
        onKeyDown={onKeyDown}
      />

      {visible &&
        (matchCount ? (
          // mousedown would move focus off the input (closing the list) before the click lands.
          <div id={listId} role="listbox" aria-label="Search suggestions" className={popupClass} onMouseDown={(e) => e.preventDefault()}>
            {categories.length > 0 && (
              <div role="group" aria-labelledby={`${listId}-categories`}>
                <p id={`${listId}-categories`} className={groupLabelClass}>
                  Categories
                </p>
                {categories.map((c, i) => (
                  <Link
                    key={c.slug}
                    id={options[i].id}
                    href={`/products?category=${c.slug}`}
                    role="option"
                    aria-selected={i === active}
                    tabIndex={-1}
                    className={optionClass(i)}
                    onMouseMove={() => setActive(i)}
                    onClick={afterPick}
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">{c.name}</span>
                    <span className="shrink-0 text-xs text-muted">{c.count} styles</span>
                    <ArrowRight aria-hidden className="size-3.5 shrink-0 text-muted" />
                  </Link>
                ))}
              </div>
            )}

            {products.length > 0 && (
              <div role="group" aria-labelledby={`${listId}-products`}>
                <p id={`${listId}-products`} className={groupLabelClass}>
                  {suggestions?.exact ? "Styles" : "Closest styles"}
                </p>
                {products.map((p, j) => {
                  const i = categories.length + j;
                  return (
                    <Link
                      key={p.slug}
                      id={options[i].id}
                      href={`/products/${p.slug}`}
                      role="option"
                      aria-selected={i === active}
                      tabIndex={-1}
                      className={optionClass(i)}
                      onMouseMove={() => setActive(i)}
                      onClick={afterPick}
                    >
                      <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-accent">
                        {p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover object-[50%_25%]" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{p.name}</span>
                        <span className="block text-xs text-muted">{p.category}</span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block">{formatPrice(p.price)}</span>
                        {!p.inStock && <span className="block text-xs text-muted">Sold out</span>}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}

            <button
              type="submit"
              id={`${listId}-all`}
              role="option"
              aria-selected={options.length - 1 === active}
              tabIndex={-1}
              className={cx(optionClass(options.length - 1), "mt-1 border-t border-border py-3 font-medium text-primary")}
              onMouseMove={() => setActive(options.length - 1)}
              onClick={close}
            >
              <Search aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
              <span className="min-w-0 flex-1 truncate">See all results for “{query}”</span>
              <ArrowRight aria-hidden className="size-3.5 shrink-0" />
            </button>
          </div>
        ) : (
          <div id={listId} className={popupClass}>
            <p className="px-4 py-3 text-sm text-muted">No styles match “{query}”.</p>
          </div>
        ))}

      <p aria-live="polite" className="sr-only">
        {visible ? (matchCount ? `${matchCount} suggestions. Use the up and down arrows to choose one.` : "No suggestions.") : ""}
      </p>
    </div>
  );
}
