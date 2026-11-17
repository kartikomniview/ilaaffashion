export const site = {
  name: "ilaaf Fashion House",
  url: "https://ilaaffashion.com",
  address: {
    line1: "Shop No. 1, Jahangirabad Square",
    line2: "Near Extol College",
    // Compact version shown on phones.
    shortLine: "Jahangirabad Square, Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    country: "IN",
  },
} as const;

const { line1, line2, city, state } = site.address;

export const fullAddress = `${line1}, ${line2}, ${city}, ${state}`;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${fullAddress}`
)}`;
