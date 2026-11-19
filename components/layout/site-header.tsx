import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import logoMark from "@/public/icons/logo-mark.png";
import { nav, site } from "@/lib/site";
import { getCategories, productsHref } from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { NavLink } from "@/components/layout/nav-link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SearchBar } from "@/components/shop/search-bar";

export function SiteHeader() {
  const categories = getCategories().map((c) => ({ href: productsHref({ category: [c.slug] }), label: c.name }));

  return (
    <>
      <a
        href="#main"
        className="focus-ring sr-only z-50 bg-primary px-4 py-2 text-sm text-light focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <AnnouncementBar />

      <header className="sticky top-0 z-40 border-b border-gold/30 bg-background/90 backdrop-blur-md">
        <Container className="flex h-16 items-center gap-4 md:h-[4.5rem]">
          <div className="flex flex-1 items-center gap-1 lg:hidden">
            <MobileNav categories={categories} />
          </div>

          <Link href="/" className="focus-ring flex items-center gap-2.5 rounded-lg" aria-label={`${site.name}, home`}>
            <Image src={logoMark} alt="" width={36} height={36} className="size-9 drop-shadow-[0_3px_6px_rgb(58_37_37/0.25)]" />
            <span className="font-serif text-[1.3rem] italic leading-none sm:text-[1.45rem] tracking-wide text-primary">
              {site.shortName}
            </span>
          </Link>

          <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex items-center gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-1 lg:flex-none">
            <SearchBar size="sm" id="header-search" className="hidden w-52 xl:block" />
            <Link
              href="/products#search"
              aria-label="Search products"
              className="focus-ring inline-flex size-10 items-center justify-center text-ink hover:text-primary xl:hidden"
            >
              <Search className="size-5" strokeWidth={1.75} />
            </Link>
            <a
              href={whatsappUrl(`Hi ${site.name}! I have a question.`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with us on WhatsApp (opens WhatsApp)"
              className="focus-ring inline-flex size-10 items-center justify-center text-ink hover:text-primary"
            >
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </Container>
      </header>
    </>
  );
}
