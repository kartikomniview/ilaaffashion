import type { ReactNode } from "react";
import { cx } from "@/lib/style";

/** Eyebrow + serif title (+ optional description), with an optional action on the right. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cx(
        "mb-5 flex gap-3 sm:mb-7 sm:gap-4 md:mb-12",
        // Left-aligned: the action sits beside the title, dropping below it only when there isn't room.
        centered ? "flex-col items-center text-center" : "flex-wrap items-end justify-between",
        className
      )}
    >
      <div className={cx(centered && "flex flex-col items-center")}>
        {eyebrow && (
          <p className="mb-3 text-[0.68rem] uppercase tracking-[0.4em] text-primary">
            <span aria-hidden className="text-gold">
              —
            </span>{" "}
            {eyebrow}{" "}
            <span aria-hidden className="text-gold">
              —
            </span>
          </p>
        )}
        <Tag className="font-serif text-[clamp(1.5rem,4vw,2.9rem)] font-medium leading-[1.05] text-ink">{title}</Tag>
        {description && (
          <p className={cx("mt-3 max-w-xl text-sm leading-relaxed sm:mt-4 sm:text-[0.95rem] text-muted", centered && "mx-auto")}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
