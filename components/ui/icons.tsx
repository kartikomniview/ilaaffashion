// Brand glyphs that lucide-react v1 doesn't ship. Sized and coloured like lucide icons (currentColor).
import type { SVGProps } from "react";

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.3 15.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Z" />
      <path d="M8.6 7.1c.2-.4.4-.4.7-.4h.6c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.1.2-.2.4 0 .6.5.9 1.2 1.6 2.1 2.2.2.1.4.2.6 0l.7-.8c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.3.4.5 0 .7-.3 1.4-.9 1.8-.6.4-1.3.5-2 .3-2.3-.6-4.4-2.3-5.5-4.4-.6-1-.8-2.2-.6-3.1.1-.5.3-.9.5-1.2Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
