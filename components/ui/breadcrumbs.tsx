import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/ui/json-ld";

export interface Crumb {
  label: string;
  /** Omit for the current page. */
  href?: string;
}

/** Visible breadcrumb trail plus BreadcrumbList structured data for search results. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight aria-hidden className="size-3 text-gold" />}
              {item.href ? (
                <Link href={item.href} className="focus-ring rounded-sm transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-ink">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `${site.url}${item.href}` } : {}),
          })),
        }}
      />
    </>
  );
}
