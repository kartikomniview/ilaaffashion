import type { ReactNode } from "react";
import { cx } from "@/lib/style";

/** A swinging paper garment tag on a gold thread. Position it with `className`; contents go inside. */
export function GarmentTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("z-10", className)}>
      <div className="tag-drop">
        <div className="tag-swing flex flex-col items-center">
          <span aria-hidden className="relative z-10 -mb-[0.8rem] h-14 w-px bg-gold" />
          <div className="tag-shadow">
            <div className="tag w-[7.5rem] px-3 pb-4 pt-7 text-center">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
