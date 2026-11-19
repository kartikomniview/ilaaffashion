import type { CSSProperties } from "react";

/** Inline CSS custom properties, e.g. style={cssVars({ "--d": "0.2s" })}. */
export const cssVars = (vars: Record<`--${string}`, string | undefined>) => vars as CSSProperties;

/** Joins class names, skipping falsy values. */
export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");
