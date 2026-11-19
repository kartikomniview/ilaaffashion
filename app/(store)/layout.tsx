import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

/** Shared chrome for every shop page: header, footer and the floating WhatsApp button. */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate flex min-h-svh flex-1 flex-col bg-background">
      <div aria-hidden className="grain fixed inset-0 -z-10" />
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </div>
  );
}
