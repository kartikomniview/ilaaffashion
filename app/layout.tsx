import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { shareImage } from "@/lib/site";

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

const title = "ilaaf Fashion House — Women's Ethnic Wear in Bhopal";
const description =
  "Kurtis, kurta sets, anarkalis, sarees, lehengas and dupattas from ilaaf Fashion House, a women's clothing store at Jahangirabad Square, Bhopal. Order on WhatsApp or visit our showroom.";


export const metadata: Metadata = {
  // Canonical domain: share images and links resolve against this.
  // www.ilaaffashion.com should redirect here (set in the hosting provider's domain settings).
  metadataBase: new URL("https://ilaaffashion.com"),
  // Each page sets its own `alternates.canonical`; a canonical here would point every page at "/".
  title: { default: title, template: "%s · ilaaf Fashion House" },
  description,
  keywords: [
    "ilaaf",
    "ilaaf fashion",
    "ilaaffashion",
    "women's clothing Bhopal",
    "ladies boutique Bhopal",
    "Jahangirabad Bhopal",
    "ethnic wear Bhopal",
    "kurtis Bhopal",
    "sarees Bhopal",
    "lehenga Bhopal",
    "Madhya Pradesh fashion",
  ],
  openGraph: {
    title,
    description,
    siteName: "ilaaf Fashion House",
    locale: "en_IN",
    type: "website",
    // A static file, not app/opengraph-image.jpg: that route was streamed without a
    // Content-Length header, and WhatsApp drops such images. See `shareImage` in lib/site.ts.
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
