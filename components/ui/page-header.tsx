import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Toran } from "@/components/ui/toran";
import { cx } from "@/lib/style";

/** Title band for inner pages: toran, breadcrumbs, eyebrow, serif title and intro. */
export function PageHeader({
  crumbs,
  eyebrow,
  title,
  children,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx("silk-bg relative overflow-hidden border-b border-gold/30", className)}>
      <Toran id="toran-page" className="absolute inset-x-0 top-0" />
      <Container className="relative pb-8 pt-10 md:pb-12 md:pt-20">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <p className="mt-6 text-[0.68rem] uppercase tracking-[0.4em] text-primary">— {eyebrow}</p>}
        <h1 className="mt-2 font-serif text-[clamp(1.75rem,5vw,3.6rem)] font-medium leading-[1.02] text-ink">{title}</h1>
        {children && <div className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">{children}</div>}
      </Container>
    </section>
  );
}
