"use client";

// Form controls for the /products filter form. They're uncontrolled (so typing and ticking feel
// instant) but re-sync with the URL when it changes from elsewhere, e.g. removing a filter chip.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownUp, ChevronDown, Search } from "lucide-react";
import type { SortKey } from "@/lib/types";
import { cx } from "@/lib/style";
import { SEARCH_PLACEHOLDER, searchIconClass, searchInputClass } from "@/components/shop/search-bar";

export function FilterCheckbox({
  name,
  value,
  selected,
  disabled,
  inputClassName,
  className,
  children,
}: {
  name: string;
  value: string;
  selected: boolean;
  disabled?: boolean;
  inputClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.checked = selected;
  }, [selected]);

  return (
    <label className={cx("cursor-pointer has-disabled:cursor-not-allowed has-disabled:opacity-45", className)}>
      <input
        ref={ref}
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={selected}
        disabled={disabled}
        className={inputClassName}
      />
      {children}
    </label>
  );
}

export function SearchField({ q, id = "search" }: { q: string; id?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  // Don't overwrite what someone is typing; only sync when the box isn't focused.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el) el.value = q;
  }, [q]);

  return (
    <div role="search" className="relative">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <Search aria-hidden className={searchIconClass()} strokeWidth={1.75} />
      <input
        ref={ref}
        id={id}
        name="q"
        type="search"
        defaultValue={q}
        placeholder={SEARCH_PLACEHOLDER}
        autoComplete="off"
        enterKeyHint="search"
        className={cx(searchInputClass(), "scroll-mt-36")}
      />
    </div>
  );
}

export function SortSelect({ value, options }: { value: SortKey; options: { value: SortKey; label: string }[] }) {
  // Controlled, with the URL value winning whenever it changes (React's "adjust state on prop change" pattern).
  const [current, setCurrent] = useState(value);
  const [synced, setSynced] = useState(value);
  if (synced !== value) {
    setSynced(value);
    setCurrent(value);
  }

  // Phones get an icon-sized box: the real select sits on top with its text hidden, so tapping it
  // still opens the phone's own picker. The dot shows a sort other than the default is applied.
  return (
    <div className="relative shrink-0">
      <label htmlFor="sort" className="sr-only">
        Sort by
      </label>
      <select
        id="sort"
        name="sort"
        value={current}
        onChange={(e) => setCurrent(e.target.value as SortKey)}
        className="focus-ring h-12 w-12 appearance-none border border-border bg-surface text-base text-transparent transition-colors hover:border-gold/70 sm:w-auto sm:pl-5 sm:pr-11 sm:text-sm sm:text-ink [&>option]:text-ink"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ArrowDownUp aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 text-ink sm:hidden" strokeWidth={1.75} />
      {current !== "featured" && (
        <span aria-hidden className="pointer-events-none absolute right-1.5 top-1.5 size-1.5 bg-primary sm:hidden" />
      )}
      <ChevronDown aria-hidden className="pointer-events-none absolute right-4 top-1/2 hidden size-4 -translate-y-1/2 text-muted sm:block" />
    </div>
  );
}
