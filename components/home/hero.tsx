import { site } from "@/lib/site";
import { heroSlides } from "@/data/hero-slides";
import { HeroSlider } from "@/components/home/hero-slider";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      {/* The banners carry the visible headlines; this gives the page its main heading. */}
      <h1 id="hero-title" className="sr-only">
        {site.name}: women&apos;s ethnic wear in Bhopal
      </h1>
      <HeroSlider slides={heroSlides} label="Featured collections" />
    </section>
  );
}
