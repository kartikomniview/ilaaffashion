import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { fullAddress, instagramUrl, mailUrl, mapsUrl, site, telUrl } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Visit ilaaf Fashion House at ${fullAddress}, or message us on WhatsApp.`,
  alternates: { canonical: "/contact" },
};

type Icon = LucideIcon | typeof WhatsAppIcon;

const channels: { icon: Icon; label: string; value: string; href: string; external?: boolean }[] = [
  { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with us", href: whatsappUrl(`Hi ${site.name}!`), external: true },
  { icon: Phone, label: "Call", value: site.contact.phone, href: telUrl },
  { icon: Mail, label: "Email", value: site.contact.email, href: mailUrl },
  { icon: InstagramIcon, label: "Instagram", value: `@${site.contact.instagram}`, href: instagramUrl, external: true },
];

const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(`${site.name}, ${fullAddress}`)}&z=16&output=embed`;

export default function ContactPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]} eyebrow="Get in touch" title="We'd love to hear from you">
        Questions about a piece, your size, or finding the showroom? Message us on WhatsApp, call, or drop by.
      </PageHeader>

      <Container className="grid gap-10 py-10 md:py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="space-y-8">
          <ul className="grid gap-4 sm:grid-cols-2">
            {channels.map(({ icon: Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="focus-ring group flex h-full items-start gap-4 rounded-2xl border border-gold/40 bg-surface/70 p-5 transition-colors hover:border-primary"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-gold">
                    <Icon aria-hidden className="size-5" strokeWidth={1.6} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[0.62rem] uppercase tracking-[0.3em] text-muted">{label}</span>
                    <span className="mt-1 block truncate text-ink group-hover:text-primary">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-gold/40 bg-surface/70 p-6">
            <div className="flex gap-4">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <div>
                <h2 className="text-[0.62rem] uppercase tracking-[0.3em] text-muted">Showroom</h2>
                <address className="mt-1 not-italic leading-relaxed text-ink">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                  <br />
                  {site.address.city}, {site.address.state}
                </address>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-2 inline-block rounded-sm text-[0.65rem] uppercase tracking-[0.3em] text-primary underline decoration-gold decoration-dashed underline-offset-4 hover:text-primary-hover"
                >
                  Get directions
                </a>
              </div>
            </div>
            <div className="mt-6 flex gap-4 border-t border-dashed border-gold/50 pt-6">
              <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" strokeWidth={1.6} />
              <div>
                <h2 className="text-[0.62rem] uppercase tracking-[0.3em] text-muted">Opening hours</h2>
                <ul className="mt-1 space-y-1 text-ink">
                  {site.contact.hours.map((h) => (
                    <li key={h.days}>
                      {h.days}: <span className="text-muted">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gold/40">
            <iframe
              src={mapEmbed}
              title={`Map showing ${site.name}, ${fullAddress}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full"
            />
          </div>
        </div>

        <div className="rounded-[2rem] border border-gold/40 bg-surface/80 p-6 shadow-[0_30px_60px_-40px_rgb(58_37_37/0.45)] sm:p-10 lg:self-start">
          <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">Send us a message</h2>
          <div className="mt-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </>
  );
}
