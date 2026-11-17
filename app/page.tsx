import type { CSSProperties } from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import logo from "@/public/icons/logo.webp";
import logoMark from "@/public/icons/logo-mark.png";
import model from "@/public/images/model.webp";
import { fullAddress, mapsUrl, site } from "@/lib/site";
import { Mandala } from "@/components/mandala";

type Vars = CSSProperties & Record<`--${string}`, string>;

// Structured data so search engines can show the store in local results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: site.name,
  description: "Women's clothing label in Bhopal, Madhya Pradesh. Opening soon.",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    addressCountry: site.address.country,
  },
  hasMap: mapsUrl,
};

const tickerItems: { text: string; hindi?: boolean }[] = [
  { text: "Coming Soon" },
  { text: "जल्द आ रहे हैं", hindi: true },
  { text: "Women's Collection" },
  { text: "From the City of Lakes" },
  { text: "ilaaf Fashion House" },
  { text: "Stitched with love" },
  { text: "Bhopal · Madhya Pradesh" },
];

const SPARKLE = "M0 -8 C1 -2 2 -1 8 0 C2 1 1 2 0 8 C-1 2 -2 1 -8 0 C-2 -1 -1 -2 0 -8 Z";

export default function Home() {
  return (
    <main className="silk-bg relative flex min-h-svh flex-1 flex-col overflow-hidden">
      {/* Toran: mango leaves and marigolds strung across the top */}
      <svg aria-hidden className="toran pointer-events-none absolute inset-x-0 top-0 z-20 h-10 w-full">
        <defs>
          <pattern id="toran" width="56" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 4 Q28 13 56 4" fill="none" className="stroke-gold" strokeWidth="1.2" />
            <path d="M28 8 C35 15 34 26 28 34 C22 26 21 15 28 8 Z" className="fill-primary" />
            <path d="M28 11 L28 31" className="stroke-gold" strokeWidth="0.8" />
            {[0, 56].map((x) => (
              <g key={x}>
                <circle cx={x} cy="6" r="6" className="fill-secondary" />
                <circle cx={x} cy="6" r="3.6" className="fill-secondary-hover" />
                <circle cx={x} cy="6" r="1.4" className="fill-primary" />
              </g>
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="40" fill="url(#toran)" />
      </svg>

      {/* Floating fabric patches: bandhani, leheriya, chanderi, zari */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="patch patch-leheriya left-[4%] top-[17%] hidden w-24 md:block"
          style={{ "--r": "-14deg" } as Vars}
        />
        <span
          className="patch patch-bandhani right-[5%] top-[13%] hidden w-20 md:block"
          style={{ "--r": "12deg", "--d": "-3s" } as Vars}
        />
        <span
          className="patch patch-buti bottom-[30%] left-[48%] hidden w-16 md:block"
          style={{ "--r": "8deg", "--d": "-5s" } as Vars}
        />
        <span
          className="patch patch-zari bottom-[22%] right-[3%] hidden w-20 lg:block"
          style={{ "--r": "-9deg", "--d": "-2s" } as Vars}
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
        <span
          className="rise text-[0.65rem] uppercase tracking-[0.35em] text-muted"
          style={{ "--d": "0.1s" } as Vars}
        >
          <span className="hidden sm:inline">Women&apos;s Wear · </span>Bhopal
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-8 md:grid-cols-[1.15fr_1fr] md:px-12 md:py-5">
        <div className="text-center md:text-left">
          <p
            className="rise mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-primary max-md:hidden"
            style={{ "--d": "0.2s" } as Vars}
          >
            <span className="text-gold">—</span> Women&apos;s fashion · Bhopal{" "}
            <span className="text-gold">—</span>
          </p>

          {/* On phones the logo card is visually hidden but stays as the page's h1 for SEO / screen readers. */}
          <h1 className="rise max-md:sr-only" style={{ "--d": "0.35s" } as Vars}>
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
            style={{ "--d": "0.55s" } as Vars}
          >
            Something beautiful
            <br />
            is being <em className="text-primary-hover">stitched</em>.
          </p>

          <p
            className="rise mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-muted max-md:hidden md:mx-0"
            style={{ "--d": "0.7s" } as Vars}
          >
            Our first collection is already on the hanger — every drape, every
            thread and every bit of embroidery chosen with care. We&apos;re
            putting the final stitches in place, right here in the City of
            Lakes.
          </p>

          <div
            className="rise flex flex-col items-center gap-4 md:mt-7 md:items-start"
            style={{ "--d": "0.85s" } as Vars}
          >
            <div className="inline-flex flex-col items-center gap-2 md:items-start">
              <span className="text-[0.7rem] uppercase tracking-[0.45em] text-ink">
                Launching soon
              </span>
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

        {/* Model portrait in an arch, echoing the logo */}
        <figure className="relative isolate mx-auto mt-12 aspect-[3/4.3] w-[clamp(240px,80vw,360px)] max-md:order-first md:mt-6 md:w-[clamp(300px,32vw,400px)]">
          {/* Faint mandala glowing behind the arch */}
          <div
            aria-hidden
            className="fade-in pointer-events-none absolute left-1/2 top-[46%] -z-10 w-[165%] -translate-x-1/2 -translate-y-1/2 text-gold"
          >
            {/* Opacity lives here: .fade-in on the wrapper animates to opacity 1. */}
            <Mandala className="mandala-spin w-full opacity-30" />
          </div>

          {/* Outer hairline arch */}
          <span
            aria-hidden
            className="fade-in absolute -inset-3 rounded-t-full border border-gold/60"
            style={{ "--d": "0.8s" } as Vars}
          />

          {/* Photo rises into the arch */}
          <div className="arch-reveal relative h-full overflow-hidden rounded-t-full shadow-[0_30px_60px_-25px_rgb(101_13_25/0.55)] ring-1 ring-gold">
            <Image
              src={model}
              alt="Model in a maroon anarkali with gold zari embroidery and a sheer gold dupatta, standing in a carved sandstone arch"
              fill
              placeholder="blur"
              preload
              sizes="(min-width: 768px) 400px, 72vw"
              className="ken-burns object-cover object-[50%_30%]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/35 to-transparent"
            />
          </div>

          {/* Finial: the three-leaf ornament from the logo */}
          <svg
            aria-hidden
            viewBox="0 0 40 24"
            className="fade-in absolute -top-10 left-1/2 w-12 -translate-x-1/2 fill-gold"
            style={{ "--d": "1.2s" } as Vars}
          >
            <path d="M20 0 C25 6 25 14 20 22 C15 14 15 6 20 0 Z" />
            <path d="M18 20 C12 12 5 11 0 13 C5 18 12 21 18 21 Z" />
            <path d="M22 20 C28 12 35 11 40 13 C35 18 28 21 22 21 Z" />
          </svg>

          {/* Sparkles */}
          {[
            { pos: "-left-8 top-[30%] size-5", d: "2s" },
            { pos: "-right-7 top-[64%] size-4", d: "3.4s" },
            { pos: "-left-6 bottom-[6%] size-3", d: "4.6s" },
          ].map(({ pos, d }) => (
            <svg key={pos} aria-hidden viewBox="-8 -8 16 16" className={`absolute fill-gold ${pos}`}>
              <path d={SPARKLE} className="twinkle" style={{ "--d": d } as Vars} />
            </svg>
          ))}

          {/* Garment tag hanging from the arch */}
          <div className="absolute left-[85%] top-[10%] z-10 -translate-x-1/2">
            <div className="tag-drop">
              <div className="tag-swing flex flex-col items-center">
                <span className="relative z-10 -mb-[0.8rem] h-14 w-px bg-gold" />
                <div className="tag-shadow">
                  <div className="tag w-[7.5rem] px-3 pb-4 pt-7 text-center">
                    <p className="text-[0.55rem] uppercase tracking-[0.3em] text-muted">No. 01</p>
                    <p className="mt-1.5 font-serif text-[1.9rem] font-medium italic leading-[0.9] text-primary">
                      Coming
                      <br />
                      Soon
                    </p>
                    <p lang="hi" className="mt-1.5 font-hindi text-[0.85rem] text-primary-hover">
                      जल्द आ रहे हैं
                    </p>
                    <div className="mx-auto my-2 w-10 border-t border-dashed border-gold" />
                    <p className="text-[0.5rem] uppercase leading-relaxed tracking-[0.22em] text-muted">
                      Size
                      <br />
                      Made for you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </figure>
      </section>

      {/* Zari ribbon ticker */}
      <div className="relative z-10 -mx-[5%] -rotate-[1.5deg] md:-rotate-1">
        <div className="ribbon py-1.5">
          <div className="overflow-hidden border-y border-dashed border-gold/60 py-3">
            <div className="marquee flex w-max">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                  {tickerItems.map(({ text, hindi }) => (
                    <li key={text} className="flex items-center gap-8 pr-8 text-gold">
                      {hindi ? (
                        // Devanagari must not be letter-spaced or upper-cased.
                        <span lang="hi" className="font-hindi text-[0.95rem] leading-none">
                          {text}
                        </span>
                      ) : (
                        <span className="text-[0.72rem] font-medium uppercase tracking-[0.4em]">{text}</span>
                      )}
                      <span className="font-serif text-base text-secondary">✿</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-6 pt-8 text-center text-[0.65rem] uppercase leading-loose tracking-[0.35em] text-muted">
        © {new Date().getFullYear()} {site.name}
        <span className="mt-1 block normal-case tracking-[0.15em] max-md:hidden">{fullAddress}</span>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </main>
  );
}
