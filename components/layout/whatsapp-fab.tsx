import { CHAT_MESSAGE, whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/ui/icons";

/** Floating "chat with us" button, bottom-right on every store page. */
export function WhatsAppFab() {
  return (
    <a
      href={whatsappUrl(CHAT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens WhatsApp)"
      // WhatsApp's own green with its white logo, as people recognise it.
      className="focus-ring fixed bottom-4 right-4 z-30 inline-flex size-12 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-[0_14px_30px_-10px_rgb(37_211_102/0.75)] ring-2 ring-gold/70 transition-transform hover:scale-105 md:bottom-7 md:right-7 md:size-14"
    >
      <WhatsAppIcon className="size-6 md:size-7" />
    </a>
  );
}
