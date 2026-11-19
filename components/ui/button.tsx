import type { ComponentProps } from "react";
import Link from "next/link";
import { cx } from "@/lib/style";

type Variant = "primary" | "outline" | "gold" | "whatsapp" | "ghost";
type Size = "sm" | "md";

const base =
  "focus-ring inline-flex items-center justify-center gap-2 font-medium uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-light shadow-[0_10px_24px_-12px_rgb(101_13_25/0.7)] hover:bg-primary-hover",
  outline: "border border-primary/70 text-primary hover:bg-primary hover:text-light",
  gold: "bg-gold text-ink hover:bg-secondary-hover",
  // WhatsApp's own green (#25D366), used only on WhatsApp actions so they're instantly recognisable.
  // White text on it is hard to read (about 2:1), so the label is a very dark green (about 6.4:1).
  whatsapp: "bg-[#25D366] text-[#073B22] shadow-[0_10px_24px_-12px_rgb(37_211_102/0.7)] hover:bg-[#1EBE5A]",
  ghost: "text-primary underline decoration-gold decoration-dashed underline-offset-4 hover:text-primary-hover",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-[0.65rem] tracking-[0.2em]",
  md: "px-6 py-3 text-[0.7rem] tracking-[0.25em]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cx(base, variants[variant], variant !== "ghost" && sizes[size], variant === "ghost" && "text-[0.7rem] tracking-[0.25em]", className);
}

interface Style {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant, size, className, ...props }: ComponentProps<"button"> & Style) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

/** Internal links use next/link; set `external` for WhatsApp, Maps and other sites (opens a new tab). */
export function ButtonLink({
  variant,
  size,
  className,
  external,
  href,
  ...props
}: Omit<ComponentProps<"a">, "href"> & Style & { href: string; external?: boolean }) {
  const cls = buttonClass(variant, size, className);
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  }
  return <Link href={href} className={cls} {...props} />;
}
