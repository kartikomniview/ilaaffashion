"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/style";

/** Marks the current section. Links that carry a query (e.g. New Arrivals) never show as current. */
export function isActive(pathname: string, href: string) {
  if (href.includes("?")) return false;
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = isActive(pathname, href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "focus-ring relative rounded-sm py-1 text-[0.7rem] uppercase tracking-[0.28em] transition-colors hover:text-primary",
        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:after:scale-x-100",
        active ? "text-primary after:scale-x-100" : "text-ink",
        className
      )}
    >
      {children}
    </Link>
  );
}
