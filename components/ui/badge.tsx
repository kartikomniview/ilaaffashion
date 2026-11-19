import type { ReactNode } from "react";
import { cx } from "@/lib/style";

const tones = {
  new: "bg-gold text-ink",
  sale: "bg-primary text-light",
  muted: "bg-surface/90 text-muted ring-1 ring-border",
};

export function Badge({ tone = "new", children, className }: { tone?: keyof typeof tones; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.58rem] font-medium uppercase tracking-[0.2em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
