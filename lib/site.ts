export const site = {
  name: "ilaaf Fashion House",
  shortName: "ilaaf fashion",
  url: "https://ilaaffashion.com",
  tagline: "Women's ethnic wear from the City of Lakes",
  address: {
    line1: "Shop No. 1, Jahangirabad Square",
    line2: "Near Extol College",
    // Compact version shown on phones.
    shortLine: "Jahangirabad Square, Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "IN",
  },
  contact: {
    // WhatsApp number in international format, digits only (91 + 10-digit mobile).
    whatsapp: "919340185139",
    // Shown on the site and dialled by the Call links (the same number as WhatsApp).
    phone: "+91 93401 85139",
    // TODO(client): replace the values below with the real details before launch.
    email: "hello@ilaaffashion.com",
    instagram: "ilaaffashion",
    hours: [
      { days: "Monday – Saturday", time: "11:00 am – 8:30 pm" },
      { days: "Sunday", time: "12:00 pm – 6:00 pm" },
    ],
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?sort=newest", label: "New Arrivals" },
  { href: "/contact", label: "Contact" },
] as const;

const { line1, line2, city, state } = site.address;

export const fullAddress = `${line1}, ${line2}, ${city}, ${state}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${fullAddress}`
)}`;

export const telUrl = `tel:${site.contact.phone.replace(/\s/g, "")}`;
export const mailUrl = `mailto:${site.contact.email}`;
export const instagramUrl = `https://www.instagram.com/${site.contact.instagram}/`;

/**
 * Default link-preview image. Served as a static file from /public so the host sends a
 * Content-Length header (WhatsApp drops streamed images). Landscape 1.91:1 gets WhatsApp's large
 * preview. Change the filename whenever the image changes, so apps fetch a fresh copy.
 */
export const shareImage = {
  url: "/og-share.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "ilaaf Fashion House: a model in a maroon silk anarkali with gold zari embroidery on the neckline and cuffs, and a sheer gold organza dupatta.",
};
