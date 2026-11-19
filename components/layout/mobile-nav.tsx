"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Menu, Phone, X } from "lucide-react";
import { fullAddress, mapsUrl, nav, site, telUrl } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { cx } from "@/lib/style";
import { WhatsAppIcon } from "@/components/ui/icons";
import { isActive } from "@/components/layout/nav-link";

/** Hamburger menu for small screens, built on <dialog> for focus trapping and Esc-to-close. */
export function MobileNav({ categories }: { categories: { href: string; label: string }[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  // Close when navigation happens.
  useEffect(() => {
    ref.current?.close();
  }, [pathname]);

  const close = () => ref.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="focus-ring -ml-2 inline-flex size-10 items-center justify-center text-ink hover:text-primary lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" strokeWidth={1.75} />
      </button>

      <dialog
        ref={ref}
        aria-label="Menu"
        onClick={(e) => e.target === e.currentTarget && close()}
        className="drawer fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none overflow-y-auto bg-background p-0 text-ink backdrop:bg-ink/40 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-center justify-between border-b border-gold/30 px-5 py-4">
            <span className="font-serif text-xl italic text-primary">{site.shortName}</span>
            <button
              type="button"
              onClick={close}
              className="focus-ring inline-flex size-10 items-center justify-center hover:text-primary"
              aria-label="Close menu"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>

          <nav aria-label="Main" className="px-5 py-6">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cx(
                      "focus-ring block rounded-lg py-2.5 font-serif text-2xl transition-colors hover:text-primary",
                      isActive(pathname, item.href) && "text-primary"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mb-3 mt-8 text-[0.65rem] uppercase tracking-[0.35em] text-muted">Shop by category</p>
            <ul className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    onClick={close}
                    className="focus-ring inline-block border border-border bg-surface px-3.5 py-1.5 text-sm transition-colors hover:border-gold hover:text-primary"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto space-y-3 border-t border-gold/30 px-5 py-6 text-sm text-muted">
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-3 rounded hover:text-ink">
              <WhatsAppIcon className="size-4 text-primary" /> Chat on WhatsApp
            </a>
            <a href={telUrl} className="focus-ring flex items-center gap-3 rounded hover:text-ink">
              <Phone aria-hidden className="size-4 text-primary" strokeWidth={1.75} /> {site.contact.phone}
            </a>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="focus-ring flex items-start gap-3 rounded hover:text-ink">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} /> {fullAddress}
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
