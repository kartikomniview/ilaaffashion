import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

// For the Hindi touches (e.g. "जल्द आ रहे हैं").
const tiroHindi = Tiro_Devanagari_Hindi({
  variable: "--font-tiro-hindi",
  subsets: ["devanagari"],
  weight: "400",
  style: ["normal", "italic"],
});

const title = "ilaaf Fashion House — Coming Soon to Bhopal";
const description =
  "ilaaf Fashion House is a women's clothing label at Jahangirabad Square, Bhopal, Madhya Pradesh. Our first collection is on the hanger — launching soon.";

const shareImageAlt =
  "ilaaf Fashion House: a model in a maroon silk anarkali with gold zari embroidery on the neckline and cuffs, and a sheer gold organza dupatta.";

export const metadata: Metadata = {
  // Canonical domain: share images and links resolve against this.
  // www.ilaaffashion.com should redirect here (set in the hosting provider's domain settings).
  metadataBase: new URL("https://ilaaffashion.com"),
  alternates: { canonical: "/" },
  title,
  description,
  keywords: [
    "ilaaf",
    "ilaaf fashion",
    "ilaaffashion",
    "women's clothing Bhopal",
    "ladies boutique Bhopal",
    "Jahangirabad Bhopal",
    "ethnic wear Bhopal",
    "Madhya Pradesh fashion",
  ],
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "ilaaf Fashion House",
    locale: "en_IN",
    type: "website",
    // Served as a static file from /public so the host sends a Content-Length header.
    // (The app/opengraph-image.jpg route was streamed without one, and WhatsApp drops such images.)
    // Landscape 1.91:1 → WhatsApp shows a large preview with the image on top and text below
    // (a square image would get a small thumbnail beside the text).
    // Change the filename whenever the image changes, so apps fetch a fresh copy.
    images: [
      {
        url: "/og-share.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: shareImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: "/og-share.jpg", alt: shareImageAlt }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${jost.variable} ${tiroHindi.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
