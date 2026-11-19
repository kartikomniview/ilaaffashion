import Form from "next/form";
import { Search } from "lucide-react";
import { cx } from "@/lib/style";

/**
 * Stand-alone product search (header, 404 page). Submits to /products?q=… with client-side
 * navigation via next/form. On /products itself the search lives in the filter form instead.
 */
export function SearchBar({
  defaultValue,
  size = "md",
  className,
  id = "search",
}: {
  defaultValue?: string;
  size?: "sm" | "md";
  className?: string;
  id?: string;
}) {
  return (
    <Form action="/products" role="search" className={className}>
      <SearchInput id={id} defaultValue={defaultValue} size={size} />
    </Form>
  );
}

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

export const SEARCH_PLACEHOLDER = "Search kurtis, sarees, chanderi, pink…";

function SearchInput({
  id,
  defaultValue,
  size = "md",
}: {
  id: string;
  defaultValue?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Search aria-hidden className={searchIconClass(size)} strokeWidth={1.75} />
      <input
        id={id}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder={size === "sm" ? "Search" : SEARCH_PLACEHOLDER}
        autoComplete="off"
        enterKeyHint="search"
        className={searchInputClass(size)}
      />
    </div>
  );
}
