import type { ComponentType } from "react";
import { MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { cx } from "@/lib/style";
import { WhatsAppIcon } from "@/components/ui/icons";

interface Announcement {
  text: string;
  /** "caps" is small tracked capitals in gold; "script" is serif italics in cream. */
  voice: "caps" | "script";
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
}

// The voices alternate, so keep the count even: then they still alternate where the loop joins.
const announcements: Announcement[] = [
  { text: "Order on WhatsApp", voice: "caps", icon: WhatsAppIcon },
  { text: "New arrivals, just in", voice: "script" },
  { text: `Visit us at ${site.address.shortLine}`, voice: "caps", icon: MapPin },
  { text: "The festive edit is here", voice: "script" },
  { text: "Kurtis, sarees, lehengas & more", voice: "caps" },
  { text: "Chosen with care in the City of Lakes", voice: "script" },
];

// One set is narrower than a wide screen, so the strip holds four and slides by two (the -50% in the
// marquee keyframes); that keeps the screen covered and the loop seamless.
const COPIES = [0, 1, 2, 3];

/** Maroon strip above the header with a scrolling line of announcements. */
export function AnnouncementBar() {
  return (
    <div className="bg-primary">
      <div className="marquee-pause flex h-9 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] motion-reduce:hidden">
        <div className="marquee flex w-max items-center [--marquee-duration:70s]">
          {COPIES.map((copy) => (
            <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
              {announcements.map(({ text, voice, icon: Icon }) => (
                <li key={text} className="flex items-center whitespace-nowrap">
                  <span
                    className={cx(
                      "flex items-center gap-2",
                      voice === "caps"
                        ? "text-[0.65rem] font-medium uppercase tracking-[0.3em] text-gold"
                        : "font-serif text-[0.95rem] italic tracking-wide text-light/90"
                    )}
                  >
                    {Icon && <Icon aria-hidden className="size-3.5 shrink-0" />}
                    {text}
                  </span>
                  <span aria-hidden className="px-6 text-[0.55rem] text-gold/70">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Held still for people who prefer reduced motion. */}
      <p className="hidden h-9 items-center justify-center px-4 text-center text-[0.65rem] uppercase tracking-[0.3em] text-gold motion-reduce:flex">
        Order on WhatsApp<span className="max-sm:hidden">&nbsp;· Visit us at {site.address.shortLine}</span>
      </p>
    </div>
  );
}
