import Form from "next/form";
import { SearchBox } from "@/components/shop/search-box";

/**
 * Stand-alone product search (header, 404 page) with suggestions as you type. Submits to
 * /products?q=… with client-side navigation via next/form. On /products itself the search lives in
 * the filter form instead.
 */
export function SearchBar({
  defaultValue,
  size = "md",
  className,
  id = "search",
  popupClassName,
}: {
  defaultValue?: string;
  size?: "sm" | "md";
  className?: string;
  id?: string;
  /** Position and width of the suggestions; defaults to the box's own width. */
  popupClassName?: string;
}) {
  return (
    <Form action="/products" role="search" className={className}>
      <SearchBox
        id={id}
        defaultValue={defaultValue}
        size={size}
        placeholder={size === "sm" ? "Search" : undefined}
        popupClassName={popupClassName}
      />
    </Form>
  );
}
