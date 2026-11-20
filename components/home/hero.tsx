import { site } from "@/lib/site";
import { heroSlides } from "@/data/hero-slides";
import { BannerSlider } from "@/components/home/banner-slider";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      {/* The banners carry the visible headlines; this gives the page its main heading. */}
      <h1 id="hero-title" className="sr-only">
        {site.name}: women&apos;s ethnic wear in Bhopal
      </h1>
      {/* Aspect ratios match the banner files exactly: 1199×1312 on phones, about 2.12:1 from `sm` up. */}
      <BannerSlider
        slides={heroSlides}
        label="Featured collections"
        className="mx-auto max-w-[1920px]"
        frameClassName="aspect-[1199/1312] border-b border-gold/50 bg-background sm:aspect-[2.12/1]"
        sizes="(min-width: 1920px) 1920px, 100vw"
        priority
      />
    </section>
  );
}
