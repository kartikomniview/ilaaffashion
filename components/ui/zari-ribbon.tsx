import { cx } from "@/lib/style";

/**
 * Maroon velvet ribbon with gold gota edges and a scrolling ticker.
 * It's slightly wider than its container and tilted, so the parent should clip horizontal overflow.
 */
export function ZariRibbon({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cx("relative z-10 -mx-[5%] -rotate-[1.5deg] md:-rotate-1", className)}>
      <div className="ribbon py-1.5">
        <div className="overflow-hidden border-y border-dashed border-gold/60 py-3">
          <div className="marquee flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {items.map((text) => (
                  <li key={text} className="flex items-center gap-8 pr-8 text-gold">
                    <span className="text-[0.72rem] font-medium uppercase tracking-[0.4em]">{text}</span>
                    <span aria-hidden className="font-serif text-base text-secondary">
                      ✿
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
