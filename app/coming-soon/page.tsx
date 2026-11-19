import type { Metadata } from "next";
import Image from "next/image";
import { MapPin } from "lucide-react";
import logo from "@/public/icons/logo.webp";
import logoMark from "@/public/icons/logo-mark.png";
import { fullAddress, mapsUrl, site } from "@/lib/site";
import { cssVars } from "@/lib/style";
import { FramedPortrait } from "@/components/ui/framed-portrait";
import { GarmentTag } from "@/components/ui/garment-tag";
import { Toran } from "@/components/ui/toran";
import { ZariRibbon } from "@/components/ui/zari-ribbon";

// The original pre-launch page, kept for reuse (e.g. a future pop-up or new branch).
// Not linked from the store and hidden from search engines.
export const metadata: Metadata = {
  title: "Coming Soon",
  description: "ilaaf Fashion House is a women's clothing label at Jahangirabad Square, Bhopal. Launching soon.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/coming-soon" },
};

const tickerItems = [
  "Coming Soon",
  "Women's Collection",
  "From the City of Lakes",
  "ilaaf Fashion House",
  "Stitched with love",
  "Bhopal · Madhya Pradesh",
];

export default function ComingSoon() {
  return (
    <main className="silk-bg relative flex min-h-svh flex-1 flex-col overflow-hidden">
      <Toran className="absolute inset-x-0 top-0 z-20" />

      {/* Floating fabric patches: bandhani, leheriya, chanderi, zari */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="patch fabric-leheriya left-[4%] top-[17%] hidden w-24 md:block" style={cssVars({ "--r": "-14deg" })} />
        <span
          className="patch fabric-bandhani right-[5%] top-[13%] hidden w-20 md:block"
          style={cssVars({ "--r": "12deg", "--d": "-3s" })}
        />
        <span
          className="patch fabric-buti bottom-[30%] left-[48%] hidden w-16 md:block"
          style={cssVars({ "--r": "8deg", "--d": "-5s" })}
        />
        <span
          className="patch fabric-zari bottom-[22%] right-[3%] hidden w-20 lg:block"
          style={cssVars({ "--r": "-9deg", "--d": "-2s" })}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-14 md:px-12">
        <span className="rise flex items-center gap-3">
          <Image
            src={logoMark}
            alt=""
            width={40}
            height={40}
            className="size-10 drop-shadow-[0_4px_8px_rgb(58_37_37/0.25)]"
            loading="eager"
          />
          <span className="font-serif text-2xl italic tracking-wide text-primary">ilaaf fashion</span>
        </span>
        <span className="rise text-[0.65rem] uppercase tracking-[0.35em] text-muted" style={cssVars({ "--d": "0.1s" })}>
          <span className="hidden sm:inline">Women&apos;s Wear · </span>Bhopal
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-8 md:grid-cols-[1.15fr_1fr] md:px-12 md:py-5">
        <div className="text-center md:text-left">
          <p
            className="rise mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-primary max-md:hidden"
            style={cssVars({ "--d": "0.2s" })}
          >
            <span className="text-gold">—</span> Women&apos;s fashion · Bhopal <span className="text-gold">—</span>
          </p>

          {/* On phones the logo card is visually hidden but stays as the page's h1 for SEO / screen readers. */}
          <h1 className="rise max-md:sr-only" style={cssVars({ "--d": "0.35s" })}>
            <Image
              src={logo}
              alt="ilaaf Fashion House"
              placeholder="blur"
              loading="eager"
              sizes="(min-width: 768px) 460px, 90vw"
              className="mx-auto h-auto w-full max-w-[460px] rounded-2xl shadow-[0_24px_50px_-20px_rgb(58_37_37/0.55)] ring-1 ring-gold/40 md:mx-0"
            />
          </h1>

          <p
            className="rise mt-8 font-serif text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight text-ink max-md:hidden"
            style={cssVars({ "--d": "0.55s" })}
          >
            Something beautiful
            <br />
            is being <em className="text-primary-hover">stitched</em>.
          </p>

          <p
            className="rise mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted max-md:hidden md:mx-0"
            style={cssVars({ "--d": "0.7s" })}
          >
            Our first collection is already on the hanger — every drape, every thread and every bit of
            embroidery chosen with care. We&apos;re putting the final stitches in place, right here in the
            City of Lakes.
          </p>

          <div className="rise flex flex-col items-center gap-4 md:mt-7 md:items-start" style={cssVars({ "--d": "0.85s" })}>
            <div className="inline-flex flex-col items-center gap-2 md:items-start">
              <span className="text-[0.7rem] uppercase tracking-[0.45em] text-ink">Launching soon</span>
              <span className="stitch-line w-full" />
            </div>
            <address className="not-italic">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our showroom: ${fullAddress} (opens Google Maps)`}
                className="group flex items-start gap-2.5 rounded-lg text-left text-sm leading-relaxed text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
              >
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} />
                <span>
                  <span className="md:hidden">{site.address.shortLine}</span>
                  <span className="max-md:hidden">
                    {site.address.line1},
                    <br />
                    {site.address.line2}, {site.address.city}
                  </span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.3em] text-primary underline decoration-gold decoration-dashed underline-offset-4 group-hover:text-primary-hover">
                    Visit our showroom
                  </span>
                </span>
              </a>
            </address>
          </div>
        </div>

        {/* Model portrait in a gold frame */}
        <FramedPortrait className="mx-auto mt-12 w-[clamp(240px,80vw,360px)] max-md:order-first md:mt-6 md:w-[clamp(300px,32vw,400px)]">
          {/* Garment tag hanging from the frame */}
          <GarmentTag className="absolute left-[85%] top-[10%] -translate-x-1/2">
            <p className="text-[0.55rem] uppercase tracking-[0.3em] text-muted">No. 01</p>
            <p className="mt-1.5 font-serif text-[1.9rem] font-medium italic leading-[0.9] text-primary">
              Coming
              <br />
              Soon
            </p>
            <div className="mx-auto my-2 w-10 border-t border-dashed border-gold" />
            <p className="text-[0.5rem] uppercase leading-relaxed tracking-[0.22em] text-muted">
              Size
              <br />
              Made for you
            </p>
          </GarmentTag>
        </FramedPortrait>
      </section>

      <ZariRibbon items={tickerItems} />

      <footer className="relative z-10 px-6 pb-6 pt-8 text-center text-[0.65rem] uppercase leading-loose tracking-[0.35em] text-muted">
        © {new Date().getFullYear()} {site.name}
        <span className="mt-1 block normal-case tracking-[0.15em] max-md:hidden">{fullAddress}</span>
      </footer>
    </main>
  );
}
