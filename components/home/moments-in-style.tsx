import { styleVideos } from "@/data/style-videos";
import { getCategory, productsHref } from "@/lib/products";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoReel, type ReelClip } from "@/components/home/video-reel";

/** Short portrait clips of the range, each captioned with the category it shows and linking to it. */
export function MomentsInStyle() {
  const clips: ReelClip[] = styleVideos.map(({ category, ...clip }) => ({
    ...clip,
    name: getCategory(category)?.name ?? category,
    href: productsHref({ category: [category] }),
  }));
  return (
    <section aria-labelledby="moments-title" className="py-8 md:py-20">
      <Container>
        <SectionHeading title={<span id="moments-title">Moments in Style</span>} />
        <VideoReel clips={clips} />
      </Container>
    </section>
  );
}
