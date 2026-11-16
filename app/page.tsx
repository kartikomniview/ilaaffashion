import type { CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string>;

const tickerItems = [
  "Coming Soon",
  "Women's Collection",
  "Stitched with love",
  "ilaaffashion",
  "New Season",
  "Made for her",
];

// Dress silhouette: straps → bodice → A-line skirt → scalloped hem → back up.
const DRESS_OUTLINE =
  "M112 104 L108 150 L118 215 C100 290 80 360 60 430 Q90 446 120 433 Q150 448 180 433 Q210 446 240 430 C220 360 200 290 182 215 L192 150 L188 104";
const DRESS_FILL =
  "M108 150 L118 215 C100 290 80 360 60 430 Q90 446 120 433 Q150 448 180 433 Q210 446 240 430 C220 360 200 290 182 215 L192 150 Q180 132 164 138 Q152 143 150 156 Q148 143 136 138 Q120 132 108 150 Z";
const NECKLINE = "M108 150 Q120 132 136 138 Q148 143 150 156 Q152 143 164 138 Q180 132 192 150";
const HANGER =
  "M137 27 C137 22 141 18 147 18 C153 18 158 22 158 30 C158 40 150 42 150 50 V62 C120 74 90 86 58 99 C50 103 52 108 60 108 L240 108 C248 108 250 103 242 99 C210 86 180 74 150 62";
const SPARKLE = "M0 -8 C1 -2 2 -1 8 0 C2 1 1 2 0 8 C-1 2 -2 1 -8 0 C-2 -1 -1 -2 0 -8 Z";

export default function Home() {
  return (
    <main className="linen-bg relative flex min-h-svh flex-1 flex-col overflow-hidden">
      {/* Floating fabric patches */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span
          className="patch patch-stripe left-[4%] top-[14%] w-16 md:w-24"
          style={{ "--r": "-14deg" } as Vars}
        />
        <span
          className="patch patch-dots right-[5%] top-[9%] w-14 md:w-20"
          style={{ "--r": "12deg", "--d": "-3s" } as Vars}
        />
        <span
          className="patch patch-gingham bottom-[24%] left-[42%] hidden w-16 md:block"
          style={{ "--r": "8deg", "--d": "-5s" } as Vars}
        />
        <span
          className="patch patch-weave bottom-[22%] right-[3%] hidden w-20 lg:block"
          style={{ "--r": "-9deg", "--d": "-2s" } as Vars}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-12 md:pt-8">
        <span className="rise font-serif text-2xl italic tracking-wide">ilaaf</span>
        <span
          className="rise text-[0.65rem] uppercase tracking-[0.35em] text-plum-soft"
          style={{ "--d": "0.1s" } as Vars}
        >
          Women&apos;s Wear
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-6 py-10 md:grid-cols-[1.15fr_1fr] md:px-12">
        <div className="text-center md:text-left">
          <p
            className="rise mb-5 text-[0.7rem] uppercase tracking-[0.4em] text-gold"
            style={{ "--d": "0.2s" } as Vars}
          >
            — A label for her —
          </p>

          <h1 className="rise leading-none" style={{ "--d": "0.35s" } as Vars}>
            <span className="block font-serif text-[clamp(4.5rem,14vw,9.5rem)] font-light italic">
              ilaaf
            </span>
            <span className="mt-1 block pl-[0.6em] text-[clamp(0.85rem,2.2vw,1.15rem)] font-light uppercase tracking-[0.6em] text-plum-soft">
              fashion
            </span>
          </h1>

          <p
            className="rise mt-10 font-serif text-[clamp(1.6rem,3.6vw,2.4rem)] leading-tight"
            style={{ "--d": "0.55s" } as Vars}
          >
            Something beautiful
            <br />
            is being <em className="text-rose">stitched</em>.
          </p>

          <p
            className="rise mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-plum-soft md:mx-0"
            style={{ "--d": "0.7s" } as Vars}
          >
            Our first collection is already on the hanger. Every thread, every
            seam, chosen with care — we&apos;re just putting the final stitches
            in place.
          </p>

          <div
            className="rise mt-9 inline-flex flex-col items-center gap-2 md:items-start"
            style={{ "--d": "0.85s" } as Vars}
          >
            <span className="text-[0.7rem] uppercase tracking-[0.45em]">
              Launching soon
            </span>
            <span className="stitch-line w-full" />
          </div>
        </div>

        {/* Dress on a hanger, sketched live */}
        <div className="relative mx-auto w-[clamp(220px,62vw,330px)] md:w-[clamp(260px,30vw,340px)]">
          <svg viewBox="0 0 300 460" className="w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="dress-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f3d5d0" />
                <stop offset="100%" stopColor="#e2aeae" />
              </linearGradient>
              <pattern id="dress-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="4" cy="4" r="1.3" fill="#fffaf3" opacity="0.7" />
                <circle cx="12" cy="12" r="1.3" fill="#fffaf3" opacity="0.7" />
              </pattern>
            </defs>

            {/* Rail */}
            <line x1="10" y1="18" x2="290" y2="18" stroke="#b88a57" strokeWidth="2" strokeLinecap="round" className="fade-in" />

            {/* Fabric fill appears after the sketch */}
            <g className="fade-in" style={{ "--d": "2.4s" } as Vars}>
              <path d={DRESS_FILL} fill="url(#dress-fill)" />
              <path d={DRESS_FILL} fill="url(#dress-dots)" />
            </g>

            <g fill="none" stroke="#4a1d2f" strokeLinecap="round" strokeLinejoin="round">
              <path d={HANGER} pathLength={1} strokeWidth="2.2" className="draw" style={{ "--d": "0.2s" } as Vars} />
              <path d={DRESS_OUTLINE} pathLength={1} strokeWidth="2" className="draw" style={{ "--d": "0.9s" } as Vars} />
              <path d={NECKLINE} pathLength={1} strokeWidth="2" className="draw" style={{ "--d": "1.6s" } as Vars} />
            </g>

            {/* Seams & folds */}
            <g fill="none" strokeLinecap="round" className="fade-in" style={{ "--d": "2.6s" } as Vars}>
              <path d="M118 215 Q150 225 182 215" stroke="#b88a57" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M136 224 Q126 320 106 436" stroke="#4a1d2f" strokeWidth="1" opacity="0.25" />
              <path d="M150 226 L150 444" stroke="#4a1d2f" strokeWidth="1" opacity="0.2" />
              <path d="M164 224 Q174 320 194 436" stroke="#4a1d2f" strokeWidth="1" opacity="0.25" />
              <path d="M72 420 Q90 432 120 422 Q150 436 180 422 Q210 432 228 420" stroke="#fffaf3" strokeWidth="1.5" strokeDasharray="4 4" />
            </g>

            {/* Sparkles */}
            <g fill="#b88a57">
              <path d={SPARKLE} transform="translate(40 190)" className="twinkle" style={{ "--d": "3s" } as Vars} />
              <path d={SPARKLE} transform="translate(262 300) scale(0.7)" className="twinkle" style={{ "--d": "4.2s" } as Vars} />
              <path d={SPARKLE} transform="translate(30 380) scale(0.55)" className="twinkle" style={{ "--d": "5.1s" } as Vars} />
            </g>
          </svg>

          {/* Garment tag hanging from the hanger */}
          <div className="absolute left-[74%] top-[21.5%] -translate-x-1/2">
            <div className="tag-drop">
              <div className="tag-swing flex flex-col items-center">
                <span className="relative z-10 -mb-[0.8rem] h-14 w-px bg-gold" />
                <div className="tag-shadow">
                  <div className="tag w-[7.25rem] px-3 pb-4 pt-7 text-center">
                    <p className="text-[0.55rem] uppercase tracking-[0.3em] text-gold">N° 01</p>
                    <p className="mt-1.5 font-serif text-[1.9rem] font-medium italic leading-[0.9]">
                      Coming
                      <br />
                      Soon
                    </p>
                    <div className="mx-auto my-2.5 w-10 border-t border-dashed border-rose" />
                    <p className="text-[0.5rem] uppercase leading-relaxed tracking-[0.22em] text-plum-soft">
                      Size
                      <br />
                      Made for you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Measuring-tape ticker */}
      <div className="relative z-10 -mx-[5%] -rotate-[1.5deg] md:-rotate-1">
        <div className="tape overflow-hidden py-4">
          <div className="marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {tickerItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-8 pr-8 text-[0.72rem] font-medium uppercase tracking-[0.4em] text-plum"
                  >
                    {item}
                    <span className="font-serif text-base text-rose">✿</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 px-6 pb-6 pt-8 text-center text-[0.65rem] uppercase tracking-[0.35em] text-plum-soft">
        © {new Date().getFullYear()} ilaaffashion
      </footer>
    </main>
  );
}
