"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cx } from "@/lib/style";
import { Button } from "@/components/ui/button";

interface DrawerState {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  triggerRef: RefObject<HTMLButtonElement | null>;
}

const DrawerContext = createContext<DrawerState | null>(null);

function useDrawer() {
  const state = useContext(DrawerContext);
  if (!state) throw new Error("FilterDrawerTrigger and FilterDrawer must be inside a FilterDrawerProvider.");
  return state;
}

/**
 * Shares the drawer's open state between its "Filters" button and the panel, so the button can sit
 * in the search row while the panel lives in the sidebar column.
 */
export function FilterDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  return <DrawerContext.Provider value={{ open, setOpen, triggerRef }}>{children}</DrawerContext.Provider>;
}

/** Opens the filter slide-over below lg. Icon-only on phones, with the active-filter count as a badge. */
export function FilterDrawerTrigger({ activeCount }: { activeCount: number }) {
  const { open, setOpen, triggerRef } = useDrawer();
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(true)}
      aria-expanded={open}
      aria-controls="filter-panel"
      className="focus-ring relative inline-flex h-12 min-w-12 shrink-0 items-center justify-center gap-2 border border-border bg-surface px-3 text-[0.7rem] uppercase tracking-[0.25em] text-ink transition-colors hover:border-gold sm:px-5 lg:hidden"
    >
      <SlidersHorizontal aria-hidden className="size-4" strokeWidth={1.75} />
      <span className="max-sm:sr-only">Filters</span>
      {activeCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center bg-primary text-[0.6rem] tracking-normal text-light">
          <span className="sr-only">, </span>
          {activeCount}
          <span className="sr-only"> active</span>
        </span>
      )}
    </button>
  );
}

/**
 * The filter sidebar. On large screens it's a static column; on smaller ones it's a slide-over
 * opened by FilterDrawerTrigger. Results update live behind it as filters change.
 */
export function FilterDrawer({ children, resultCount }: { children: ReactNode; resultCount: number }) {
  const { open, setOpen, triggerRef } = useDrawer();
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    // Leaving the drawer open while resizing up to desktop would leave the page scroll-locked.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
      document.body.style.overflow = overflow;
    };
  }, [open, setOpen, triggerRef]);

  return (
    <div className={cx("fixed inset-0 z-50 lg:static lg:z-auto lg:block", open ? "block" : "hidden")}>
      <div aria-hidden onClick={close} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] lg:hidden" />
      <div
        id="filter-panel"
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-label="Filters"
        className="drawer-panel absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col bg-background shadow-2xl lg:static lg:w-auto lg:bg-transparent lg:shadow-none"
      >
        <div className="flex items-center justify-between border-b border-gold/30 px-5 py-4 lg:hidden">
          <span className="font-serif text-xl text-ink">Filters</span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close filters"
            className="focus-ring inline-flex size-10 items-center justify-center hover:text-primary"
          >
            <X className="size-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 lg:overflow-visible lg:px-0">{children}</div>

        <div className="border-t border-gold/30 p-4 lg:hidden">
          <Button type="button" onClick={close} className="w-full">
            Show {resultCount} {resultCount === 1 ? "style" : "styles"}
          </Button>
        </div>
      </div>
    </div>
  );
}
