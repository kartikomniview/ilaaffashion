import type { Metadata } from "next";
import {
  SORT_OPTIONS,
  getActiveChips,
  getAllProducts,
  getCategory,
  getFacets,
  hasActiveFilters,
  parseFilters,
  productsHref,
  queryProducts,
} from "@/lib/products";
import type { ProductFilters } from "@/lib/types";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import type { Crumb } from "@/components/ui/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import { ActiveFilters } from "@/components/shop/active-filters";
import { FilterCheckbox, SearchField, SortSelect } from "@/components/shop/filter-controls";
import { FilterDrawer, FilterDrawerProvider, FilterDrawerTrigger } from "@/components/shop/filter-drawer";
import { FilterForm } from "@/components/shop/filter-form";
import { FilterGroup } from "@/components/shop/filter-group";

/** The one category being browsed, if the filters amount to "just this category". */
function singleCategory(f: ProductFilters) {
  return f.category.length === 1 ? getCategory(f.category[0]) : undefined;
}

export async function generateMetadata({ searchParams }: PageProps<"/products">): Promise<Metadata> {
  const f = parseFilters(await searchParams);
  const category = singleCategory(f);
  // Only the plain listing and single-category pages are worth indexing; every other filter
  // combination is a near-duplicate.
  const onlyCategory = category && !hasActiveFilters({ ...f, category: [] });
  const indexable = !hasActiveFilters(f) || onlyCategory;
  return {
    title: f.q ? `Search: ${f.q}` : category ? `${category.name} for Women` : "Shop the Collection",
    description: category
      ? `${category.blurb} Shop ${category.name.toLowerCase()} at ilaaf Fashion House, Bhopal.`
      : "Kurtis, kurta sets, anarkalis, sarees, lehengas, co-ords and dupattas at ilaaf Fashion House, Bhopal.",
    alternates: { canonical: onlyCategory ? productsHref({ category: [category.slug] }) : "/products" },
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const filters = parseFilters(await searchParams);
  const { results, exact } = queryProducts(filters);
  const facets = getFacets(filters);
  const chips = getActiveChips(filters);
  const total = getAllProducts().length;
  const category = singleCategory(filters);

  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, { label: "Shop", href: category ? "/products" : undefined }];
  if (category) crumbs.push({ label: category.name });

  return (
    <>
      {/* Hidden on screen so the page opens straight on search and products; it stays for screen readers and search engines. */}
      <PageHeader
        className="sr-only"
        crumbs={crumbs}
        eyebrow={category ? "Shop by category" : "The collection"}
        title={filters.q ? <>Results for “{filters.q}”</> : (category?.name ?? "Shop the collection")}
      >
        {category?.blurb ?? "Kurtis, sarees, lehengas and more, chosen with care for our showroom in Bhopal."}
      </PageHeader>

      <Container className="pt-5 md:pt-8">
        <FilterForm>
          <FilterDrawerProvider>
            {/* Search, sort and the Filters button share one row at every size. */}
            <div className="flex gap-2 sm:gap-3">
              <div className="min-w-0 flex-1">
                <SearchField q={filters.q} />
              </div>
              <SortSelect value={filters.sort} options={SORT_OPTIONS} />
              <FilterDrawerTrigger activeCount={chips.length} />
            </div>

            <div className="mt-5 gap-10 lg:mt-8 lg:grid lg:grid-cols-[15rem_1fr]">
              <FilterDrawer resultCount={results.length}>
                <div className="border-b border-border py-4">
                  <FilterCheckbox
                    name="instock"
                    value="1"
                    selected={filters.inStock}
                    inputClassName="focus-ring checkbox"
                    className="flex items-center gap-3 text-sm text-ink"
                  >
                    In stock only
                  </FilterCheckbox>
                </div>
                {facets.map((facet) => (
                  <FilterGroup
                    key={facet.key}
                    facetKey={facet.key}
                    label={facet.label}
                    options={facet.options}
                    selected={filters[facet.key]}
                    defaultOpen={["category", "price", "size", "color"].includes(facet.key)}
                  />
                ))}
                <noscript>
                  <button type="submit" className="mt-4 w-full bg-primary py-3 text-sm text-light">
                    Apply filters
                  </button>
                </noscript>
              </FilterDrawer>

              <div className="mt-6 lg:mt-0">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p role="status" className="text-[0.68rem] uppercase tracking-[0.3em] text-muted">
                    Showing {results.length} of {total} styles
                  </p>
                  <ActiveFilters chips={chips} />
                </div>

                {!exact && results.length > 0 && (
                  <p className="-mt-4 mb-6 text-sm text-muted">
                    Nothing matches all of “{filters.q}”, so these are the closest styles.
                  </p>
                )}

                <div className="transition-opacity duration-300 group-data-pending:opacity-50">
                  {results.length ? (
                    <ProductGrid products={results} columns={3} />
                  ) : (
                    <EmptyState
                      title="Nothing matches just yet"
                      action={
                        <ButtonLink href="/products" variant="outline">
                          See everything
                        </ButtonLink>
                      }
                    >
                      Try fewer filters or a different word. Looking for something specific? Message us on
                      WhatsApp and we&apos;ll check the showroom for you.
                    </EmptyState>
                  )}
                </div>
              </div>
            </div>
          </FilterDrawerProvider>
        </FilterForm>
      </Container>
    </>
  );
}
