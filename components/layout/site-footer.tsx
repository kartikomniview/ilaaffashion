import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import logoMark from "@/public/icons/logo-mark.png";
import { fullAddress, instagramUrl, mailUrl, mapsUrl, site, telUrl } from "@/lib/site";
import { getCategories, productsHref } from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/container";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";

const help = [
  { href: "/contact", label: "Contact us" },
  { href: productsHref({ sort: "newest" }), label: "New arrivals" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-gold">{children}</h2>;
}

const linkClass = "focus-ring rounded-sm text-light/80 transition-colors hover:text-gold";

export function SiteFooter() {
  return (
    <footer className="ribbon ribbon-top relative mt-10 text-sm text-light/80 md:mt-24">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-16">
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="focus-ring inline-flex items-center gap-3 rounded-lg">
            <Image src={logoMark} alt="" width={40} height={40} className="size-10" />
            <span className="font-serif text-xl italic tracking-wide text-gold sm:text-2xl">{site.shortName}</span>
          </Link>
          <p className="mt-4 max-w-xs leading-relaxed">
            {site.tagline}. Chosen with care at our showroom in Jahangirabad, Bhopal.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="focus-ring inline-flex size-10 items-center justify-center border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-primary"
            >
              <WhatsAppIcon className="size-5" />
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="focus-ring inline-flex size-10 items-center justify-center border border-gold/50 text-gold transition-colors hover:bg-gold hover:text-primary"
            >
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Shop">
          <FooterHeading>Shop</FooterHeading>
          <ul className="space-y-2.5">
            {getCategories().map((c) => (
              <li key={c.slug}>
                <Link href={productsHref({ category: [c.slug] })} className={linkClass}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Help">
          <FooterHeading>Help</FooterHeading>
          <ul className="space-y-2.5">
            {help.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 lg:col-span-1">
          <FooterHeading>Visit us</FooterHeading>
          <address className="space-y-3 not-italic">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${linkClass} flex items-start gap-2.5`}>
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.75} />
              {fullAddress}
            </a>
            <a href={telUrl} className={`${linkClass} flex items-center gap-2.5`}>
              <Phone aria-hidden className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
              {site.contact.phone}
            </a>
            <a href={mailUrl} className={`${linkClass} flex items-center gap-2.5`}>
              <Mail aria-hidden className="size-4 shrink-0 text-gold" strokeWidth={1.75} />
              {site.contact.email}
            </a>
            <div className="flex items-start gap-2.5">
              <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.75} />
              <ul>
                {site.contact.hours.map((h) => (
                  <li key={h.days}>
                    {h.days}: {h.time}
                  </li>
                ))}
              </ul>
            </div>
          </address>
        </div>
      </Container>

      <div className="border-t border-dashed border-gold/40">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-[0.65rem] uppercase tracking-[0.3em] text-light/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}
          </p>
          <p>Stitched with love in Bhopal</p>
        </Container>
      </div>
    </footer>
  );
}
