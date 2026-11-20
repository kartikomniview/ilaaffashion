import { site } from "@/lib/site";

/** Typed in for the customer when they tap a general "chat with us" WhatsApp button. */
export const CHAT_MESSAGE = "Hello! I'd like to know more about your collection.";

/** Click-to-chat link that opens WhatsApp with `message` already typed in. */
export function whatsappUrl(message?: string) {
  const base = `https://wa.me/${site.contact.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
