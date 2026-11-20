import { offerBanners } from "@/data/offer-banners";
import { Container } from "@/components/ui/container";
import { BannerSlider } from "@/components/home/banner-slider";

/** Auto-scrolling discount banners between the home page's product sections. The frame is 3:1, the banners' exact shape. */
export function OfferBanners() {
  return (
    <Container>
      <BannerSlider
        slides={offerBanners}
        label="Showroom offers"
        className="rounded-xl"
        frameClassName="aspect-[3/1] rounded-xl bg-accent"
        // Container: 1280px wide at most, minus 40px side padding.
        sizes="(min-width: 80rem) 1200px, 100vw"
      />
    </Container>
  );
}
