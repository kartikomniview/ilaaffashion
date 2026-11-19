import { cssVars, cx } from "@/lib/style";

const SPARKLE = "M0 -8 C1 -2 2 -1 8 0 C2 1 1 2 0 8 C-1 2 -2 1 -8 0 C-2 -1 -1 -2 0 -8 Z";

/** Four-point twinkling star. Position and size it with `className`; `delay` staggers the twinkle. */
export function Sparkle({ className, delay = "0s" }: { className?: string; delay?: string }) {
  return (
    <svg aria-hidden viewBox="-8 -8 16 16" className={cx("fill-gold", className)}>
      <path d={SPARKLE} className="twinkle" style={cssVars({ "--d": delay })} />
    </svg>
  );
}

/** Three-leaf finial from the logo. */
export function Finial({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 40 24" className={cx("fill-gold", className)}>
      <path d="M20 0 C25 6 25 14 20 22 C15 14 15 6 20 0 Z" />
      <path d="M18 20 C12 12 5 11 0 13 C5 18 12 21 18 21 Z" />
      <path d="M22 20 C28 12 35 11 40 13 C35 18 28 21 22 21 Z" />
    </svg>
  );
}
