export const site = {
  name: "ilaaf Fashion House",
  shortName: "ilaaf fashion",
  url: "https://ilaaffashion.com",
  tagline: "Women's ethnic wear from the City of Lakes",
  address: {
    line1: "Shop No. 1, Jahangirabad Square",
    line2: "Near Extol College, inside Zam Zam Electronics",
    // Compact version shown on phones.
    shortLine: "Jahangirabad Square, Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    postalCode: "462008",
    country: "IN",
    // The shop's own Google Maps listing ("ILAAF FASHION HOUSE"). The map links and embeds open it.
    google: {
      placeId: "ChIJzy3cJmhDfDkRUUlMdPaOAPc",
      featureId: "0x397c436826dc2dcf:0xf7008ef6744c4951",
      // The pin from the client's shared link (maps.app.goo.gl/2TrDJL4oUd9oGCb77).
      geo: { latitude: 23.2525244, longitude: 77.4148529 },
    },
  },
  contact: {
    // WhatsApp number in international format, digits only (91 + 10-digit mobile).
    whatsapp: "918820302909",
    // Shown on the site and dialled by the Call links (the same number as WhatsApp).
    phone: "+91 88203 02909",
    // Instagram username (instagram.com/<username>).
    instagram: "ilaaffashionhouse",
    // TODO(client): replace the values below with the real details before launch.
    email: "hello@ilaaffashion.com",
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

const { line1, line2, city, state, postalCode, google } = site.address;

export const fullAddress = `${line1}, ${line2}, ${city}, ${state} ${postalCode}`;

// Opens the shop's own Google listing at its pin (the place the client's shared link points to).
// The shared link itself is a directions link with a fixed starting point, so it is not used as is.
const mapsPlaceName = encodeURIComponent("ILAAF FASHION HOUSE").replace(/%20/g, "+");
export const mapsUrl = (() => {
  const { latitude, longitude } = google.geo;
  return (
    `https://www.google.com/maps/place/${mapsPlaceName}/@${latitude},${longitude},17z` +
    `/data=!4m6!3m5!1s${google.featureId}!8m2!3d${latitude}!4d${longitude}`
  );
})();

/**
 * Embeddable map pinned to the shop's Google listing, with its name card. Needs no API key.
 * This is the format of Google Maps' Share > Embed a map code; `span` is about how many metres the
 * map shows across (900 is close to zoom 17).
 */
export function mapsEmbedUrl({ satellite = false, span = 900 } = {}) {
  const { latitude, longitude } = google.geo;
  return (
    `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${span}!2d${longitude}!3d${latitude}` +
    `!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodeURIComponent(google.featureId)}` +
    `!2s${encodeURIComponent(site.name)}!5e${satellite ? 1 : 0}!3m2!1sen!2sin!4v1763700000000!5m2!1sen!2sin`
  );
}

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
