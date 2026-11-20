// Full-page photo viewer, used when /products/[slug]/photos/[n] is opened directly or refreshed.
// In its own route group so it skips the shop's header and footer. Tapping a photo on the product
// page shows the same viewer as a modal instead: see app/(store)/@modal.
import { photoMetadata, photoStaticParams, PhotoViewerRoute, type PhotoParams } from "@/components/product/photo-viewer-route";

export function generateStaticParams() {
  return photoStaticParams();
}

export function generateMetadata({ params }: { params: PhotoParams }) {
  return photoMetadata(params);
}

export default function PhotoPage({ params }: { params: PhotoParams }) {
  return <PhotoViewerRoute params={params} modal={false} />;
}
