import { Clock, MapPin, Phone } from "lucide-react";
import { mapsUrl, site, telUrl } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Mandala } from "@/components/mandala";
import { Finial } from "@/components/ui/sparkle";

/** Showroom address, hours and contact actions. Reused on the landing and contact pages. */
export function VisitShowroom({ headingLevel: H = "h2" }: { headingLevel?: "h1" | "h2" }) {
  return (
    <section aria-labelledby="visit-title" className="py-8 md:py-20">
      <Container>
        <div className="relative grid overflow-hidden rounded-[2rem] bg-primary text-light shadow-[0_40px_80px_-40px_rgb(101_13_25/0.8)] md:grid-cols-[1.2fr_1fr]">
          <div className="relative z-10 px-5 py-9 sm:px-10 md:py-16 lg:px-14">
            <p className="mb-3 text-[0.68rem] uppercase tracking-[0.4em] text-gold">— Visit our showroom</p>
            <H id="visit-title" className="font-serif text-[clamp(1.5rem,4vw,3rem)] font-medium leading-[1.05]">
              Come see it, feel it, try it on.
            </H>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-light/80 sm:mt-4 sm:text-base">
              Colours and fabrics are best seen in person. Drop by our store at Jahangirabad Square, we&apos;d
              love to help you find the right fit.
            </p>

            <ul className="mt-8 grid gap-5 text-sm sm:grid-cols-2">
              <li className="flex gap-3">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.75} />
                <p>
                  <span className="sr-only">Address: </span>
                  {site.address.line1}
                  <br />
                  {site.address.line2}, {site.address.city}
                </p>
              </li>
              <li className="flex gap-3">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.75} />
                <div>
                  <span className="sr-only">Opening hours: </span>
                  {site.contact.hours.map((h) => (
                    <p key={h.days}>
                      <span className="text-light/60">{h.days}</span>
                      <br />
                      {h.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
              <ButtonLink href={mapsUrl} external variant="gold">
                <MapPin aria-hidden className="size-4" strokeWidth={1.75} /> Get directions
              </ButtonLink>
              <ButtonLink href={whatsappUrl(`Hi ${site.name}! I'd like to visit the showroom.`)} external variant="whatsapp">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </ButtonLink>
              <ButtonLink href={telUrl} variant="outline" className="border-gold/60 text-gold hover:bg-gold hover:text-primary">
                <Phone aria-hidden className="size-4" strokeWidth={1.75} /> Call
              </ButtonLink>
            </div>
          </div>

          {/* Decorative city card */}
          <div aria-hidden className="relative flex min-h-64 items-center justify-center overflow-hidden border-t border-gold/30 md:border-l md:border-t-0">
            <div className="fabric-zari absolute inset-0 opacity-15" />
            <Mandala className="mandala-spin absolute w-[130%] text-gold opacity-30" />
            <div className="relative text-center">
              <Finial className="mx-auto mb-4 w-12" />
              <p className="font-serif text-5xl font-medium italic text-gold md:text-7xl">Bhopal</p>
              <p className="mt-3 text-[0.62rem] uppercase tracking-[0.4em] text-light/70">City of Lakes</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
