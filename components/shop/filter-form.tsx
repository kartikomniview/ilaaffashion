"use client";

import { createContext, useContext, useEffect, useRef, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { cx } from "@/lib/style";

const SEARCH_DEBOUNCE_MS = 450;

const CancelPendingSearch = createContext<(() => void) | null>(null);

/**
 * Inside a FilterForm: drops a search that's still waiting for its typing pause. The search box calls
 * it when someone opens a suggestion, so the delayed search can't pull them back to the results.
 */
export const useCancelPendingSearch = () => useContext(CancelPendingSearch);

/**
 * Wraps the search box, sort and filter checkboxes in one GET form for /products.
 * - Ticking a filter or changing sort updates the URL straight away; typing in search updates it
 *   after a short pause. Enter submits right away.
 * - Empty values and the default sort are left out so URLs stay tidy.
 * - While the new results load, the form has `data-pending`, so children can dim themselves
 *   with `group-data-pending:`.
 * - Without JavaScript it's still a plain GET form that works.
 */
export function FilterForm({ children, className }: { children: ReactNode; className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const cancelPending = () => clearTimeout(timer.current);

  // Leaving the page drops a search that hasn't run yet.
  useEffect(() => () => clearTimeout(timer.current), []);

  const navigate = (form: HTMLFormElement) => {
    clearTimeout(timer.current);
    const params = new URLSearchParams();
    for (const [key, raw] of new FormData(form)) {
      if (typeof raw !== "string") continue;
      const value = raw.trim();
      if (!value || (key === "sort" && value === "featured")) continue;
      params.append(key, value);
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `/products?${qs}` : "/products", { scroll: false }));
  };

  return (
    <form
      action="/products"
      method="get"
      className={cx("group", className)}
      data-pending={pending ? "" : undefined}
      onSubmit={(e) => {
        e.preventDefault();
        navigate(e.currentTarget);
      }}
      onChange={(e) => {
        const form = e.currentTarget;
        // The event bubbles up from whichever control changed.
        const field = e.target as unknown as HTMLInputElement;
        if (field.name === "q") {
          clearTimeout(timer.current);
          timer.current = setTimeout(() => navigate(form), SEARCH_DEBOUNCE_MS);
        } else {
          navigate(form);
        }
      }}
    >
      <CancelPendingSearch value={cancelPending}>{children}</CancelPendingSearch>
    </form>
  );
}
