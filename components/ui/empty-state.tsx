import type { ReactNode } from "react";
import { Finial } from "@/components/ui/sparkle";

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-gold/60 bg-surface/60 px-6 py-16 text-center">
      <Finial className="mb-5 w-12" />
      <h2 className="font-serif text-xl font-medium text-ink sm:text-2xl">{title}</h2>
      {children && <div className="mt-3 max-w-md text-sm leading-relaxed text-muted">{children}</div>}
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}
