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

export const metadata: Metadata = {
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
    siteName: "ilaaf Fashion House",
    locale: "en_IN",
    type: "website",
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
