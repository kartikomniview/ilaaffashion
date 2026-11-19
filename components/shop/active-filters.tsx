import Link from "next/link";
import { X } from "lucide-react";

/** Removable chips for each active filter, plus "Clear all". */
export function ActiveFilters({ chips }: { chips: { id: string; label: string; href: string }[] }) {
  if (!chips.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.id}>
          <Link
            href={chip.href}
            scroll={false}
            className="focus-ring inline-flex items-center gap-1.5 border border-gold/60 bg-surface py-1 pl-3 pr-2 text-xs text-ink transition-colors hover:border-primary hover:text-primary"
          >
            {chip.label}
            <X aria-hidden className="size-3.5" />
            <span className="sr-only">(remove filter)</span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href="/products"
          scroll={false}
          className="focus-ring rounded-sm px-1 text-[0.65rem] uppercase tracking-[0.25em] text-primary underline decoration-gold decoration-dashed underline-offset-4 hover:text-primary-hover"
        >
          Clear all
        </Link>
      </li>
    </ul>
  );
}
