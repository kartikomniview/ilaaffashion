import { site } from "@/lib/site";

/** Click-to-chat link that opens WhatsApp with `message` already typed in. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
