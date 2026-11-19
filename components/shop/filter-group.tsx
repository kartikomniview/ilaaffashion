import { ChevronDown } from "lucide-react";
import type { FacetKey, FacetOption } from "@/lib/products";
import { FilterCheckbox } from "@/components/shop/filter-controls";

/** One collapsible filter section. Sizes render as pills, colours as swatches, the rest as a list. */
export function FilterGroup({
  facetKey,
  label,
  options,
  selected,
  defaultOpen,
}: {
  facetKey: FacetKey;
  label: string;
  options: FacetOption[];
  selected: string[];
  defaultOpen?: boolean;
}) {
  const isSelected = (v: string) => selected.includes(v);

  return (
    <details open={defaultOpen || selected.length > 0} className="group/fg border-b border-border py-4">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between rounded-sm text-[0.68rem] font-medium uppercase tracking-[0.3em] text-ink [&::-webkit-details-marker]:hidden">
        <span>
          {label}
          {selected.length > 0 && <span className="ml-1.5 text-primary">({selected.length})</span>}
        </span>
        <ChevronDown aria-hidden className="size-4 text-muted transition-transform group-open/fg:rotate-180" />
      </summary>

      <fieldset className="mt-4">
        <legend className="sr-only">{label}</legend>

        {facetKey === "size" ? (
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <FilterCheckbox
                key={o.value}
                name={facetKey}
                value={o.value}
                selected={isSelected(o.value)}
                disabled={o.count === 0 && !isSelected(o.value)}
                inputClassName="peer sr-only"
              >
                <span className="inline-flex h-9 min-w-11 items-center justify-center border border-border bg-surface px-3 text-xs text-ink transition-colors hover:border-gold peer-checked:border-primary peer-checked:bg-primary peer-checked:text-light peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold">
                  {o.label}
                </span>
              </FilterCheckbox>
            ))}
          </div>
        ) : facetKey === "color" ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {options.map((o) => (
              <FilterCheckbox
                key={o.value}
                name={facetKey}
                value={o.value}
                selected={isSelected(o.value)}
                disabled={o.count === 0 && !isSelected(o.value)}
                inputClassName="peer sr-only"
                className="flex items-center gap-2 text-sm text-ink"
              >
                <span
                  aria-hidden
                  className="size-5 shrink-0 ring-1 ring-border ring-offset-2 ring-offset-background transition-shadow peer-checked:ring-2 peer-checked:ring-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold"
                  style={{ background: o.hex }}
                />
                <span className="truncate peer-checked:font-medium peer-checked:text-primary">{o.label}</span>
              </FilterCheckbox>
            ))}
          </div>
        ) : (
          <ul className="space-y-2.5">
            {options.map((o) => (
              <li key={o.value}>
                <FilterCheckbox
                  name={facetKey}
                  value={o.value}
                  selected={isSelected(o.value)}
                  disabled={o.count === 0 && !isSelected(o.value)}
                  inputClassName="focus-ring checkbox"
                  className="flex items-center gap-3 text-sm text-ink"
                >
                  <span className="flex-1">{o.label}</span>
                  <span className="text-xs text-muted">{o.count}</span>
                </FilterCheckbox>
              </li>
            ))}
          </ul>
        )}
      </fieldset>
    </details>
  );
}
