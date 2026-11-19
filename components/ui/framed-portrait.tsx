import type { ReactNode } from "react";
import Image from "next/image";
import model from "@/public/images/model.webp";
import { Mandala } from "@/components/mandala";
import { Finial, Sparkle } from "@/components/ui/sparkle";
import { cssVars, cx } from "@/lib/style";

const sparkles = [
  { pos: "-left-8 top-[30%] size-5", d: "2s" },
  { pos: "-right-7 top-[64%] size-4", d: "3.4s" },
  { pos: "-left-6 bottom-[6%] size-3", d: "4.6s" },
];

/**
 * The model photo rising into a gold-edged frame, with a slowly turning mandala behind it, a gold
 * finial on top and twinkling sparkles. `children` are layered on top (e.g. the hanging tag).
 */
export function FramedPortrait({
  className,
  sizes = "(min-width: 768px) 400px, 72vw",
  children,
}: {
  className?: string;
  sizes?: string;
  children?: ReactNode;
}) {
  return (
    <figure className={cx("relative isolate aspect-[3/4.3]", className)}>
      {/* Faint mandala glowing behind the frame */}
      <div
        aria-hidden
        className="fade-in pointer-events-none absolute left-1/2 top-[46%] -z-10 w-[165%] -translate-x-1/2 -translate-y-1/2 text-gold"
      >
        {/* Opacity lives here: .fade-in on the wrapper animates to opacity 1. */}
        <Mandala className="mandala-spin w-full opacity-30" />
      </div>

      {/* Outer hairline frame, its corners concentric with the photo's */}
      <span
        aria-hidden
        className="fade-in absolute -inset-3 rounded-[2.25rem] border border-gold/60"
        style={cssVars({ "--d": "0.8s" })}
      />

      {/* Photo rises into the frame */}
      <div className="photo-reveal relative h-full overflow-hidden rounded-3xl shadow-[0_30px_60px_-25px_rgb(101_13_25/0.55)] ring-1 ring-gold">
        <Image
          src={model}
          alt="Model in a maroon anarkali with gold zari embroidery and a sheer gold dupatta, standing in a carved sandstone arch"
          fill
          placeholder="blur"
          preload
          sizes={sizes}
          className="ken-burns object-cover object-[50%_30%]"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-primary/35 to-transparent"
        />
      </div>

      <div className="fade-in absolute -top-10 left-1/2 w-12 -translate-x-1/2" style={cssVars({ "--d": "1.2s" })}>
        <Finial className="w-full" />
      </div>

      {sparkles.map(({ pos, d }) => (
        <Sparkle key={pos} delay={d} className={cx("absolute", pos)} />
      ))}

      {children}
    </figure>
  );
}
